import { useTranslation } from 'react-i18next';
import { Edit2 } from 'lucide-react';

type EditProfileForm = {
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
};

type EditProfileModalProps = {
  editProfileForm: EditProfileForm;
  profileEditError: string;
  editingProfile: boolean;
  onFormChange: (form: EditProfileForm) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function EditProfileModal({
  editProfileForm,
  profileEditError,
  editingProfile,
  onFormChange,
  onClose,
  onSubmit,
}: EditProfileModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-indigo-400 mb-2 border-b border-slate-800 pb-3">
          <Edit2 size={32} />
          <h3 className="text-2xl font-bold text-white">{t('account.security.accountInfo')}</h3>
        </div>

        {profileEditError && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">{profileEditError}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.personal.username')}</label>
            <input
              type="text"
              value={editProfileForm.username}
              onChange={(e) => onFormChange({ ...editProfileForm, username: e.target.value })}
              placeholder={t('account.personal.username')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.personal.name')}</label>
            <input
              type="text"
              value={editProfileForm.firstName}
              onChange={(e) => onFormChange({ ...editProfileForm, firstName: e.target.value })}
              placeholder={t('account.security.personalInfo.enterFirstName')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.personal.lastName')}</label>
            <input
              type="text"
              value={editProfileForm.lastName}
              onChange={(e) => onFormChange({ ...editProfileForm, lastName: e.target.value })}
              placeholder={t('account.security.personalInfo.enterLastName')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">{t('account.personal.birthDate')}</label>
            <input
              type="date"
              value={editProfileForm.birthDate}
              onChange={(e) => onFormChange({ ...editProfileForm, birthDate: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input type="email" value={editProfileForm.email} disabled className="w-full rounded-lg border border-slate-700 bg-slate-800/40 py-2 px-3 text-slate-500 cursor-not-allowed" />
            <p className="text-xs text-slate-500 mt-1">{t('account.security.personalInfo.emailNotEditable')}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            {t('account.common.cancel')}
          </button>
          <button onClick={onSubmit} disabled={editingProfile} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {editingProfile ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : t('account.common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
