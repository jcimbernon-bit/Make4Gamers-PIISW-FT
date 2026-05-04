import { useTranslation } from 'react-i18next';
import { Check, Gamepad2, Search } from 'lucide-react';

type GameReportSearchEntry = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  status: string | null;
  genre: string | null;
};

type ReportGameForm = {
  reportedGameId: string;
  reportedGameTitle: string;
  searchQuery: string;
  reason: string;
  details: string;
};

type ReportGameModalProps = {
  reportGameForm: ReportGameForm;
  reportGameError: string;
  searchingReportGames: boolean;
  reportingGame: boolean;
  reportGameSearchResults: GameReportSearchEntry[];
  selectedReportedGame: GameReportSearchEntry | null;
  onSearchChange: (value: string) => void;
  onSelectGame: (game: GameReportSearchEntry) => void;
  onFormChange: (form: ReportGameForm) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function ReportGameModal({
  reportGameForm,
  reportGameError,
  searchingReportGames,
  reportingGame,
  reportGameSearchResults,
  selectedReportedGame,
  onSearchChange,
  onSelectGame,
  onFormChange,
  onClose,
  onSubmit,
}: ReportGameModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-indigo-400 mb-2 border-b border-slate-800 pb-3">
          <Gamepad2 size={32} />
          <h3 className="text-2xl font-bold text-white">{t('account.security.reportGameModal.title', { defaultValue: 'Reportar juego' })}</h3>
        </div>

        {reportGameError && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">{reportGameError}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.reportGameModal.targetGame', { defaultValue: 'Juego' })}</label>
            {reportGameForm.reportedGameId ? (
              <div className="rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-3">
                <div className="flex items-center gap-3">
                  {selectedReportedGame?.thumbnail_url ? (
                    <img src={selectedReportedGame.thumbnail_url} alt={reportGameForm.reportedGameTitle} className="h-11 w-11 rounded-xl border border-slate-700 object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300">
                      <Gamepad2 size={18} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-300/80">
                      {t('account.security.reportGameModal.selectedGameLabel', { defaultValue: 'Juego seleccionado' })}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="truncate font-semibold text-white">{reportGameForm.reportedGameTitle}</span>
                      <Check size={14} className="text-indigo-300" />
                    </div>
                    <p className="text-xs text-slate-400">
                      {selectedReportedGame?.genre || selectedReportedGame?.status || t('account.security.reportGameModal.noMetadata', { defaultValue: 'Sin información adicional' })}
                    </p>
                  </div>
                  <button type="button" onClick={() => onSearchChange('')} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white">
                    {t('account.security.reportGameModal.changeSelection', { defaultValue: 'Cambiar' })}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    value={reportGameForm.searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('account.security.reportGameModal.searchPlaceholder', { defaultValue: 'Busca por nombre del juego (min. 2 caracteres)' })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {searchingReportGames && <p className="text-xs text-slate-400 mt-2">{t('account.security.reportGameModal.searching', { defaultValue: 'Buscando juegos...' })}</p>}

                {!searchingReportGames && reportGameForm.searchQuery.trim().length >= 2 && reportGameSearchResults.length === 0 && (
                  <p className="text-xs text-slate-500 mt-2">{t('account.security.reportGameModal.noResults', { defaultValue: 'No se encontraron juegos con ese nombre.' })}</p>
                )}

                {reportGameSearchResults.length > 0 && (
                  <div className="mt-2 rounded-xl border border-slate-700 bg-slate-800/40 max-h-48 overflow-y-auto">
                    {reportGameSearchResults.map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => onSelectGame(game)}
                        className="w-full text-left px-3 py-3 text-sm border-b last:border-b-0 border-slate-700/70 text-slate-200 transition-colors hover:bg-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          {game.thumbnail_url ? (
                            <img src={game.thumbnail_url} alt={game.title} className="h-10 w-10 rounded-lg border border-slate-700 object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300">
                              <Gamepad2 size={18} />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{game.title}</span>
                            <span className="text-xs text-slate-400">{game.genre || game.status || t('account.security.reportGameModal.noMetadata', { defaultValue: 'Sin información adicional' })}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.reportGameModal.reason', { defaultValue: 'Motivo' })}</label>
            <select
              value={reportGameForm.reason}
              onChange={(e) => onFormChange({ ...reportGameForm, reason: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">{t('account.security.reportGameModal.selectReason', { defaultValue: 'Selecciona un motivo' })}</option>
              <option value="bug">{t('account.security.reportGameModal.reasons.bug', { defaultValue: 'Error o bug' })}</option>
              <option value="inappropriate">{t('account.security.reportGameModal.reasons.inappropriate', { defaultValue: 'Contenido inapropiado' })}</option>
              <option value="broken_link">{t('account.security.reportGameModal.reasons.brokenLink', { defaultValue: 'No carga o enlace roto' })}</option>
              <option value="copyright">{t('account.security.reportGameModal.reasons.copyright', { defaultValue: 'Problema de derechos' })}</option>
              <option value="other">{t('account.security.reportGameModal.reasons.other', { defaultValue: 'Otro' })}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.reportGameModal.details', { defaultValue: 'Detalles' })}</label>
            <textarea
              value={reportGameForm.details}
              onChange={(e) => onFormChange({ ...reportGameForm, details: e.target.value })}
              placeholder={t('account.security.reportGameModal.detailsPlaceholder', { defaultValue: 'Describe brevemente el problema del juego...' })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 min-h-28 resize-y"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            {t('account.common.cancel')}
          </button>
          <button onClick={onSubmit} disabled={reportingGame} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {reportingGame ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : t('account.security.reportGameModal.submit', { defaultValue: 'Enviar reporte' })}
          </button>
        </div>
      </div>
    </div>
  );
}
