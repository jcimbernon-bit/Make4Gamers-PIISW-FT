import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

type AvatarPolicyModalProps = {
  onClose: () => void;
  onAccept: () => void;
};

export function AvatarPolicyModal({ onClose, onAccept }: AvatarPolicyModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-amber-400 mb-2 border-b border-slate-800 pb-3">
          <AlertTriangle size={32} />
          <h3 className="text-2xl font-bold text-white">{t('account.avatarPolicy.title')}</h3>
        </div>

        <p className="text-sm text-slate-400">{t('account.avatarPolicy.description')}</p>

        <ul className="text-sm text-slate-400 list-disc list-inside space-y-1.5 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <li>{t('account.avatarPolicy.rule1')}</li>
          <li>{t('account.avatarPolicy.rule2')}</li>
          <li>{t('account.avatarPolicy.rule3')}</li>
        </ul>

        <div className="flex gap-3 pt-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            {t('account.common.cancel')}
          </button>
          <button onClick={onAccept} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
            {t('account.avatarPolicy.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
