import { Users, Star, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

type GameCardProps = {
  title: string;
  image: string;
  genre: string;
  rating: number;
  players: number;
  status?: string;
  isPremium?: boolean;
};

export default function GameCard({ title, image, genre, rating, players, status, isPremium }: GameCardProps) {
  const { t } = useTranslation();
  const isVip = isPremium || status === 'review';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10
        timeline-view animate-zoom-in animate-range-cover"
    >
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden bg-slate-800">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badge VIP */}
        {isVip && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-yellow-400/90 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-md shadow-lg">
            <Crown size={10} strokeWidth={2.5} />
            VIP
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold text-white">{rating}</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white text-lg line-clamp-1 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
            {title}
            {isVip && (
              <span title="Juego Exclusivo VIP" className="flex shrink-0">
                <Star size={16} className="text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              </span>
            )}
          </h3>
        </div>

        <p className="text-slate-400 text-sm mt-1">
          {t(`genres.${genre.toLowerCase()}`, { defaultValue: genre })}
        </p>

        <div className="flex items-center gap-1 text-slate-400 mt-3">
          <Users size={16} />
          <span className="text-sm">{players.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
