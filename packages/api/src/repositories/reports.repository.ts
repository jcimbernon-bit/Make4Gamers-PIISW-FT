import type { SupabaseClient } from "@supabase/supabase-js";

export type ReportableUserRow = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  status: string | null;
};

export type ReportableGameRow = {
  id: string;
  title: string | null;
  thumbnail_url: string | null;
  status: string | null;
  genre: string | null;
};

export type UserReportRow = {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  details: string | null;
  created_at: string;
};

export type GameReportRow = {
  id: string;
  reporter_id: string;
  game_id: string;
  reason: string;
  details: string | null;
  created_at: string;
};

export async function insertUserReport(
  client: SupabaseClient,
  input: {
    reporterId: string;
    reportedId: string;
    reason: string;
    details?: string;
  }
): Promise<void> {
  const { error } = await client.from("user_reports").insert([
    {
      reporter_id: input.reporterId,
      reported_id: input.reportedId,
      reason: input.reason,
      details: input.details || null,
    },
  ]);

  if (error) {
    throw new Error(error.message || "No se pudo enviar el reporte");
  }
}

export async function findUsersToReportByUsername(
  client: SupabaseClient,
  input: {
    reporterId: string;
    usernameQuery: string;
    limit?: number;
  },
): Promise<ReportableUserRow[]> {
  const { data, error } = await client
    .from("profiles")
    .select("id, username, avatar_url, status")
    .ilike("username", `%${input.usernameQuery}%`)
    .neq("id", input.reporterId)
    .limit(input.limit ?? 10);

  if (error) {
    throw new Error(error.message || "No se pudieron buscar usuarios para reportar");
  }

  return (data ?? []) as ReportableUserRow[];
}

export async function insertGameReport(
  client: SupabaseClient,
  input: {
    reporterId: string;
    gameId: string;
    reason: string;
    details?: string;
  }
): Promise<void> {
  const { error } = await client.from("game_reports").insert([
    {
      reporter_id: input.reporterId,
      game_id: input.gameId,
      reason: input.reason,
      details: input.details || null,
    },
  ]);

  if (error) {
    throw new Error(error.message || "No se pudo enviar el reporte del juego");
  }
}

export async function findGamesToReportByTitle(
  client: SupabaseClient,
  input: {
    titleQuery: string;
    limit?: number;
  },
): Promise<ReportableGameRow[]> {
  const { data, error } = await client
    .from("games")
    .select("id, title, thumbnail_url, status, genre")
    .ilike("title", `%${input.titleQuery}%`)
    .limit(input.limit ?? 10);

  if (error) {
    throw new Error(error.message || "No se pudieron buscar juegos para reportar");
  }

  return (data ?? []) as ReportableGameRow[];
}

export async function findUserReportsByReporter(
  client: SupabaseClient,
  reporterId: string,
): Promise<UserReportRow[]> {
  const { data, error } = await client
    .from("user_reports")
    .select("id, reporter_id, reported_id, reason, details, created_at")
    .eq("reporter_id", reporterId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "No se pudieron recuperar los reportes de usuarios");
  }

  return (data ?? []) as UserReportRow[];
}

export async function findGameReportsByReporter(
  client: SupabaseClient,
  reporterId: string,
): Promise<GameReportRow[]> {
  const { data, error } = await client
    .from("game_reports")
    .select("id, reporter_id, game_id, reason, details, created_at")
    .eq("reporter_id", reporterId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "No se pudieron recuperar los reportes de juegos");
  }

  return (data ?? []) as GameReportRow[];
}

export async function findReportUsersByIds(
  client: SupabaseClient,
  userIds: string[],
): Promise<ReportableUserRow[]> {
  if (userIds.length === 0) {
    return [];
  }

  const { data, error } = await client
    .from("profiles")
    .select("id, username, avatar_url, status")
    .in("id", userIds);

  if (error) {
    throw new Error(error.message || "No se pudieron recuperar los usuarios reportados");
  }

  return (data ?? []) as ReportableUserRow[];
}

export async function findReportGamesByIds(
  client: SupabaseClient,
  gameIds: string[],
): Promise<ReportableGameRow[]> {
  if (gameIds.length === 0) {
    return [];
  }

  const { data, error } = await client
    .from("games")
    .select("id, title, thumbnail_url, status, genre")
    .in("id", gameIds);

  if (error) {
    throw new Error(error.message || "No se pudieron recuperar los juegos reportados");
  }

  return (data ?? []) as ReportableGameRow[];
}
