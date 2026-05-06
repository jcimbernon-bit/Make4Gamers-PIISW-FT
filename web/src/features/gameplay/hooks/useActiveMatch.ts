import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase";

export type MatchPlayer = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

export type ActiveMatchData = {
  id: string;
  player_1: string;
  player_2: string | null;
  players: MatchPlayer[];
};

type RawMatch = Record<string, unknown> & {
  id: string;
  game_id: string;
  status: string;
};

/** Extrae todos los valores de columnas player_1, player_2, player_3… que no sean null */
function extractPlayerIds(row: RawMatch): string[] {
  const ids: string[] = [];
  let i = 1;
  while (row[`player_${i}`] !== undefined) {
    const val = row[`player_${i}`];
    if (typeof val === "string" && val) ids.push(val);
    i++;
  }
  return ids;
}

async function loadMatchWithPlayers(matchRow: RawMatch): Promise<ActiveMatchData> {
  const playerIds = extractPlayerIds(matchRow);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", playerIds);

  const players: MatchPlayer[] = playerIds.map((pid) => {
    const profile = profiles?.find((p) => p.id === pid);
    return {
      id: pid,
      username: profile?.username ?? null,
      avatar_url: profile?.avatar_url ?? null,
    };
  });

  return {
    id: matchRow.id as string,
    player_1: matchRow.player_1 as string,
    player_2: (matchRow.player_2 as string | null) ?? null,
    players,
  };
}

async function fetchMatchById(
  matchId: string,
  userId: string,
): Promise<ActiveMatchData | null> {
  const { data: match, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .maybeSingle();

  if (error) {
    console.error("[useActiveMatch] Error cargando match por id:", error.message);
    return null;
  }

  if (!match) return null;

  // Validar que el usuario pertenece a la partida
  const playerIds = extractPlayerIds(match as RawMatch);
  if (!playerIds.includes(userId)) {
    console.warn("[useActiveMatch] El usuario no pertenece a la partida solicitada");
    return null;
  }

  return loadMatchWithPlayers(match as RawMatch);
}

async function fetchActiveMatch(
  gameId: string,
  userId: string,
): Promise<ActiveMatchData | null> {
  // Soportamos hasta player_4. Solo buscamos partidas con status="new":
  // si no hay ninguna recién creada, la página debe arrancar limpia.
  // Las partidas in_progress se reanudan vía la URL /game/:id/:matchId
  // o cuando el iframe emite MATCH_STARTED al arrancar.
  const orFilter = `player_1.eq.${userId},player_2.eq.${userId},player_3.eq.${userId},player_4.eq.${userId}`;

  const { data: match, error } = await supabase
    .from("matches")
    .select("*")
    .eq("game_id", gameId)
    .eq("status", "new")
    .or(orFilter)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[useActiveMatch] Error buscando partida:", error.message);
    return null;
  }

  if (!match) return null;
  return loadMatchWithPlayers(match as RawMatch);
}

export function useActiveMatch(
  gameId: string | null,
  userId: string | null,
  forcedMatchId: string | null = null,
) {
  const [match, setMatch] = useState<ActiveMatchData | null>(null);
  const [loading, setLoading] = useState(false);
  const gameIdRef = useRef(gameId);
  const userIdRef = useRef(userId);
  const forcedMatchIdRef = useRef(forcedMatchId);
  // ID del match que estamos trackeando en modo heurístico. Una vez detectado
  // (vía fetch inicial o INSERT con status="new"), aceptamos cualquier UPDATE
  // posterior sobre él — incluso cuando pasa a "in_progress" o "finished" —
  // para no perder los datos de la partida.
  const trackedMatchIdRef = useRef<string | null>(null);
  gameIdRef.current = gameId;
  userIdRef.current = userId;
  forcedMatchIdRef.current = forcedMatchId;

  useEffect(() => {
    if (!userId) return;
    if (!forcedMatchId && !gameId) return;

    let isMounted = true;
    setLoading(true);
    trackedMatchIdRef.current = null;

    const loader = forcedMatchId
      ? fetchMatchById(forcedMatchId, userId)
      : fetchActiveMatch(gameId as string, userId);

    loader
      .then((data) => {
        if (!isMounted) return;
        setMatch(data);
        // En modo heurístico, si el fetch inicial encontró un match, lo trackeamos
        if (data && !forcedMatchId) {
          trackedMatchIdRef.current = data.id;
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    const channelKey = forcedMatchId
      ? `active-match-id-${forcedMatchId}`
      : `active-match-${gameId}-${userId}`;

    const channel = supabase
      .channel(channelKey)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        (payload) => {
          const row = (payload.new ?? payload.old) as RawMatch | null;
          if (!row) return;

          const currentUserId = userIdRef.current;
          const currentForcedId = forcedMatchIdRef.current;
          const currentGameId = gameIdRef.current;
          const eventType = payload.eventType;

          // ===== MODO FORZADO (path /game/:id/:matchId) =====
          // Solo nos importa el match concreto, en cualquier estado.
          if (currentForcedId) {
            if (row.id !== currentForcedId) return;
            const playerIds = extractPlayerIds(row);
            if (!playerIds.includes(currentUserId)) return;
            loadMatchWithPlayers(row)
              .then((data) => { if (isMounted) setMatch(data); })
              .catch(console.error);
            return;
          }

          // ===== MODO HEURÍSTICO (path /game/:id) =====
          if (row.game_id !== currentGameId) return;
          const playerIds = extractPlayerIds(row);
          if (!playerIds.includes(currentUserId)) return;

          // INSERT: match recién creado. Si tiene status="new" y soy jugador,
          // lo empezamos a trackear y cargamos sus datos.
          if (eventType === "INSERT") {
            if (row.status !== "new") return;
            trackedMatchIdRef.current = row.id;
            loadMatchWithPlayers(row)
              .then((data) => { if (isMounted) setMatch(data); })
              .catch(console.error);
            return;
          }

          // UPDATE: solo procesamos updates del match que ya estamos trackeando.
          // Esto preserva los datos cuando el status pasa de "new" → "in_progress"
          // → "finished" sin perder los datos cargados.
          if (eventType === "UPDATE") {
            if (row.id !== trackedMatchIdRef.current) return;
            loadMatchWithPlayers(row)
              .then((data) => { if (isMounted) setMatch(data); })
              .catch(console.error);
            return;
          }

          // DELETE: si borran el match que trackeamos, limpiamos
          if (eventType === "DELETE" && row.id === trackedMatchIdRef.current) {
            trackedMatchIdRef.current = null;
            if (isMounted) setMatch(null);
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, [gameId, userId, forcedMatchId]);

  return { match, loading };
}
