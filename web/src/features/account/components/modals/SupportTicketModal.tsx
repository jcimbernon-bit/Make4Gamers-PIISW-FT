import { useTranslation } from 'react-i18next';
import { Send, Wrench } from 'lucide-react';

type SupportTicketForm = {
  subject: string;
  category: string;
  message: string;
};

type SupportTicketModalProps = {
  supportTicketForm: SupportTicketForm;
  supportTicketError: string;
  creatingSupportTicket: boolean;
  onFormChange: (form: SupportTicketForm) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function SupportTicketModal({
  supportTicketForm,
  supportTicketError,
  creatingSupportTicket,
  onFormChange,
  onClose,
  onSubmit,
}: SupportTicketModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-indigo-400 mb-2 border-b border-slate-800 pb-3">
          <Wrench size={32} />
          <h3 className="text-2xl font-bold text-white">{t('account.security.ticketModal.title')}</h3>
        </div>

        {supportTicketError && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">{supportTicketError}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.ticketModal.subject')}</label>
            <input
              type="text"
              value={supportTicketForm.subject}
              onChange={(e) => onFormChange({ ...supportTicketForm, subject: e.target.value })}
              placeholder={t('account.security.ticketModal.subjectPlaceholder')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.ticketModal.category')}</label>
            <select
              value={supportTicketForm.category}
              onChange={(e) => onFormChange({ ...supportTicketForm, category: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Tecnico">{t('account.security.ticketModal.categories.technical')}</option>
              <option value="Pagos">{t('account.security.ticketModal.categories.payments')}</option>
              <option value="Denuncia">{t('account.security.ticketModal.categories.abuse')}</option>
              <option value="Otro">{t('account.security.ticketModal.categories.other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.ticketModal.message')}</label>
            <textarea
              value={supportTicketForm.message}
              onChange={(e) => onFormChange({ ...supportTicketForm, message: e.target.value })}
              placeholder={t('account.security.ticketModal.messagePlaceholder')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 min-h-32 resize-y"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            {t('account.common.cancel')}
          </button>
          <button onClick={onSubmit} disabled={creatingSupportTicket} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {creatingSupportTicket ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <><Send size={16} />{t('account.security.ticketModal.submit')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
