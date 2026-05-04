import type { ChangeEvent, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Camera, Check, Edit2, X, Save, Code2, Gamepad2, Zap } from 'lucide-react';
import AvatarPlaceholder from '../../../../shared/components/AvatarPlaceholder';

type ProfileDetails = {
  avatar_url: string | null;
  username: string | null;
  status: string | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  birth_date?: string | null;
  subscription_tier?: string | null;
  role?: string | null;
};

type DeveloperRequestSummary = {
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  created_at: string;
};

type AccountPersonalSectionProps = {
  profile: ProfileDetails;
  uploadingAvatar: boolean;
  isEditingName: boolean;
  editNameValue: string;
  savingName: boolean;
  fileInputRef: Ref<HTMLInputElement>;
  onOpenAvatarPolicy: () => void;
  onUploadAvatar: (event: ChangeEvent<HTMLInputElement>) => void;
  onEditNameValueChange: (value: string) => void;
  onEnableNameEdit: () => void;
  onCancelNameEdit: () => void;
  onSaveUsername: () => void;
  onStatusChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  developerRequest: DeveloperRequestSummary | null;
  creatingDeveloperRequest: boolean;
  cancellingDeveloperRequest: boolean;
  onOpenDeveloperRequestModal: () => void;
  onCancelDeveloperRequest: () => void;
};

export function AccountPersonalSection({
  profile,
  uploadingAvatar,
  isEditingName,
  editNameValue,
  savingName,
  fileInputRef,
  onOpenAvatarPolicy,
  onUploadAvatar,
  onEditNameValueChange,
  onEnableNameEdit,
  onCancelNameEdit,
  onSaveUsername,
  onStatusChange,
  developerRequest,
  creatingDeveloperRequest,
  cancellingDeveloperRequest,
  onOpenDeveloperRequestModal,
  onCancelDeveloperRequest,
}: AccountPersonalSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 pb-8 shadow-2xl relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />

      <div className="relative flex flex-col xl:flex-row items-start xl:items-center gap-6 mb-6">
        <div className="relative group shrink-0">
          <div className={`w-24 h-24 bg-slate-800 border-2 rounded-full flex items-center justify-center overflow-hidden shadow-lg ${profile.subscription_tier === 'premium' ? 'border-yellow-500 shadow-yellow-500/50' : 'border-indigo-500'}`}>
            {uploadingAvatar ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
            ) : profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <AvatarPlaceholder name={profile.username ?? "U"} size={96} />
            )}
          </div>

          <button
            title="Cambiar foto de perfil"
            onClick={onOpenAvatarPolicy}
            disabled={uploadingAvatar}
            className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-indigo-500"
          >
            <Camera size={24} className="text-white" />
          </button>
        </div>

        <input
          title="Subir nueva foto de perfil"
          type="file"
          id="avatarSingle"
          accept="image/*"
          onChange={onUploadAvatar}
          ref={fileInputRef}
          disabled={uploadingAvatar}
          className="hidden"
        />

        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <input
                type="text"
                value={editNameValue}
                onChange={(e) => onEditNameValueChange(e.target.value)}
                placeholder="Escribe tu nuevo nombre..."
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <button
                onClick={onSaveUsername}
                disabled={savingName}
                className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                title="Guardar"
              >
                {savingName ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Check size={20} />}
              </button>
              <button
                onClick={onCancelNameEdit}
                className="p-1.5 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/30 transition-colors"
                title="Cancelar"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-3 group">
              <h1 className="text-3xl font-bold text-white truncate">
                {profile.username || t('account.personal.noUsername')}
              </h1>
              
              {profile.subscription_tier === 'premium' && (
                <span title="Usuario Premium" className="flex items-center">
                  <Save 
                    size={28} 
                    className="text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] shrink-0 animate-pulse" 
                  />
                </span>
              )}

              <button
                onClick={onEnableNameEdit}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-all opacity-0 group-hover:opacity-100"
                title="Editar nombre"
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity size={16} /> Estado:
            </span>
            <select
              title="Seleccionar estado de conexion"
              value={profile.status || 'Disponible'}
              onChange={onStatusChange}
              className="bg-slate-800/80 text-white border border-slate-700 rounded-md px-2 py-1 outline-none focus:border-indigo-500 cursor-pointer text-sm"
            >
              <option value="Disponible">Disponible</option>
              <option value="Ausente">Ausente</option>
              <option value="Ocupado">Ocupado</option>
              <option value="Invisible">Invisible</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
          <p className="mt-1 text-sm text-white break-all">{profile.email || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Usuario</p>
          <p className="mt-1 text-sm text-white">{profile.username || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Nombre</p>
          <p className="mt-1 text-sm text-white">{profile.first_name || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Apellido</p>
          <p className="mt-1 text-sm text-white">{profile.last_name || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Fecha de nacimiento</p>
          <p className="mt-1 text-sm text-white">{profile.birth_date || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Rol</p>
          <p className="mt-1 text-sm text-white">{profile.role || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Tipo de suscripcion</p>
          <p className="mt-1 text-sm text-white">{profile.subscription_tier || t('account.personal.notDefined')}</p>
        </div>
      </div>

      {profile.role !== 'developer' && profile.role !== 'admin' && (
        <div className="mt-5 relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 rounded-2xl" />
          <div className="relative m-px rounded-2xl bg-slate-900/95 p-5">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Code2 size={22} className="text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                  <Gamepad2 size={11} />
                  DEVELOPER
                </span>
                <h3 className="text-base font-bold text-white leading-snug">
                  ¿Eres desarrollador y quieres crear juegos o buscar donde alojarlos?
                </h3>
                <p className="mt-1 text-sm font-semibold text-indigo-300">
                  ¿Quieres formar parte del equipo de M4G?
                </p>
                <p className="mt-1.5 text-sm text-slate-400">
                  Solicita el rol developer y empieza a publicar tus proyectos en la plataforma.
                </p>
              </div>
            </div>

            {developerRequest && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm w-fit">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  developerRequest.estado === 'aceptada'
                    ? 'bg-emerald-400'
                    : developerRequest.estado === 'rechazada'
                      ? 'bg-rose-400'
                      : 'bg-amber-400 animate-pulse'
                }`} />
                <span className="text-slate-300">Solicitud </span>
                <span className={
                  developerRequest.estado === 'aceptada'
                    ? 'text-emerald-400 font-medium'
                    : developerRequest.estado === 'rechazada'
                      ? 'text-rose-400 font-medium'
                      : 'text-amber-400 font-medium'
                }>
                  {developerRequest.estado}
                </span>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {developerRequest?.estado === 'pendiente' ? (
                <button
                  type="button"
                  onClick={onCancelDeveloperRequest}
                  disabled={cancellingDeveloperRequest}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-rose-600/20 border border-rose-600/40 px-4 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={14} />
                  {cancellingDeveloperRequest ? 'Cancelando...' : 'Cancelar solicitud'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenDeveloperRequestModal}
                  disabled={creatingDeveloperRequest}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Zap size={14} />
                  {creatingDeveloperRequest ? 'Enviando...' : 'Quiero ser Developer'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
