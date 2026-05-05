import type { SupabaseClient } from "@supabase/supabase-js";

export type ActiveMatch = {
  id: string;
  player_1: string;
  player_2: string | null;
  status: string;
};

export async function findActiveMatch(
  client: SupabaseClient,
  gameId: string,
  userId: string,
): Promise<ActiveMatch | null> {
  const { data, error } = await client
    .from("matches")
    .select("id, player_1, player_2, status")
    .eq("game_id", gameId)
    .eq("status", "in_progress")
    .or(`player_1.eq.${userId},player_2.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function insertMatch(
  client: SupabaseClient,
  input: { gameId: string; userId: string; sessionTimerSeconds?: number | null },
): Promise<string> {

  // Prevención de duplicados: buscar si el usuario es player_1 o player_2 en una partida en progreso
  const { data: existingMatch, error: checkError } = await client
    .from("matches")
    .select("id")
    .eq("game_id", input.gameId)
    .eq("status", "in_progress")
    .or(`player_1.eq.${input.userId},player_2.eq.${input.userId}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!checkError && existingMatch?.id) {
    // Ya existe un match en progreso para este usuario y juego
    return existingMatch.id as string;
  }

  const basePayload = {
    game_id: input.gameId,
    player_1: input.userId,
    status: "in_progress",
  };

  // Best-effort: si el schema todavía no tiene la columna, intentamos insertar sin el timer.
  const payloadWithTimer =
    input.sessionTimerSeconds === undefined
      ? basePayload
      : { ...basePayload, session_timer_seconds: input.sessionTimerSeconds };

  const tryInsert = async (payload: Record<string, unknown>) => {
    const { data, error } = await client
      .from("matches")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data?.id) {
      throw new Error(error?.message || "No se pudo crear la partida");
    }

    return data.id as string;
  };

  try {
    return await tryInsert(payloadWithTimer);
  } catch (err) {
    const message = (err as { message?: string } | undefined)?.message ?? "";

    // Si falla por columnas de timer inexistentes, fallback a inserción básica.
    const looksLikeMissingTimerColumn =
      /session_timer_seconds|column .* does not exist/i.test(message);

    if (!looksLikeMissingTimerColumn) throw err;

    console.warn(
      "[matches.repository] No se pudo insertar session_timer_seconds; creando match sin temporizador.",
      message,
    );
    return await tryInsert(basePayload);
  }
}
