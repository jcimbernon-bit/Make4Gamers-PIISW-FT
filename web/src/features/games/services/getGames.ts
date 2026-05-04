import { getGames as getGamesFromApi, type Game } from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export type { Game };

export async function getGames(isPremium: boolean = false): Promise<Game[]> {
  return getGamesFromApi(supabase, isPremium);
}