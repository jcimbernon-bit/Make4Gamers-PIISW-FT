import type { SupabaseClient } from "@supabase/supabase-js";
import type { Game } from "../types/game";

const GAME_SELECT_FIELDS = `
  id,
  developer_id,
  title,
  slug,
  description,
  thumbnail_url,
  game_url,
  manual_url,
  status,
  version,
  genre,
  available_modes,
  created_at,
  updated_at,
  rating,
  players,
  edad_minima,
  price
`;


export async function findAllGames(client: SupabaseClient, isPremium: boolean = false): Promise<Game[]> {

  let query = client
    .from("games")
    .select(GAME_SELECT_FIELDS);


  if (isPremium) {
   
    query = query.in('status', ['published', 'review']);
  } else {
   
    query = query.eq('status', 'published');
  }

 
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "No se pudieron recuperar los juegos");
  }

  return (data ?? []) as Game[];
}

export async function findGameById(client: SupabaseClient, id: string): Promise<Game> {
  const { data, error } = await client
    .from("games")
    .select(GAME_SELECT_FIELDS)
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "No se encontró el juego");
  }

  return data as Game;
}