import { useState } from 'react';
import {
  X,
  ChevronDown,
  Zap,
  DollarSign,
  Wrench,
  Megaphone,
  Code2,
  Briefcase,
  RefreshCcw,
  Palette,
  Gamepad2,
} from 'lucide-react';

type DeveloperRequestModalProps = {
  title: string;
  reason: string;
  creating: boolean;
  onTitleChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const BENEFITS = [
  {
    icon: DollarSign,
    label: 'Incentivos Económicos y Monetización',
    desc: 'Revenue sharing directo, monetización de juegos integrada y acceso al sistema de pagos de la plataforma.',
  },
  {
    icon: Wrench,
    label: 'Herramientas y Facilidad de Desarrollo',
    desc: 'SDK propio, panel de developer, soporte técnico dedicado y hosting incluido para tus proyectos.',
  },
  {
    icon: Megaphone,
    label: 'Exposición y Marketing (Ecosistema)',
    desc: 'Visibilidad ante la comunidad activa de gamers de M4G, campañas de lanzamiento y posicionamiento en la plataforma.',
  },
];

const REQUIREMENTS = [
  {
    icon: Code2,
    label: 'Perfil Técnico y Conocimiento',
    desc: 'Dominio de al menos un lenguaje o motor de juego (Unity, Unreal, Godot, o equivalente).',
  },
  {
    icon: Briefcase,
    label: 'Portafolio de Proyectos Previos',
    desc: 'Al menos un proyecto publicado o demostrable que refleje tu experiencia y nivel.',
  },
  {
    icon: RefreshCcw,
    label: 'Entendimiento del Ciclo de Vida del Producto',
    desc: 'Capacidad de gestionar un juego desde el concepto inicial hasta el lanzamiento y mantenimiento.',
  },
  {
    icon: Palette,
    label: 'Capacidad de Diseño de Experiencia de Usuario (UX)',
    desc: 'Sensibilidad por la jugabilidad, la interfaz y la experiencia del jugador final.',
  },
];

export function DeveloperRequestModal({
  title,
  reason,
  creating,
  onTitleChange,
  onReasonChange,
  onClose,
  onSubmit,
}: DeveloperRequestModalProps) {
  const [openBenefits, setOpenBenefits] = useState(false);
  const [openRequirements, setOpenRequirements] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Gradient border */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 rounded-2xl" />
        <div className="relative m-px rounded-2xl bg-slate-900 overflow-y-auto max-h-[90vh]">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                <Gamepad2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Solicitud de rol Developer</h3>
                <p className="text-xs text-slate-400 mt-0.5">Completa el formulario para unirte al equipo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Accordion: Ventajas */}
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenBenefits((v) => !v)}
                className="cursor-pointer w-full flex items-center justify-between px-4 py-3 bg-slate-800/40 hover:bg-slate-800/70 transition-colors text-left"
              >
                <span className="text-sm font-semibold text-indigo-300">¿Por qué unirte a M4G?</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${openBenefits ? 'rotate-180' : ''}`}
                />
              </button>
              {openBenefits && (
                <div className="divide-y divide-slate-800/60">
                  {BENEFITS.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3 px-4 py-3 bg-slate-900/60">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={14} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion: Requisitos */}
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenRequirements((v) => !v)}
                className="cursor-pointer w-full flex items-center justify-between px-4 py-3 bg-slate-800/40 hover:bg-slate-800/70 transition-colors text-left"
              >
                <span className="text-sm font-semibold text-violet-300">Requisitos del perfil</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${openRequirements ? 'rotate-180' : ''}`}
                />
              </button>
              {openRequirements && (
                <div className="divide-y divide-slate-800/60">
                  {REQUIREMENTS.map(({ icon: Icon, label, desc }, i) => (
                    <div key={label} className="flex items-start gap-3 px-4 py-3 bg-slate-900/60">
                      <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-violet-400">{i + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  maxLength={80}
                  placeholder="Quiero aportar al proyecto..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Motivo</label>
                <textarea
                  value={reason}
                  onChange={(e) => onReasonChange(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Explica por qué quieres el rol developer y qué aportarás..."
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={onClose}
                className="cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={onSubmit}
                disabled={creating}
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Zap size={14} />
                {creating ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
