import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type LastPlayedStatus =
  | "loading"
  | "never"        // nunca ha jugado
  | "long_ago"     // jugó hace más de una semana
  | "recent";      // jugó esta semana

export function useLastPlayed(
  userId: string | null,
  gameId: string | null,
): LastPlayedStatus {
  const [status, setStatus] = useState<LastPlayedStatus>("loading");

  useEffect(() => {
    if (!userId || !gameId) return;

    supabase
      .from("matches")
      .select("created_at")
      .eq("game_id", gameId)
      .or(`player_1.eq.${userId},player_2.eq.${userId}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          // Si falla la query, no bloqueamos al jugador
          setStatus("recent");
          return;
        }

        if (!data) {
          setStatus("never");
          return;
        }

        const lastDate = new Date(data.created_at).getTime();
        const elapsed = Date.now() - lastDate;
        setStatus(elapsed > ONE_WEEK_MS ? "long_ago" : "recent");
      });
  }, [userId, gameId]);

  return status;
}
