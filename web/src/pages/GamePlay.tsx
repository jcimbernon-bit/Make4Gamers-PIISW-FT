import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


import { getGameById, type Game } from "../features/games/services/getGameById.service";
import { getAuthenticatedUserId } from "../features/auth/services/auth.service";
import { supabase } from '../supabase';

import GameViewport from "../features/gameplay/components/GameViewport";
import GameplaySidebar from "../features/gameplay/components/GameplaySidebar";
import AgeGuard from "../features/chat/components/AgeGuard";
import PlayersBar from "../features/gameplay/components/PlayersBar";
import RulesReminderModal from "../features/gameplay/components/RulesReminderModal";
import { useActiveMatch, type MatchPlayer } from "../features/gameplay/hooks/useActiveMatch";
import { useMatchMovements } from "../features/gameplay/hooks/useMatchMovements";
import { useLastPlayed } from "../features/gameplay/hooks/useLastPlayed";


export default function Gameplay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>("anonimo");

  const [timerPreset, setTimerPreset] = useState<"none" | "2" | "5" | "10" | "custom">("none");
  const [customMinutes, setCustomMinutes] = useState<string>("");
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerExpired, setTimerExpired] = useState<boolean>(false);
  const [sessionTimerEndsAtMs, setSessionTimerEndsAtMs] = useState<number | null>(null);
  const [sessionTimerSecondsRemaining, setSessionTimerSecondsRemaining] = useState<number | null>(null);
  const [startingSession, setStartingSession] = useState<boolean>(false);

  const [iframeMatchId, setIframeMatchId] = useState<string | null>(null);

  const { match, loading: matchLoading } = useActiveMatch(id ?? null, userId);
  const lastPlayedStatus = useLastPlayed(userId, id ?? null);
  const [rulesReminderDismissed, setRulesReminderDismissed] = useState(false);
  const showRulesReminder =
    !rulesReminderDismissed &&
    !timerActive &&
    (lastPlayedStatus === "never" || lastPlayedStatus === "long_ago");
  const matchId = match?.id ?? iframeMatchId;
  const { movements } = useMatchMovements(matchId, userId);
  const lastMovedPlayerId = movements.at(-1)?.player_id ?? null;

  const [extraPlayers, setExtraPlayers] = useState<MatchPlayer[]>([]);

  useEffect(() => {
    const knownIds = new Set((match?.players ?? []).map((p) => p.id));
    const extraIds = [...new Set(movements.map((m) => m.player_id))].filter(
      (pid) => !knownIds.has(pid),
    );
    if (!extraIds.length) {
      setExtraPlayers([]);
      return;
    }
    supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", extraIds)
      .then(({ data }) => {
        if (data) setExtraPlayers(data as MatchPlayer[]);
      });
  }, [movements, match]);

  const allPlayers = useMemo(() => {
    const base = match?.players ?? [];
    const knownIds = new Set(base.map((p) => p.id));
    return [...base, ...extraPlayers.filter((p) => !knownIds.has(p.id))];
  }, [match, extraPlayers]);


  const [edadMinima, setEdadMinima] = useState<number>(3);

  useEffect(() => {
    if (!id) return;
    
    const fetchEdadMinima = async () => {      
      const { data, error } = await supabase
        .from('games')
        .select('edad_minima')
        .eq('id', id)
        .single();
                
      if (!error && data?.edad_minima) {
        setEdadMinima(data.edad_minima);
      }
    };
    
    fetchEdadMinima();
  }, [id]);

  useEffect(() => {
    const loadGame = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getGameById(id);
        setGame(data);
      } catch (error) {
        console.error("Error loading game:", error);
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUserId = await getAuthenticatedUserId();
      setUserId(currentUserId);
    };

    fetchUser();
  }, []);

  const formatSeconds = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const timerSeconds = useMemo(() => {
    switch (timerPreset) {
      case "none":
        return 0;
      case "2":
        return 2 * 60;
      case "5":
        return 5 * 60;
      case "10":
        return 10 * 60;
      case "custom": {
        const minutes = Math.floor(Number(customMinutes));
        if (!Number.isFinite(minutes) || minutes <= 0) return null;
        
        if (minutes > 180) return null;
        return minutes * 60;
      }
      default:
        return null;
    }
  }, [timerPreset, customMinutes]);

  const finalGameUrl = useMemo(() => {
    if (!game?.game_url) return "";

    const currentGameId = game.id || id || "";
    const url = new URL(game.game_url);
    url.searchParams.set("player", playerName);
    url.searchParams.set("gameId", currentGameId);

    return url.toString();
  }, [game, id, playerName]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg) return;
      if (msg.type === "MATCH_CREATED" && typeof msg.matchId === "string") {
        console.log("[GamePlay] match_id recibido del juego:", msg.matchId);
        setIframeMatchId(msg.matchId);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!timerActive || sessionTimerEndsAtMs == null) return;

    const tick = () => {
      const remainingMs = sessionTimerEndsAtMs - Date.now();
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
      setSessionTimerSecondsRemaining(remainingSeconds);

      if (remainingMs <= 0) {
        setTimerExpired(true);
        setSessionTimerSecondsRemaining(0);
      }
    };

    const intervalId = setInterval(() => tick(), 250);
    tick();

    return () => {
      clearInterval(intervalId);
    };
  }, [timerActive, sessionTimerEndsAtMs]);

  const handleStartSession = async () => {
    if (!game?.id) return;
    if (startingSession) return;

    const seconds = timerSeconds;
    const normalizedSeconds = seconds == null ? null : seconds;

    if (timerPreset === "custom" && normalizedSeconds == null) return;

    setStartingSession(true);
    setTimerExpired(false);

    const resolvedPlayerName = userId || "anonimo";
    setPlayerName(resolvedPlayerName);

    setTimerActive(true);

    if (normalizedSeconds != null && normalizedSeconds > 0) {
      const endsAt = Date.now() + normalizedSeconds * 1000;
      setSessionTimerEndsAtMs(endsAt);
      setSessionTimerSecondsRemaining(normalizedSeconds);
    } else {
      setSessionTimerEndsAtMs(null);
      setSessionTimerSecondsRemaining(null);
    }

    setStartingSession(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-300 text-lg font-medium animate-pulse">
            {t("gameplay.loading")}
          </p>
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <p className="text-red-400 text-lg font-semibold">
            {t("gameplay.notFound")}
          </p>
          <button
            onClick={() => navigate("/juegos")}
            className="mt-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            {t("gameplay.backToGames")}
          </button>
        </div>
      </div>
    );

  return (
    <AgeGuard edadMinima={edadMinima}>
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(99,102,241,0.07),transparent)] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        {/* Línea de acento superior */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        <div className="mx-auto w-full max-w-[1200px] px-8 lg:px-14 py-4 flex items-center justify-between">
          <div className="max-w-[70%]">
            <h1 className="text-xl font-semibold leading-tight">{game.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {game.genre ?? t("gameplay.noGenre")} {game.rating ? `· ⭐ ${game.rating}` : ""}
            </p>
          </div>

          <button
            onClick={() =>
              navigate(`/juegos/${game.id}/reglas`, {
                state: {
                  game: {
                    id: game.id,
                    title: game.title,
                    rules_markdown_url: game.manual_url,
                  },
                },
              })
            }
            className="shrink-0 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
          >
            {t("gameplay.rules")}
          </button>
        </div>
      </div>

      <div className="mt-6 mb-8">
        <div className="mx-auto w-full max-w-[1200px] px-8 lg:px-14">
          {/* Contenedor que iguala el ancho de PlayersBar al del grid */}
          <div className="w-full lg:w-fit lg:mx-auto flex flex-col gap-3">

          {(match || matchLoading) && (
            <PlayersBar
              players={allPlayers}
              currentUserId={userId}
              lastMovedPlayerId={lastMovedPlayerId}
              loading={matchLoading}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[800px_320px] gap-4 items-stretch">
            <section className="relative h-[600px] w-full max-w-[800px] rounded-xl overflow-hidden bg-black border border-indigo-500/50 shadow-xl shadow-indigo-500/10 transition-all duration-300">
              {timerActive ? <GameViewport src={finalGameUrl} title={`game-${game.id}`} ratio="4:3" /> : null}

             
              {showRulesReminder && game && (
                <RulesReminderModal
                  gameId={game.id}
                  gameTitle={game.title}
                  rulesUrl={game.manual_url}
                  status={lastPlayedStatus}
                  onDismiss={() => setRulesReminderDismissed(true)}
                  onGoToRules={() =>
                    navigate(`/juegos/${game.id}/reglas`, {
                      state: {
                        game: {
                          id: game.id,
                          title: game.title,
                          rules_markdown_url: game.manual_url,
                        },
                      },
                    })
                  }
                />
              )}

              {!timerActive && !showRulesReminder ? (
                <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-6">
                  <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl shadow-indigo-500/10">
                    <h2 className="text-lg font-bold text-white mb-3">Duración del turno</h2>
                    <p className="text-sm text-slate-300 mb-4">
                      El temporizador limita cuánto tiempo puedes jugar por turno. Cuando termine, se agotará el turno.
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setTimerPreset("none")}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          timerPreset === "none"
                            ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-300"
                            : "border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-indigo-500/30"
                        }`}
                      >
                        Sin temporizador
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimerPreset("2")}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          timerPreset === "2"
                            ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-300"
                            : "border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-indigo-500/30"
                        }`}
                      >
                        2 min
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimerPreset("5")}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          timerPreset === "5"
                            ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-300"
                            : "border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-indigo-500/30"
                        }`}
                      >
                        5 min
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimerPreset("10")}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          timerPreset === "10"
                            ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-300"
                            : "border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-indigo-500/30"
                        }`}
                      >
                        10 min
                      </button>
                    </div>

                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={() => setTimerPreset("custom")}
                        className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors mb-2 ${
                          timerPreset === "custom"
                            ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-300"
                            : "border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-indigo-500/30"
                        }`}
                      >
                        Personalizado
                      </button>
                      {timerPreset === "custom" ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={180}
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(e.target.value)}
                            placeholder="Minutos (1-180)"
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          />
                          <span className="text-sm text-slate-400 whitespace-nowrap">min</span>
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={handleStartSession}
                      disabled={startingSession || (timerPreset === "custom" && timerSeconds == null)}
                      className="w-full mt-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:hover:bg-indigo-600 transition-colors text-white text-sm font-medium"
                    >
                      {startingSession ? "Iniciando..." : "Iniciar partida"}
                    </button>
                  </div>
                </div>
              ) : null}

              {timerActive && sessionTimerSecondsRemaining != null && !timerExpired ? (
                <div className="absolute top-3 right-3 z-30">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950/70 border border-indigo-500/40 text-indigo-200 text-sm font-semibold shadow-lg">
                    Turno: {formatSeconds(sessionTimerSecondsRemaining)}
                  </div>
                </div>
              ) : null}

              {timerActive && timerExpired ? (
                <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6">
                  <div className="w-full max-w-md text-center bg-slate-900/90 border border-red-500/40 rounded-xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-2">Tiempo del turno agotado</h2>
                    <p className="text-sm text-slate-300 mb-5">
                      Tu turno ha terminado. No se puede continuar hasta iniciar otro turno.
                    </p>
                    <button
                      onClick={() => navigate("/juegos")}
                      className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
                    >
                      Volver a juegos
                    </button>
                  </div>
                </div>
              ) : null}
            </section>

            <GameplaySidebar
              userId={userId}
              gameId={game.id}
              matchId={matchId}
              gameTitle={game.title}
              movements={movements}
              players={allPlayers}
              availableModes={game.available_modes}
            />
          </div>
          </div>{/* cierre wrapper w-fit */}
        </div>
      </div>
    </div>
    </AgeGuard>
  );
}