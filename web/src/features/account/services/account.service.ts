import {
  getAccountFriends as getAccountFriendsFromApi,
  getAccountProfile as getAccountProfileFromApi,
  getAccountRecentGames as getAccountRecentGamesFromApi,
  updateAccountProfile as updateAccountProfileFromApi,
  type AccountFriend,
  type AccountProfile,
  type AccountRecentGame,
} from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export type { AccountProfile, AccountRecentGame, AccountFriend };

export type DeveloperRequestStatus = "pendiente" | "aceptada" | "rechazada";

export type DeveloperRequest = {
  id: string;
  user_id: string;
  titulo: string;
  motivo: string;
  estado: DeveloperRequestStatus;
  created_at: string;
  reviewed_at: string | null;
};

export function getAccountProfile(userId: string): Promise<AccountProfile> {
  return getAccountProfileFromApi(supabase, userId);
}

export function updateAccountProfile(
  userId: string,
  patch: Partial<Omit<AccountProfile, "id">>,
): Promise<void> {
  return updateAccountProfileFromApi(supabase, userId, patch);
}

export function getAccountRecentGames(userId: string, limit = 5): Promise<AccountRecentGame[]> {
  return getAccountRecentGamesFromApi(supabase, userId, limit);
}

export function getAccountFriends(userId: string): Promise<AccountFriend[]> {
  return getAccountFriendsFromApi(supabase, userId);
}

export async function getAccountHighScores(userId: string) {
  const { data, error } = await supabase
    .from('scores')
    .select(`id, score, game:games(title)`)
    .eq('user_id', userId)
    .order('score', { ascending: false });

  if (error || !data) {
    console.error("Error obteniendo récords:", error);
    return [];
  }

  const bestScores: any[] = [];
  const seenGames = new Set();

  data.forEach((item: any) => {
    const gameData = item.game;
    const gameTitle = (Array.isArray(gameData) ? gameData[0]?.title : gameData?.title) || 'Desconocido';

    if (!seenGames.has(gameTitle)) {
      seenGames.add(gameTitle);
      bestScores.push({ ...item, displayTitle: gameTitle });
    }
  });

  return bestScores.slice(0, 3);
}



export interface GameStat {
  name: string;
  plays: number;
  highScore: number;
}

export interface ScoreHistory {
  date: string;
  score: number;
  game: string;
}



export interface GameStat {
  name: string;
  plays: number;
  highScore: number;
}

export async function getUserDetailedStats(userId: string) {
  try {
    const { data: scoreDataRaw } = await supabase
      .from('scores')
      .select('score, created_at, game:games(title)')
      .eq('user_id', userId);

    const { data: matchesDataRaw } = await supabase
      .from('matches')
      .select('created_at, game:games(title)')
      .eq('player_1', userId);

    const scoreData: any[] = scoreDataRaw || [];
    const matchesData: any[] = matchesDataRaw || [];

    const gameMap: Record<string, GameStat> = {};

    
    matchesData.forEach(match => {
      const rawTitle = Array.isArray(match.game) ? match.game[0]?.title : match.game?.title;
      const title = rawTitle || 'Desconocido';

      if (!gameMap[title]) {
        gameMap[title] = { name: title, plays: 0, highScore: 0 };
      }
      gameMap[title].plays += 1;
    });

    
    scoreData.forEach(item => {
      const rawTitle = Array.isArray(item.game) ? item.game[0]?.title : item.game?.title;
      const title = rawTitle || 'Desconocido';

      if (!gameMap[title]) {
        gameMap[title] = { name: title, plays: 0, highScore: 0 };
      }
      if (item.score > gameMap[title].highScore) {
        gameMap[title].highScore = item.score;
      }
    });

    const chartData = Object.values(gameMap);

    const getWeekKey = (date: Date) => {
      const copy = new Date(date);
      const day = copy.getDay();
      const monday = new Date(copy);
      monday.setDate(copy.getDate() - ((day + 6) % 7));
      return monday.toISOString().slice(0, 10);
    };

    const dailyCounts: Record<string, number> = {};
    const weeklyCounts: Record<string, number> = {};
    const monthlyCounts: Record<string, number> = {};

    matchesData.forEach(match => {
      const date = new Date(match.created_at);
      const dayKey = date.toISOString().slice(0, 10);
      const weekKey = getWeekKey(date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      dailyCounts[dayKey] = (dailyCounts[dayKey] ?? 0) + 1;
      weeklyCounts[weekKey] = (weeklyCounts[weekKey] ?? 0) + 1;
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] ?? 0) + 1;
    });

    const currentDate = new Date();
    const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return {
        name: date.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }),
        count: dailyCounts[key] ?? 0,
      };
    });

    const lastSixWeeks = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - 7 * (5 - index));
      const key = getWeekKey(date);
      return {
        name: `Semana ${index + 1}`,
        count: weeklyCounts[key] ?? 0,
      };
    });

    const lastSixMonths = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - (5 - index));
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      return {
        name: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        count: monthlyCounts[key] ?? 0,
      };
    });

    const historyData = matchesData
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) 
      .slice(0, 8) 
      .map(match => {
        const rawTitle = Array.isArray(match.game) ? match.game[0]?.title : match.game?.title;
        return {
          date: new Date(match.created_at).toLocaleDateString('es-ES'),
          time: new Date(match.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          game: rawTitle || 'Juego',
          status: 'Partida Jugada'
        };
      });

    const totalMatches = matchesData.length; 
    const highestScore = scoreData.length > 0 ? Math.max(...scoreData.map(s => s.score)) : 0;
    const totalUsersQuery = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    const totalUsers = totalUsersQuery.count ?? 0;
    
    const favorite = chartData.reduce((prev, current) => 
      (prev.plays > current.plays) ? prev : current, 
      { name: 'Aún sin datos', plays: 0 }
    );

    return {
      totalMatches,
      highestScore,
      totalUsers,
      totalGames: chartData.length,
      matchesThisWeek: lastSixWeeks.reduce((sum, entry) => sum + entry.count, 0),
      matchesThisMonth: lastSixMonths.reduce((sum, entry) => sum + entry.count, 0),
      periodChartData: {
        daily: lastSevenDays,
        weekly: lastSixWeeks,
        monthly: lastSixMonths,
      },
      favoriteGame: favorite.name,
      favoriteGamePlays: favorite.plays,
      chartData, 
      historyData 
    };

  } catch (error) {
    console.error("Error en el servicio de estadísticas:", error);
    return null;
  }
}

export async function getLatestDeveloperRequest(userId: string): Promise<DeveloperRequest | null> {
  const { data, error } = await supabase
    .from("developer_requests")
    .select("id, user_id, titulo, motivo, estado, created_at, reviewed_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function createDeveloperRequest(input: {
  userId: string;
  titulo: string;
  motivo: string;
}): Promise<DeveloperRequest> {
  const { data, error } = await supabase
    .from("developer_requests")
    .insert({
      user_id: input.userId,
      titulo: input.titulo,
      motivo: input.motivo,
      estado: "pendiente",
    })
    .select("id, user_id, titulo, motivo, estado, created_at, reviewed_at")
    .single();

  if (error || !data) {
    throw error ?? new Error("No se pudo crear la solicitud de developer");
  }

  return data;
}

export async function cancelDeveloperRequest(input: {
  requestId: string;
  userId: string;
}): Promise<void> {
  const { error } = await supabase
    .from("developer_requests")
    .delete()
    .eq("id", input.requestId)
    .eq("user_id", input.userId)
    .eq("estado", "pendiente");

  if (error) {
    throw error;
  }
}
