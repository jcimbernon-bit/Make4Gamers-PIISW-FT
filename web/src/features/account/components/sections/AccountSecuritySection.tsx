import { useTranslation } from 'react-i18next';
import { Shield, ShieldAlert } from 'lucide-react';

type AccountSecuritySectionProps = {
  allowRequests: boolean;
  savingPrivacy: boolean;
  onOpenChangePassword: () => void;
  onOpenEditProfile: () => void;
  onTogglePrivacy: () => void;
};

export function AccountSecuritySection({
  allowRequests,
  savingPrivacy,
  onOpenChangePassword,
  onOpenEditProfile,
  onTogglePrivacy,
}: AccountSecuritySectionProps) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <h3 className="text-xl font-semibold text-white">{t('account.security.title')}</h3>

      <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">{t('account.security.personalSection')}</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenChangePassword}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors"
          >
            {t('account.security.changePassword')}
          </button>
          <button
            onClick={onOpenEditProfile}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors"
          >
            {t('account.security.accountInfo')}
          </button>
          <button className="rounded-md border border-rose-500/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10 transition-colors">
            {t('account.security.deactivateAccount')}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">{t('account.security.accountSecuritySection')}</h4>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">
            {t('account.security.enable2fa')}
          </button>
          <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">
            {t('account.security.changePaymentMethod')}
          </button>
          <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-indigo-500 transition-colors">
            {t('account.security.verifyEmail')}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 inline-flex flex-col items-start">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">{t('account.security.friendPrivacy')}</span>
        <button
          onClick={onTogglePrivacy}
          disabled={savingPrivacy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            allowRequests
              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
          }`}
        >
          {savingPrivacy ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : allowRequests ? (
            <Shield size={16} />
          ) : (
            <ShieldAlert size={16} />
          )}
          {allowRequests ? t('account.security.requestsEnabled') : t('account.security.requestsBlocked')}
        </button>
      </div>
    </section>
  );
}
