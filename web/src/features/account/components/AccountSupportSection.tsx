import { useTranslation } from 'react-i18next';
import { Gamepad2, Send, Wrench } from 'lucide-react';
import UserAvatar from '../../../shared/components/UserAvatar';
import type { GameReport, UserReport } from '../../reports/services/reports.service';
import type { SupportTicket } from '../../support/services/tickets.service';
import type { SupportTab } from '../types/account-ui.types';

type AccountSupportSectionProps = {
  activeSupportTab: SupportTab;
  onSupportTabChange: (tab: SupportTab) => void;
  supportTickets: SupportTicket[];
  sentUserReports: UserReport[];
  sentGameReports: GameReport[];
  loadingSupportHistory: boolean;
  onOpenReportPlayer: () => void;
  onOpenReportGame: () => void;
  onOpenSupportTicket: () => void;
  formatDate: (dateString: string) => string;
};

export function AccountSupportSection({
  activeSupportTab,
  onSupportTabChange,
  supportTickets,
  sentUserReports,
  sentGameReports,
  loadingSupportHistory,
  onOpenReportPlayer,
  onOpenReportGame,
  onOpenSupportTicket,
  formatDate,
}: AccountSupportSectionProps) {
  const { t } = useTranslation();

  const supportTabButtonClass = (tab: SupportTab) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      activeSupportTab === tab
        ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30'
        : 'bg-slate-800/50 text-slate-400 border border-slate-700/60 hover:text-white hover:border-slate-600'
    }`;

  const badgeClass = (value?: string | null) => {
    switch (value) {
      case 'Resuelto':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
      case 'En revisión':
      case 'En revision':
      case 'Alta':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'Urgente':
        return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
      default:
        return 'border-slate-600 bg-slate-800/70 text-slate-300';
    }
  };

  const supportCardClass =
    'rounded-2xl border border-slate-800 bg-[linear-gradient(180deg,rgba(30,41,59,0.40),rgba(15,23,42,0.55))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]';

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Wrench size={20} className="text-indigo-400" />
            {t('account.support.title')}
          </h3>
          <p className="text-sm text-slate-400 mt-1">{t('account.support.subtitle')}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenReportPlayer}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors"
          >
            {t('account.security.reportPlayer')}
          </button>
          <button
            type="button"
            onClick={onOpenReportGame}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors"
          >
            {t('account.security.reportGame')}
          </button>
          <button
            type="button"
            onClick={onOpenSupportTicket}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors"
          >
            <Send size={16} />
            {t('account.support.openTicket')}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onSupportTabChange('tickets')} className={supportTabButtonClass('tickets')}>
          {t('account.support.tabs.tickets')} ({supportTickets.length})
        </button>
        <button type="button" onClick={() => onSupportTabChange('users')} className={supportTabButtonClass('users')}>
          {t('account.support.tabs.users')} ({sentUserReports.length})
        </button>
        <button type="button" onClick={() => onSupportTabChange('games')} className={supportTabButtonClass('games')}>
          {t('account.support.tabs.games')} ({sentGameReports.length})
        </button>
      </div>

      {loadingSupportHistory ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-8 text-center text-sm text-slate-400">
          {t('account.support.loading')}
        </div>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar">
          {activeSupportTab === 'tickets' &&
            (supportTickets.length > 0 ? (
              supportTickets.map((ticket) => (
                <article key={ticket.id} className={supportCardClass}>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-mono text-[11px] tracking-wide text-indigo-200">
                            {ticket.ticket_number}
                          </span>
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${badgeClass(ticket.estado)}`}>
                            {ticket.estado || t('account.support.status.pending')}
                          </span>
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${badgeClass(ticket.prioridad)}`}>
                            {ticket.prioridad}
                          </span>
                        </div>
                        <h4 className="mt-3 truncate text-base font-semibold text-white">{ticket.asunto}</h4>
                      </div>
                      <span className="shrink-0 rounded-full border border-slate-700/70 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-400">
                        {formatDate(ticket.created_at)}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/30 px-3 py-3">
                      <p className="line-clamp-3 text-sm leading-6 text-slate-300">{ticket.mensaje}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/20 p-8 text-center text-sm text-slate-500">
                {t('account.support.emptyTickets')}
              </div>
            ))}

          {activeSupportTab === 'users' &&
            (sentUserReports.length > 0 ? (
              sentUserReports.map((report) => (
                <article key={report.id} className={supportCardClass}>
                  <div className="flex items-start gap-4">
                    <UserAvatar src={report.reportedUser?.avatar_url} name={report.reportedUser?.username} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h4 className="truncate font-semibold text-white">
                            {report.reportedUser?.username || t('account.support.unknownUser')}
                          </h4>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${badgeClass(report.reason)}`}>
                              {report.reason}
                            </span>
                            {report.reportedUser?.status && (
                              <span className="rounded-full border border-slate-700/70 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-400">
                                {report.reportedUser.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-slate-700/70 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-400">
                          {formatDate(report.created_at)}
                        </span>
                      </div>
                      {report.details && (
                        <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/30 px-3 py-3">
                          <p className="line-clamp-3 text-sm leading-6 text-slate-300">{report.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/20 p-8 text-center text-sm text-slate-500">
                {t('account.support.emptyUserReports')}
              </div>
            ))}

          {activeSupportTab === 'games' &&
            (sentGameReports.length > 0 ? (
              sentGameReports.map((report) => (
                <article key={report.id} className={supportCardClass}>
                  <div className="flex items-start gap-4">
                    {report.game?.thumbnail_url ? (
                      <img
                        src={report.game.thumbnail_url}
                        alt={report.game.title || ''}
                        className="h-12 w-12 rounded-xl border border-slate-700 object-cover shadow-lg shadow-slate-950/20"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 shadow-lg shadow-slate-950/20">
                        <Gamepad2 size={18} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h4 className="truncate font-semibold text-white">
                            {report.game?.title || t('account.support.unknownGame')}
                          </h4>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${badgeClass(report.reason)}`}>
                              {report.reason}
                            </span>
                            {report.game?.genre && (
                              <span className="rounded-full border border-slate-700/70 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-400">
                                {report.game.genre}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-slate-700/70 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-400">
                          {formatDate(report.created_at)}
                        </span>
                      </div>
                      {report.details && (
                        <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/30 px-3 py-3">
                          <p className="line-clamp-3 text-sm leading-6 text-slate-300">{report.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/20 p-8 text-center text-sm text-slate-500">
                {t('account.support.emptyGameReports')}
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
