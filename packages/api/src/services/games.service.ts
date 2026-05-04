import type { SupabaseClient } from "@supabase/supabase-js";
import { findAllGames, findGameById } from "../repositories/games.repository";

export function getGames(client: SupabaseClient, isPremium: boolean = false) {
  return findAllGames(client, isPremium);
}

export function getGameById(client: SupabaseClient, id: string) {
  return findGameById(client, id);
}