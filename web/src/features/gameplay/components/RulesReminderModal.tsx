import { AnimatePresence, motion } from "framer-motion";
import type { LastPlayedStatus } from "../hooks/useLastPlayed";

type Props = {
  gameId: string;
  gameTitle: string;
  rulesUrl: string | null;
  status: LastPlayedStatus;
  onDismiss: () => void;
  onGoToRules: () => void;
};

export default function RulesReminderModal({
  gameTitle,
  status,
  onDismiss,
  onGoToRules,
}: Props) {
  const isNever = status === "never";

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="absolute inset-0 z-30 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(109,40,217,0.18) 0%, rgba(2,6,23,0.82) 70%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Card */}
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 26, delay: 0.05 }}
          className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-violet-500/30 bg-slate-900/95 shadow-2xl"
          style={{
            boxShadow:
              "0 0 0 1px rgba(139,92,246,0.2), 0 0 40px rgba(139,92,246,0.15), 0 24px 48px rgba(0,0,0,0.5)",
          }}
        >
          {/* Línea neon superior */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-80" />

          {/* Brillo de fondo interno */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-5 p-7">
            {/* Icono animado */}
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.15 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(109,40,217,0.1) 100%)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.35), inset 0 0 12px rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.45)",
                }}
              >
                <svg
                  className="w-7 h-7 text-violet-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  style={{ filter: "drop-shadow(0 0 6px rgba(167,139,250,0.7))" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Texto */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
            >
              <h3
                className="text-lg font-bold text-white mb-2"
                style={{ textShadow: "0 0 20px rgba(167,139,250,0.4)" }}
              >
                {isNever ? "Primera vez jugando" : "Llevas un tiempo sin jugar"}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {isNever
                  ? `¿Quieres repasar las reglas de ${gameTitle} antes de empezar?`
                  : `Han pasado más de una semana desde tu última partida de ${gameTitle}. ¿Necesitas un repaso?`}
              </p>
            </motion.div>

            {/* Botones */}
            <motion.div
              className="flex flex-col gap-2.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.35 }}
            >
              <motion.button
                onClick={onGoToRules}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="relative w-full px-4 py-2.5 rounded-xl text-white text-sm font-semibold overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  boxShadow: "0 0 16px rgba(124,58,237,0.5), 0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {/* Brillo interno del botón */}
                <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl" />
                <span className="relative">Ver reglas</span>
              </motion.button>

              <motion.button
                onClick={onDismiss}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors text-slate-400 hover:text-slate-200 text-sm"
              >
                Jugar directamente
              </motion.button>
            </motion.div>
          </div>

          {/* Línea neon inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
