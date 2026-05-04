import { useTranslation } from 'react-i18next';
import { AlertTriangle, Check, Search } from 'lucide-react';
import UserAvatar from '../../../../shared/components/UserAvatar';

type ReportSearchEntry = {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
};

type ReportPlayerForm = {
  reportedUserId: string;
  reportedUsername: string;
  searchQuery: string;
  reason: string;
  details: string;
};

type ReportPlayerModalProps = {
  reportPlayerForm: ReportPlayerForm;
  reportPlayerError: string;
  searchingReportUsers: boolean;
  reportingPlayer: boolean;
  reportSearchResults: ReportSearchEntry[];
  selectedReportedUser: ReportSearchEntry | null;
  onSearchChange: (value: string) => void;
  onSelectUser: (user: ReportSearchEntry) => void;
  onFormChange: (form: ReportPlayerForm) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function ReportPlayerModal({
  reportPlayerForm,
  reportPlayerError,
  searchingReportUsers,
  reportingPlayer,
  reportSearchResults,
  selectedReportedUser,
  onSearchChange,
  onSelectUser,
  onFormChange,
  onClose,
  onSubmit,
}: ReportPlayerModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-indigo-400 mb-2 border-b border-slate-800 pb-3">
          <AlertTriangle size={32} />
          <h3 className="text-2xl font-bold text-white">{t('account.security.reportModal.title')}</h3>
        </div>

        {reportPlayerError && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">{reportPlayerError}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.reportModal.targetUser')}</label>
            {reportPlayerForm.reportedUserId ? (
              <div className="rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-3">
                <div className="flex items-center gap-3">
                  <UserAvatar src={selectedReportedUser?.avatar_url} name={reportPlayerForm.reportedUsername} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-300/80">Jugador seleccionado</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="truncate font-semibold text-white">{reportPlayerForm.reportedUsername}</span>
                      <Check size={14} className="text-indigo-300" />
                    </div>
                    <p className="text-xs text-slate-400">{selectedReportedUser?.status || t('chat.status.disconnected')}</p>
                  </div>
                  <button type="button" onClick={() => onSearchChange('')} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white">
                    Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    value={reportPlayerForm.searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('account.security.reportModal.searchPlaceholder')}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {searchingReportUsers && <p className="text-xs text-slate-400 mt-2">{t('account.security.reportModal.searching')}</p>}

                {!searchingReportUsers && reportPlayerForm.searchQuery.trim().length >= 2 && reportSearchResults.length === 0 && (
                  <p className="text-xs text-slate-500 mt-2">{t('account.security.reportModal.noResults')}</p>
                )}

                {reportSearchResults.length > 0 && (
                  <div className="mt-2 rounded-xl border border-slate-700 bg-slate-800/40 max-h-48 overflow-y-auto">
                    {reportSearchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => onSelectUser(user)}
                        className="w-full text-left px-3 py-3 text-sm border-b last:border-b-0 border-slate-700/70 text-slate-200 transition-colors hover:bg-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <UserAvatar src={user.avatar_url} name={user.username} size={36} />
                          <div className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{user.username}</span>
                            <span className="text-xs text-slate-400">{user.status || t('chat.status.disconnected')}</span>
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
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.reportModal.reason')}</label>
            <select
              value={reportPlayerForm.reason}
              onChange={(e) => onFormChange({ ...reportPlayerForm, reason: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">{t('account.security.reportModal.selectReason')}</option>
              <option value="cheating">{t('account.security.reportModal.reasons.cheating')}</option>
              <option value="abuse">{t('account.security.reportModal.reasons.abuse')}</option>
              <option value="spam">{t('account.security.reportModal.reasons.spam')}</option>
              <option value="harassment">{t('account.security.reportModal.reasons.harassment')}</option>
              <option value="other">{t('account.security.reportModal.reasons.other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.reportModal.details')}</label>
            <textarea
              value={reportPlayerForm.details}
              onChange={(e) => onFormChange({ ...reportPlayerForm, details: e.target.value })}
              placeholder={t('account.security.reportModal.detailsPlaceholder')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 min-h-28 resize-y"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            {t('account.common.cancel')}
          </button>
          <button onClick={onSubmit} disabled={reportingPlayer} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {reportingPlayer ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : t('account.security.reportModal.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
