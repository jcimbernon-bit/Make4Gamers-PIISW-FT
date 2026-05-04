import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase';
import {
  getAuthenticatedUser,
  subscribeToAuthState,
  updatePassword,
  verifyCurrentPassword,
} from '../../auth/services/auth.service';
import {
  checkMatchCountAchievements,
  checkScoreAchievements,
  checkSocialAchievements,
  getUserAchievements,
} from '../../achievements/services/achievements.service';
import {
  getAccountFriends,
  getAccountHighScores,
  getAccountProfile,
  getAccountRecentGames,
  updateAccountProfile,
} from '../services/account.service';

export type AccountProfile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
  status: string | null;
  allow_requests?: boolean | null;
  role?: string | null;
  location?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  birth_date?: string | null;
  phone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  subscription_tier?: string | null;
  subscription_end_date?: string | null;
};

export type RecentGame = {
  id: number | string;
  score: number;
  created_at: string;
  game: { title: string | null } | null;
  opponent?: string;
  status?: string;
};

export type FriendEntry = {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
};

export type HighScoreEntry = {
  displayTitle: string;
  score: number;
};

export type UserAchievement = NonNullable<Awaited<ReturnType<typeof getUserAchievements>>>[number];

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type EditProfileForm = {
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
};

type UseAccountCoreParams = {
  showToast: (message: string, type?: 'success' | 'error') => void;
  onLoadSupportHistory: (userId: string) => Promise<void> | void;
};

