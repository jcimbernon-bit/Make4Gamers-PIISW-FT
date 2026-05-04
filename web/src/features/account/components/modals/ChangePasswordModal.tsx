import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordModalProps = {
  passwordForm: PasswordForm;
  passwordError: string;
  changingPassword: boolean;
  onFormChange: (form: PasswordForm) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function ChangePasswordModal({
  passwordForm,
  passwordError,
  changingPassword,
  onFormChange,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-indigo-400 mb-2 border-b border-slate-800 pb-3">
          <Lock size={32} />
          <h3 className="text-2xl font-bold text-white">{t('account.security.changePassword')}</h3>
        </div>

        {passwordError && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">{passwordError}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.passwords.currentPassword')}</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => onFormChange({ ...passwordForm, currentPassword: e.target.value })}
              placeholder={t('account.security.passwords.enterCurrentPassword')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.passwords.newPassword')}</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => onFormChange({ ...passwordForm, newPassword: e.target.value })}
              placeholder={t('account.security.passwords.enterNewPassword')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.security.passwords.confirmPassword')}</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => onFormChange({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder={t('account.security.passwords.confirmNewPassword')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            {t('account.common.cancel')}
          </button>
          <button onClick={onSubmit} disabled={changingPassword} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {changingPassword ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : t('account.common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
