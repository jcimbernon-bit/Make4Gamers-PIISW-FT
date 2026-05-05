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
  // Filtramos solo por player_1/player_2 (columnas garantizadas).
  // select("*") recoge también player_3, player_4… si existen en la tabla.
  const orFilter = `player_1.eq.${userId},player_2.eq.${userId}`;

  const { data: match, error } = await supabase
    .from("matches")
    .select("*")
    .eq("game_id", gameId)
    .eq("status", "in_progress")
    .or(orFilter)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[useActiveMatch] Error buscando partida:", error.message);
    return null;
  }

  if (match) return loadMatchWithPlayers(match as RawMatch);

  // Fallback: la partida fue creada por el juego con su propio game_id
  const { data: fallbackMatch, error: fallbackError } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "in_progress")
    .or(orFilter)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError) {
    console.error("[useActiveMatch] Error en fallback:", fallbackError.message);
    return null;
  }

  if (!fallbackMatch) return null;
  return loadMatchWithPlayers(fallbackMatch as RawMatch);
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
  gameIdRef.current = gameId;
  userIdRef.current = userId;
  forcedMatchIdRef.current = forcedMatchId;

  useEffect(() => {
    if (!userId) return;
    // Si no se fuerza un match concreto, necesitamos gameId para la búsqueda heurística
    if (!forcedMatchId && !gameId) return;

    let isMounted = true;
    setLoading(true);

    const loader = forcedMatchId
      ? fetchMatchById(forcedMatchId, userId)
      : fetchActiveMatch(gameId as string, userId);

    loader
      .then((data) => {
        if (isMounted) setMatch(data);
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

          const currentGameId = gameIdRef.current;
          const currentUserId = userIdRef.current;
          const currentForcedId = forcedMatchIdRef.current;

          // Si estamos en modo "match forzado", solo nos importa esa partida
          if (currentForcedId) {
            if (row.id !== currentForcedId) return;
          } else {
            if (row.game_id !== currentGameId) return;
          }

          const playerIds = extractPlayerIds(row);
          if (!playerIds.includes(currentUserId)) return;

          if (row.status === "in_progress") {
            loadMatchWithPlayers(row)
              .then((data) => { if (isMounted) setMatch(data); })
              .catch(console.error);
          } else {
            // En modo forzado mantenemos los datos aunque la partida termine
            // (para que el usuario vea el último estado). En modo heurístico,
            // limpiamos como antes.
            if (!currentForcedId && isMounted) setMatch(null);
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