export function useAccountCore({ showToast, onLoadSupportHistory }: UseAccountCoreParams) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [allowRequests, setAllowRequests] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState<EditProfileForm>({
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileEditError, setProfileEditError] = useState('');

  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [highScores, setHighScores] = useState<HighScoreEntry[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);

  const buildSessionProfile = useCallback((user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AccountProfile => {
    const fallbackUsername =
      (user.user_metadata?.username as string | undefined) ||
      user.email?.split('@')[0] ||
      null;

    const fullName = (user.user_metadata?.full_name as string | undefined) || '';
    const [firstName, ...restOfName] = fullName.trim().split(/\s+/).filter(Boolean);
    const lastName = restOfName.length > 0 ? restOfName.join(' ') : null;

    return {
      id: user.id,
      username: fallbackUsername,
      avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
      email: user.email ?? null,
      status: 'Disponible',
      allow_requests: true,
      role: 'Jugador',
      location: null,
      first_name: firstName || null,
      last_name: lastName,
      birth_date: (user.user_metadata?.birth_date as string | undefined) ?? null,
      phone: null,
      created_at: null,
      updated_at: null,
      subscription_tier: (user.user_metadata?.subscription_tier as string | undefined) ?? 'free',
      subscription_end_date: null,
    };
  }, []);

  const loadRecentGames = useCallback(async (userId: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout cargando juegos')), 5000)
      );

      const data = await Promise.race([
        getAccountRecentGames(userId, 5),
        timeoutPromise,
      ]) as Awaited<ReturnType<typeof getAccountRecentGames>>;

      const normalizedGames: RecentGame[] = data.map((item) => ({
        id: item.id,
        score: item.score ?? 0,
        created_at: item.created_at,
        game: item.game,
      }));
      setRecentGames(normalizedGames);
    } catch (error) {
      console.warn('Error o timeout cargando juegos:', error);
      setRecentGames([]);
    }
  }, []);

  const loadHighScores = useCallback(async (userId: string) => {
    try {
      const data = await getAccountHighScores(userId);
      setHighScores(data);
    } catch (error) {
      console.warn('Error cargando records:', error);
      setHighScores([]);
    }
  }, []);

  const loadFriends = useCallback(async (userId: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout cargando amigos')), 5000)
      );

      const data = await Promise.race([
        getAccountFriends(userId),
        timeoutPromise,
      ]) as Awaited<ReturnType<typeof getAccountFriends>>;

      setFriends((data || []) as FriendEntry[]);
    } catch (error) {
      console.warn('Error o timeout cargando amigos:', error);
      setFriends([]);
    }
  }, []);

  const hydrateAccount = useCallback(async (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
    let mergedProfile: AccountProfile;

    try {
      const profileData = await getAccountProfile(user.id);
      const sessionProfile = buildSessionProfile(user);
      mergedProfile = {
        ...sessionProfile,
        ...profileData,
        first_name: profileData.first_name ?? sessionProfile.first_name,
        last_name: profileData.last_name ?? sessionProfile.last_name,
        birth_date: profileData.birth_date ?? sessionProfile.birth_date,
        subscription_tier: profileData.subscription_tier ?? sessionProfile.subscription_tier,
        email: user.email ?? null,
      };
    } catch (profileError) {
      console.warn('No se encontro perfil en tabla profiles. Se usa perfil minimo de sesion.', profileError);
      mergedProfile = buildSessionProfile(user);
    }

    setProfile(mergedProfile);
    await checkMatchCountAchievements(user.id);
    await checkScoreAchievements(user.id);
    await checkSocialAchievements(user.id);
    const achievementsData = await getUserAchievements(user.id);
    if (achievementsData) {
      setUserAchievements(achievementsData);
    }
    setAllowRequests(mergedProfile.allow_requests !== false);
    setEditNameValue(mergedProfile.username || '');

    Promise.all([
      loadRecentGames(user.id),
      loadFriends(user.id),
      loadHighScores(user.id),
      Promise.resolve(onLoadSupportHistory(user.id)),
    ]).catch((error) => {
      console.error('Error cargando datos secundarios:', error);
    });
  }, [buildSessionProfile, loadFriends, loadHighScores, loadRecentGames, onLoadSupportHistory]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user ?? (await getAuthenticatedUser());

        if (user) {
          const quickProfile = buildSessionProfile(user);
          setProfile(quickProfile);
          setAllowRequests(quickProfile.allow_requests !== false);
          setEditNameValue(quickProfile.username || '');

          void hydrateAccount(user);
        }
      } catch (error) {
        console.error('Error cargando el perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();

    const {
      data: { subscription },
    } = subscribeToAuthState(async (_event, session) => {
      if (session?.user) {
        const quickProfile = buildSessionProfile(session.user);
        setProfile(quickProfile);
        setAllowRequests(quickProfile.allow_requests !== false);
        setEditNameValue(quickProfile.username || '');

        void hydrateAccount(session.user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [buildSessionProfile, hydrateAccount]);

  const openEditProfileModal = () => {
    setEditProfileForm({
      username: profile?.username || '',
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      birthDate: profile?.birth_date || '',
      email: profile?.email || '',
    });
    setProfileEditError('');
    setShowEditProfileModal(true);
  };

  const togglePrivacy = async () => {
    if (!profile) return;
    setSavingPrivacy(true);
    const newValue = !allowRequests;

    try {
      await updateAccountProfile(profile.id, { allow_requests: newValue });
      setAllowRequests(newValue);
    } catch (error) {
      console.error('Error actualizando privacidad:', error);
      showToast(t('account.alerts.saveConfigError'), 'error');
    } finally {
      setSavingPrivacy(false);
    }
  };

  const saveUsername = async () => {
    if (!profile) return;

    const newName = editNameValue.trim();
    if (!newName) {
      showToast(t('account.alerts.emptyUsername'), 'error');
      return;
    }

    setSavingName(true);
    try {
      await updateAccountProfile(profile.id, { username: newName });
      setProfile((prev) => (prev ? { ...prev, username: newName } : prev));
      setIsEditingName(false);
    } catch (error) {
      console.error('Error actualizando el nombre:', error);
      showToast(t('account.alerts.saveUsernameError'), 'error');
    } finally {
      setSavingName(false);
    }
  };

  const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!profile) return;

    const newStatus = event.target.value;
    setProfile((prev) => (prev ? { ...prev, status: newStatus } : prev));

    try {
      await updateAccountProfile(profile.id, { status: newStatus });
    } catch (error) {
      console.error('Error actualizando el estado:', error);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);

      if (!profile) {
        throw new Error('No se pudo identificar el perfil actual.');
      }

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen para subir.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await updateAccountProfile(profile.id, { avatar_url: publicUrl });

      setProfile((prev) => (prev ? { ...prev, avatar_url: publicUrl } : prev));
      showToast(t('account.alerts.avatarUpdated'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('account.alerts.avatarUploadError');
      showToast(message, 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    if (!passwordForm.newPassword || !passwordForm.currentPassword || !passwordForm.confirmPassword) {
      setPasswordError(t('account.security.passwords.allFieldsRequired'));
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError(t('account.security.passwords.minLength'));
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t('account.security.passwords.passwordMismatch'));
      return;
    }

    setChangingPassword(true);
    try {
      await verifyCurrentPassword(passwordForm.currentPassword);
      await updatePassword(passwordForm.newPassword);

      setShowChangePasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast(t('account.alerts.passwordChanged'));
    } catch (error) {
      console.error('Error al cambiar contrasena:', error);
      const message =
        error instanceof Error && /invalid login credentials/i.test(error.message)
          ? t('account.security.passwords.invalidCurrentPassword')
          : error instanceof Error
            ? error.message
            : t('account.security.passwords.changeError');
      setPasswordError(message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleEditProfile = async () => {
    setProfileEditError('');

    if (!profile?.id) {
      setProfileEditError(t('account.states.profileLoadError'));
      return;
    }

    if (!editProfileForm.firstName || !editProfileForm.lastName) {
      setProfileEditError(t('account.security.personalInfo.requiredFields'));
      return;
    }

    setEditingProfile(true);
    try {
      await updateAccountProfile(profile.id, {
        username: editProfileForm.username || null,
        first_name: editProfileForm.firstName,
        last_name: editProfileForm.lastName,
        birth_date: editProfileForm.birthDate || null,
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              username: editProfileForm.username || null,
              first_name: editProfileForm.firstName,
              last_name: editProfileForm.lastName,
              birth_date: editProfileForm.birthDate || null,
            }
          : prev,
      );

      setShowEditProfileModal(false);
      showToast(t('account.alerts.profileUpdated'));
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      const message = error instanceof Error ? error.message : t('account.alerts.profileUpdateError');
      setProfileEditError(message);
    } finally {
      setEditingProfile(false);
    }
  };

  return {
    profile,
    loading,
    allowRequests,
    savingPrivacy,
    isEditingName,
    editNameValue,
    savingName,
    uploadingAvatar,
    showChangePasswordModal,
    passwordForm,
    changingPassword,
    passwordError,
    showEditProfileModal,
    editProfileForm,
    editingProfile,
    profileEditError,
    recentGames,
    friends,
    highScores,
    userAchievements,
    setIsEditingName,
    setEditNameValue,
    setShowChangePasswordModal,
    setPasswordForm,
    setPasswordError,
    setEditProfileForm,
    setProfileEditError,
    openEditProfileModal,
    togglePrivacy,
    saveUsername,
    handleStatusChange,
    uploadAvatar,
    handleChangePassword,
    handleEditProfile,
  };
}
