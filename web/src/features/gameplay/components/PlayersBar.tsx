import type { MatchPlayer } from "../hooks/useActiveMatch";
import AvatarPlaceholder from "../../../shared/components/AvatarPlaceholder";

type Props = {
  players: MatchPlayer[];
  currentUserId: string | null;
  lastMovedPlayerId: string | null;
  loading?: boolean;
};

function PlayerAvatar({
  player,
  isCurrentUser,
  isActiveTurn,
}: {
  player: MatchPlayer;
  isCurrentUser: boolean;
  isActiveTurn: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Avatar */}
      <div className="relative">
        {player.avatar_url ? (
          <img
            src={player.avatar_url}
            alt={player.username ?? "jugador"}
            className={`w-9 h-9 rounded-full object-cover transition-all duration-300 ${
              isActiveTurn
                ? "border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                : "border-2 border-slate-700"
            }`}
          />
        ) : (
          <div
            className={`rounded-full transition-all duration-300 ${
              isActiveTurn
                ? "border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                : "border-2 border-slate-700"
            }`}
          >
            <AvatarPlaceholder name={player.username ?? "?"} size={36} />
          </div>
        )}
        {/* Indicador de turno */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 transition-colors duration-300 ${
            isActiveTurn ? "bg-yellow-400 animate-pulse" : "bg-slate-600"
          }`}
        />
      </div>

      {/* Nombre + estado */}
      <div className="flex flex-col leading-none gap-0.5">
        <span className={`text-sm font-semibold ${isCurrentUser ? "text-indigo-300" : "text-white"}`}>
          {player.username ?? "Jugador"}
          {isCurrentUser && <span className="ml-1 text-[10px] text-indigo-400 font-normal">(tú)</span>}
        </span>
        <span
          className={`text-[10px] font-medium transition-colors duration-300 ${
            isActiveTurn ? "text-yellow-400" : "text-slate-500"
          }`}
        >
          {isActiveTurn ? "Tu turno" : "Esperando"}
        </span>
      </div>
    </div>
  );
}

export default function PlayersBar({
  players,
  currentUserId,
  lastMovedPlayerId,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="w-full flex items-center gap-4 px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-800 animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-20 rounded bg-slate-800 animate-pulse" />
              <div className="h-2 w-12 rounded bg-slate-800 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!players.length) return null;

  // Intercalar jugadores con separadores "vs"
  const items = players.flatMap((player, i) => {
    const isActiveTurn = lastMovedPlayerId !== null && player.id !== lastMovedPlayerId;
    const el = [
      <PlayerAvatar
        key={player.id}
        player={player}
        isCurrentUser={player.id === currentUserId}
        isActiveTurn={isActiveTurn}
      />,
    ];
    if (i < players.length - 1) {
      el.push(
        <span key={`vs-${i}`} className="text-[11px] font-bold text-slate-600 uppercase tracking-widest select-none">
          vs
        </span>,
      );
    }
    return el;
  });

  return (
    <div className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-sm shadow-black/20">
      {items}
    </div>
  );
}
