import type { SupabaseClient } from "@supabase/supabase-js";
import type { AccountProfile, AccountRecentGameRaw } from "../types/account";

const PROFILE_FIELDS_CANDIDATES: string[] = [
  "id, username, avatar_url, email, status, allow_requests, role, location, first_name, last_name, birth_date, created_at, updated_at, subscription_tier, subscription_end_date",
  "id, username, avatar_url, email, status, allow_requests, role, first_name, last_name, birth_date, created_at, updated_at, subscription_tier, subscription_end_date",
  "id, username, avatar_url, email, status, allow_requests, first_name, last_name, birth_date, created_at, updated_at, subscription_tier, subscription_end_date",
];

export async function findAccountProfile(
  client: SupabaseClient,
  userId: string,
): Promise<AccountProfile> {
  let lastError: Error | null = null;

  for (const fields of PROFILE_FIELDS_CANDIDATES) {
    const { data, error } = await client.from("profiles").select(fields).eq("id", userId).maybeSingle();

    if (!error && data) {
      return data as unknown as AccountProfile;
    }

    if (error) {
      lastError = new Error(error.message || "No se pudo recuperar el perfil");
    }
  }

  throw lastError ?? new Error("Perfil no encontrado");
}

export async function patchAccountProfile(
  client: SupabaseClient,
  userId: string,
  patch: Partial<Omit<AccountProfile, "id">>,
): Promise<void> {
  const patchWithUpdatedAt: Partial<Omit<AccountProfile, "id">> = {
    ...patch,
    updated_at: new Date().toISOString(),
  };

  const { error } = await client.from("profiles").update(patchWithUpdatedAt).eq("id", userId);

  if (error) {
    throw new Error(error.message || "No se pudo actualizar el perfil");
  }
}

export async function findRecentGamesByUser(
  client: SupabaseClient,
  userId: string,
  limit = 5,
): Promise<AccountRecentGameRaw[]> {
  const { data, error } = await client
    .from("matches")
    .select("id, created_at, game:games(title)")
    .or(`player_1.eq.${userId},player_2.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message || "No se pudieron recuperar las partidas recientes");
  }

  const rows = (data ?? []) as Array<{
    id: number | string;
    created_at: string;
    game: { title: string | null } | Array<{ title: string | null }> | null;
  }>;

  return rows.map((row) => ({
    id: row.id,
    score: null,
    created_at: row.created_at,
    game: row.game,
  }));
}

export async function findAcceptedFriendsByUser(
  client: SupabaseClient,
  userId: string,
) {
  const { data, error } = await client
    .from("friendships")
    .select(
      "id, user_a, user_b, profile_a:profiles!friendships_user_a_fkey(username, avatar_url, status), profile_b:profiles!friendships_user_b_fkey(username, avatar_url, status)",
    )
    .eq("status", "accepted")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`);

  if (error) {
    throw new Error(error.message || "No se pudieron recuperar los amigos");
  }

  return data ?? [];
}
