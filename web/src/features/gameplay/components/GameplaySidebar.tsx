import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGameScore } from "../hooks/useGameScore";
import { useMatchChat } from "../hooks/useMatchChat";
import type { MatchMovement } from "../hooks/useMatchMovements";
import type { MatchPlayer } from "../hooks/useActiveMatch";
import { getGameProgress } from "../../progression/services/progression.service";

export type GameplayTab = "chat" | "history";

const SKIP_KEYS = new Set(["game_id", "territory"]);
const REACTIONS = ["🔥", "❤️", "😂", "👍", "💀"];

function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "-";
  if (typeof val === "boolean") return val ? "Sí" : "No";
  return String(val);
}

function MoveCard({ movement, playerName }: { movement: MatchMovement; playerName?: string }) {
  const time = new Date(movement.server_timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const entries = Object.entries(movement.move_data).filter(
    ([key]) => !SKIP_KEYS.has(key),
  );

  return (
    <li className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
            Turno {typeof movement.move_data.turn === "number" ? movement.move_data.turn : "—"}
          </span>
          {playerName && (
            <span className="text-xs font-medium text-white">{playerName}</span>
          )}
        </div>
        <span className="text-[10px] text-slate-500">{time}</span>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
        {entries.map(([key, val]) => {
          if (key === "turn") return null;
          return (
            <div key={key} className="flex flex-col">
              <dt className="text-[10px] text-slate-500 leading-none">{formatKey(key)}</dt>
              <dd className="text-xs font-semibold text-white leading-snug">{formatValue(val)}</dd>
            </div>
          );
        })}
      </dl>
    </li>
  );
}

type Props = {
  userId: string | null;
  gameId: string | null;
  matchId?: string | null;
  gameTitle?: string;
  movements: MatchMovement[];
  players?: MatchPlayer[];
  availableModes?: string[] | null;
};

export default function GameplaySidebar({
  userId,
  gameId,
  matchId,
  gameTitle,
  movements,
  players,
  availableModes,
}: Props) {
  const { t } = useTranslation();
  const { score: myScore, loading: scoreLoading } = useGameScore(userId, gameId);
  const { messages, sendMessage, loading: chatLoading } = useMatchChat(matchId ?? null, userId);

  const [tab, setTab] = useState<GameplayTab>("chat");
  const [chatInput, setChatInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const supportsHistory = useMemo(() => {
    const modes = availableModes ?? [];
    return modes.some((m) =>
      ["turns", "turn-based", "history", "multiplayer"].includes(m.toLowerCase()),
    );
  }, [availableModes]);

  const progress = useMemo(() => {
    if (scoreLoading || !gameTitle) return null;
    return getGameProgress(gameTitle, myScore ?? 0);
  }, [scoreLoading, gameTitle, myScore]);

  // Cerrar picker al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmojiPicker]);

  // Auto-scroll al último mensaje dentro del contenedor (sin mover la página)
  useEffect(() => {
    if (tab === "chat" && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, tab]);

  const handleSend = async () => {
    const value = chatInput.trim();
    if (!value) return;
    setChatInput("");
    await sendMessage(value);
  };

  const handleReaction = async (emoji: string) => {
    setShowEmojiPicker(false);
    await sendMessage(emoji);
  };

  return (
    <aside className="h-[600px] rounded-xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">

      {!scoreLoading && progress && progress.nextTierName !== "MAX" && progress.pointsNeeded <= 1500 && (
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 border-b border-indigo-500/30 px-4 py-3 shadow-inner relative overflow-hidden shrink-0">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full pointer-events-none" />
          <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-1 relative z-10 flex items-center gap-1">
            <span className="text-yellow-400"></span> ¡ESTÁS EN RACHA!
          </p>
          <p className="text-sm font-medium text-slate-200 relative z-10 leading-tight">
            Solo necesitas <span className="font-extrabold text-white text-base">{progress.pointsNeeded} pts</span> más para alcanzar el nivel <span className="font-black text-indigo-400">{progress.nextTierName}</span>.
          </p>
        </div>
      )}

      {/* Score */}
      <div className="px-4 py-3 border-b border-indigo-500/50 bg-slate-900 shadow-xl shadow-indigo-500/10 shrink-0">
        <p className="text-xs uppercase tracking-wide text-slate-300">{t("gameplay.myScore")}</p>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.35)] mt-1">
            {scoreLoading ? "..." : myScore ?? "-"}
          </p>
          <p className="text-xs font-bold text-slate-500 mb-1 uppercase">PTS</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 shrink-0">
        <button
          onClick={() => setTab("chat")}
          className={`flex-1 py-2 text-sm transition-all duration-200 ${
            tab === "chat" ? "text-indigo-400 font-semibold scale-105" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {t("gameplay.chat")}
          {messages.length > 0 && (
            <span className="ml-1.5 text-[10px] bg-indigo-500/20 text-indigo-400 rounded-full px-1.5 py-0.5">
              {messages.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex-1 py-2 text-sm transition-all duration-200 ${
            tab === "history" ? "text-indigo-400 font-semibold scale-105" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {t("gameplay.history")}
          {movements.length > 0 && (
            <span className="ml-1.5 text-[10px] bg-indigo-500/20 text-indigo-400 rounded-full px-1.5 py-0.5">
              {movements.length}
            </span>
          )}
        </button>
      </div>

      {/* Chat */}
      {tab === "chat" ? (
        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
          <div ref={messagesRef} className="flex-1 overflow-auto p-3 space-y-3">
            {chatLoading ? (
              <p className="text-slate-500 text-sm">Cargando chat...</p>
            ) : !matchId ? (
              <p className="text-slate-500 text-sm">Inicia la partida para chatear con los jugadores.</p>
            ) : messages.length === 0 ? (
              <p className="text-slate-500 text-sm">{t("gameplay.noMessages")}</p>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.sender_id === userId;
                const senderName =
                  players?.find((p) => p.id === msg.sender_id)?.username ?? "Jugador";
                const time = new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}
                  >
                    {!isOwn && (
                      <span className="text-[10px] text-slate-500 px-1">{senderName}</span>
                    )}
                    {REACTIONS.includes(msg.content) ? (
                      <span className="text-3xl leading-none px-1">{msg.content}</span>
                    ) : (
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug break-words ${
                          isOwn
                            ? "bg-indigo-600 text-white rounded-br-sm"
                            : "bg-slate-800 text-slate-200 rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}
                    <span className="text-[10px] text-slate-600 px-1">{time}</span>
                  </div>
                );
              })
            )}
          </div>

          <div ref={pickerRef} className="px-4 py-3 border-t border-slate-800 flex items-center gap-2 shrink-0 relative">
            {/* Emoji picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-4 mb-2 bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 flex gap-2 shadow-2xl shadow-black/40">
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-2xl hover:scale-125 active:scale-110 transition-transform p-1.5 rounded-xl hover:bg-slate-700"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Botón reacciones */}
            <button
              onClick={() => setShowEmojiPicker((v) => !v)}
              disabled={!matchId}
              className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                showEmojiPicker
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
              title="Reacciones"
            >
              😊
            </button>

            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={matchId ? t("gameplay.writeMessage") : "Inicia la partida..."}
              disabled={!matchId}
              className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
            />

            {/* Botón enviar */}
            <button
              onClick={handleSend}
              disabled={!matchId || !chatInput.trim()}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title={t("gameplay.send")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Historial */
        <div className="flex-1 overflow-auto p-3">
          {!supportsHistory ? (
            <p className="text-slate-500 text-sm">{t("gameplay.noMovesRequired")}</p>
          ) : movements.length === 0 ? (
            <p className="text-slate-500 text-sm">{t("gameplay.noMovesYet")}</p>
          ) : (
            <ul className="space-y-2">
              {[...movements].reverse().map((m) => {
                const player = players?.find((p) => p.id === m.player_id);
                return (
                  <MoveCard
                    key={m.id}
                    movement={m}
                    playerName={player?.username ?? undefined}
                  />
                );
              })}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}
