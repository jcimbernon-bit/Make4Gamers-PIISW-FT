import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { checkMatchCountAchievements, checkScoreAchievements, getUserAchievements, checkSocialAchievements } from '../features/achievements/services/achievements.service';
import {
  User as UserIcon,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '../supabase';

import { getAuthenticatedUser, subscribeToAuthState, updatePassword, verifyCurrentPassword } from '../features/auth/services/auth.service';
import {
  getAccountFriends,
  getAccountProfile,
  getAccountRecentGames,
  updateAccountProfile,
  getAccountHighScores,
  cancelDeveloperRequest,
  createDeveloperRequest,
  getLatestDeveloperRequest,
  type DeveloperRequest,
} from '../features/account/services/account.service';
import { AccountSidebar } from '../features/account/components/AccountSidebar';
import { AccountSupportSection } from '../features/account/components/AccountSupportSection';
import { AccountDashboardSection } from '../features/account/components/sections/AccountDashboardSection';
import { AccountPersonalSection } from '../features/account/components/sections/AccountPersonalSection';
import { AccountFriendsSection } from '../features/account/components/sections/AccountFriendsSection';
import { AccountPaymentsSection } from '../features/account/components/sections/AccountPaymentsSection';
import { AccountSecuritySection } from '../features/account/components/sections/AccountSecuritySection';
import { AccountMatchesSection } from '../features/account/components/sections/AccountMatchesSection';
import { AccountStatsSection } from '../features/account/components/sections/AccountStatsSection';
import { AccountAchievementsSection } from '../features/account/components/sections/AccountAchievementsSection';
import { AvatarPolicyModal } from '../features/account/components/modals/AvatarPolicyModal';
import { ChangePasswordModal } from '../features/account/components/modals/ChangePasswordModal';
import { EditProfileModal } from '../features/account/components/modals/EditProfileModal';
import { ReportPlayerModal } from '../features/account/components/modals/ReportPlayerModal';
import { ReportGameModal } from '../features/account/components/modals/ReportGameModal';
import { SupportTicketModal } from '../features/account/components/modals/SupportTicketModal';
import { DeveloperRequestModal } from '../features/account/components/modals/DeveloperRequestModal';
import { useAccountSupport } from '../features/account/hooks/useAccountSupport';
import { useReportPlayer } from '../features/account/hooks/useReportPlayer';
import { useReportGame } from '../features/account/hooks/useReportGame';
import { useSupportTicket } from '../features/account/hooks/useSupportTicket';
import type { AccountSection, SupportTab } from '../features/account/types/account-ui.types';
import { friendshipService } from '../features/social/services/friendship.service';
type Profile = {
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

const ACCOUNT_SECTION_STORAGE_KEY = 'account_active_section';

function isAccountSection(value: string | null): value is AccountSection {
  return (
    value === 'dashboard' ||
    value === 'personal' ||
    value === 'friends' ||
    value === 'matches' ||
    value === 'stats' ||
    value === 'achievements' ||
    value === 'payments' ||
    value === 'security' ||
    value === 'support'
  );
}

type RecentGame = {
  id: number | string;
  score: number;
  created_at: string;
  game: { title: string | null } | null;
  opponent?: string;
  status?: string;
};

type FriendEntry = {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
};

type HighScoreEntry = {
  displayTitle: string;
  score: number;
};

type UserAchievement = NonNullable<Awaited<ReturnType<typeof getUserAchievements>>>[number];

export default function Cuenta() {
  const { t } = useTranslation();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [allowRequests, setAllowRequests] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarPolicyModal, setShowAvatarPolicyModal] = useState(false);
  const [activeSection, setActiveSection] = useState<AccountSection>(() => {
    if (typeof window === 'undefined') return 'dashboard';
    const cachedSection = localStorage.getItem(ACCOUNT_SECTION_STORAGE_KEY);
    return isAccountSection(cachedSection) ? cachedSection : 'dashboard';
  });
  const [activeSupportTab, setActiveSupportTab] = useState<SupportTab>('tickets');
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);

  // Change password modal
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Edit profile modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileEditError, setProfileEditError] = useState('');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [friendsSearch, setFriendsSearch] = useState('');
  const [highScores, setHighScores] = useState<HighScoreEntry[]>([]);
  const [developerRequest, setDeveloperRequest] = useState<DeveloperRequest | null>(null);
  const [devRequestTitle, setDevRequestTitle] = useState('');
  const [devRequestReason, setDevRequestReason] = useState('');
  const [creatingDeveloperRequest, setCreatingDeveloperRequest] = useState(false);
  const [cancellingDeveloperRequest, setCancellingDeveloperRequest] = useState(false);
  const [showDeveloperRequestModal, setShowDeveloperRequestModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize edit profile form when modal opens
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

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const {
    supportTickets,
    sentUserReports,
    sentGameReports,
    loadingSupportHistory,
    loadSupportHistory,
    formatDate,
  } = useAccountSupport();

  const handleReportPlayerSuccess = useCallback(() => {
    if (!profile?.id) return;
    setActiveSection('support');
    setActiveSupportTab('users');
    void loadSupportHistory(profile.id);
  }, [loadSupportHistory, profile?.id]);

  const handleReportGameSuccess = useCallback(() => {
    if (!profile?.id) return;
    setActiveSection('support');
    setActiveSupportTab('games');
    void loadSupportHistory(profile.id);
  }, [loadSupportHistory, profile?.id]);

  const handleSupportTicketSuccess = useCallback(() => {
    if (!profile?.id) return;
    setActiveSection('support');
    setActiveSupportTab('tickets');
    void loadSupportHistory(profile.id);
  }, [loadSupportHistory, profile?.id]);

  const {
    showReportPlayerModal,
    reportPlayerForm,
    setReportPlayerForm,
    reportingPlayer,
    searchingReportUsers,
    reportSearchResults,
    reportPlayerError,
    selectedReportedUser,
    openReportPlayerModal,
    closeReportPlayerModal,
    handleReportSearchChange,
    handleReportUserSelect,
    handleReportPlayer,
  } = useReportPlayer({
    userId: profile?.id,
    onSuccess: handleReportPlayerSuccess,
    showToast,
  });

  const {
    showReportGameModal,
    reportGameForm,
    setReportGameForm,
    reportingGame,
    searchingReportGames,
    reportGameSearchResults,
    reportGameError,
    selectedReportedGame,
    openReportGameModal,
    closeReportGameModal,
    handleGameReportSearchChange,
    handleReportGameSelect,
    handleReportGame,
  } = useReportGame({
    userId: profile?.id,
    onSuccess: handleReportGameSuccess,
    showToast,
  });

  const {
    showSupportTicketModal,
    supportTicketForm,
    setSupportTicketForm,
    supportTicketError,
    creatingSupportTicket,
    openSupportTicketModal,
    closeSupportTicketModal,
    handleCreateSupportTicket,
  } = useSupportTicket({
    userId: profile?.id,
    onSuccess: handleSupportTicketSuccess,
    showToast,
  });

  const buildSessionProfile = useCallback((user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): Profile => {
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

  const hydrateAccount = useCallback(async (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
    let mergedProfile: Profile;

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
      loadSupportHistory(user.id),
      loadDeveloperRequest(user.id),
    ]).catch(err => {
      console.error('Error cargando datos secundarios:', err);
    });
  }, [buildSessionProfile]);

  const loadPendingRequests = async (userId: string) => {
    try {
      const requests = await friendshipService.getPendingRequests(userId);
      setPendingRequests(requests || []);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  };


  useEffect(() => {
    const sectionFromState = (location.state as { initialSection?: AccountSection } | null)?.initialSection;
    if (sectionFromState && isAccountSection(sectionFromState)) {
      setActiveSection(sectionFromState);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem(ACCOUNT_SECTION_STORAGE_KEY, activeSection);
  }, [activeSection]);

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
        
          void loadPendingRequests(user.id); 
        }
      } catch (error) {
        console.error('Error cargando el perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const {
      data: { subscription },
    } = subscribeToAuthState(async (_event, session) => {
      if (session?.user) {
        const quickProfile = buildSessionProfile(session.user);
        setProfile(quickProfile);
        setAllowRequests(quickProfile.allow_requests !== false);
        setEditNameValue(quickProfile.username || '');

        void hydrateAccount(session.user);
      
        void loadPendingRequests(session.user.id); 
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [buildSessionProfile, hydrateAccount]);

  const loadRecentGames = async (userId: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout cargando juegos')), 5000)
      );

      const data = await Promise.race([
        getAccountRecentGames(userId, 5),
        timeoutPromise
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
  };

  const loadHighScores = async (userId: string) => {
    try {
      const data = await getAccountHighScores(userId);
      setHighScores(data);
    } catch (error) {
      console.warn('Error cargando records:', error);
      setHighScores([]);
    }
  };

  const loadFriends = async (userId: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout cargando amigos')), 5000)
      );

      const data = await Promise.race([
        getAccountFriends(userId),
        timeoutPromise
      ]) as Awaited<ReturnType<typeof getAccountFriends>>;

      setFriends((data || []) as FriendEntry[]);
    } catch (error) {
      console.warn('Error o timeout cargando amigos:', error);
      setFriends([]);
    }
  };

  const loadDeveloperRequest = async (userId: string) => {
    try {
      const latestRequest = await getLatestDeveloperRequest(userId);
      setDeveloperRequest(latestRequest);
    } catch (error) {
      console.warn('Error cargando solicitud de developer:', error);
      setDeveloperRequest(null);
    }
  };

  const handleCreateDeveloperRequest = async () => {
    if (!profile?.id) return;

    const titulo = devRequestTitle.trim();
    const motivo = devRequestReason.trim();

    if (!titulo || !motivo) {
      showToast('Debes completar titulo y motivo para enviar la solicitud.', 'error');
      return;
    }

    setCreatingDeveloperRequest(true);
    try {
      const request = await createDeveloperRequest({
        userId: profile.id,
        titulo,
        motivo,
      });

      setDeveloperRequest(request);
      setDevRequestTitle('');
      setDevRequestReason('');
      setShowDeveloperRequestModal(false);
      showToast('Solicitud enviada correctamente.');
    } catch (error) {
      console.error('Error creando solicitud de developer:', error);
      showToast('No se pudo enviar la solicitud.', 'error');
    } finally {
      setCreatingDeveloperRequest(false);
    }
  };

  const handleCancelDeveloperRequest = async () => {
    if (!profile?.id || !developerRequest?.id || developerRequest.estado !== 'pendiente') {
      return;
    }

    setCancellingDeveloperRequest(true);
    try {
      await cancelDeveloperRequest({
        requestId: developerRequest.id,
        userId: profile.id,
      });
      setDeveloperRequest(null);
      showToast('Solicitud cancelada correctamente.');
    } catch (error) {
      console.error('Error cancelando solicitud de developer:', error);
      const message = error instanceof Error ? error.message : 'No se pudo cancelar la solicitud.';
      showToast(message, 'error');
    } finally {
      setCancellingDeveloperRequest(false);
    }
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

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!profile) return;

    const newStatus = e.target.value;

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
      console.error('Error al cambiar contraseña:', error);
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
          : prev
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
  const filteredFriends = friends.filter((friend) => friend.username.toLowerCase().includes(friendsSearch.toLowerCase()));


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <UserIcon size={48} className="mb-4 opacity-50" />
        <p>{t('account.states.profileLoadError')}</p>
      </div>
    );
  }


  const handleAcceptRequest = async (requestId: string, senderId: string) => {
  
    const currentUserId = profile?.id; 
    if (!currentUserId) return;

    try {
      await friendshipService.acceptFriendRequest(requestId, currentUserId, senderId);
      
  
      await loadPendingRequests(currentUserId);
      
    
      void hydrateAccount({ id: currentUserId } as any);
      
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const currentUserId = profile?.id; 
    if (!currentUserId) return;

    try {
      await friendshipService.rejectFriendRequest(requestId);
    
      await loadPendingRequests(currentUserId);
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      {toast && (
        <div className="fixed top-4 right-4 z-60 max-w-sm w-[calc(100%-2rem)] sm:w-auto">
          <div
            className={`rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm flex items-start gap-2 ${toast.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-100'
              }`}
          >
            {toast.type === 'success' ? <Check size={16} className="mt-0.5" /> : <AlertTriangle size={16} className="mt-0.5" />}
            <p className="text-sm font-medium leading-5">{toast.message}</p>
          </div>
        </div>
      )}

    <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr] lg:items-stretch lg:h-[600px]" style={{ minHeight: '600px' }}>
            <AccountSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

            <main className="space-y-6 h-full min-h-[600px] flex flex-col overflow-hidden">
                  <div className="flex-1 min-h-full overflow-y-auto hide-scrollbar pr-2"> 
                {activeSection === 'dashboard' && (
                  <div className="h-full min-h-full pr-4 pb-10">
                    <AccountDashboardSection profile={profile} highScores={highScores} />
                  </div>
                )}
                
                {activeSection === 'personal' && (
                  <div className="pb-6">
                    <AccountPersonalSection
                      profile={profile}
                      uploadingAvatar={uploadingAvatar}
                      isEditingName={isEditingName}
                      editNameValue={editNameValue}
                      savingName={savingName}
                      fileInputRef={fileInputRef}
                      onOpenAvatarPolicy={() => setShowAvatarPolicyModal(true)}
                      onUploadAvatar={uploadAvatar}
                      onEditNameValueChange={setEditNameValue}
                      onEnableNameEdit={() => setIsEditingName(true)}
                      onCancelNameEdit={() => {
                        setIsEditingName(false);
                        setEditNameValue(profile.username || '');
                      }}
                      onSaveUsername={saveUsername}
                      onStatusChange={handleStatusChange}
                      developerRequest={developerRequest}
                      creatingDeveloperRequest={creatingDeveloperRequest}
                      cancellingDeveloperRequest={cancellingDeveloperRequest}
                      onOpenDeveloperRequestModal={() => setShowDeveloperRequestModal(true)}
                      onCancelDeveloperRequest={handleCancelDeveloperRequest}
                    />
                  </div>
                )}
                
                {activeSection === 'friends' && (
                  <div className="flex-1 h-full min-h-full">
                    <AccountFriendsSection
                      friendsSearch={friendsSearch}
                      filteredFriends={filteredFriends}
                      onFriendsSearchChange={setFriendsSearch}
                      pendingRequests={pendingRequests}
                      onAcceptRequest={handleAcceptRequest}
                      onRejectRequest={handleRejectRequest}
                    />
                  </div>
                )}
                
                {activeSection === 'payments' && (
                  <div className="flex-1 h-full min-h-full">
                    <AccountPaymentsSection 
                      userId={profile.id}
                      currentTier={profile.subscription_tier || 'free'}
                      onUpgradeSuccess={() => window.location.reload()}
                    />
                  </div>
                )}
                
                {activeSection === 'support' && (
                  <div className="flex-1 h-full min-h-full">
                    <AccountSupportSection
                      activeSupportTab={activeSupportTab}
                      onSupportTabChange={setActiveSupportTab}
                      supportTickets={supportTickets}
                      sentUserReports={sentUserReports}
                      sentGameReports={sentGameReports}
                      loadingSupportHistory={loadingSupportHistory}
                      onOpenReportPlayer={openReportPlayerModal}
                      onOpenReportGame={openReportGameModal}
                      onOpenSupportTicket={openSupportTicketModal}
                      formatDate={formatDate}
                    />
                  </div>
                )}

                {activeSection === 'security' && (
                  <div className="flex-1 h-full min-h-full">
                    <AccountSecuritySection
                      allowRequests={allowRequests}
                      savingPrivacy={savingPrivacy}
                      onOpenChangePassword={() => setShowChangePasswordModal(true)}
                      onOpenEditProfile={openEditProfileModal}
                      onTogglePrivacy={togglePrivacy}
                    />
                  </div>
                )}

                {activeSection === 'matches' && (
                  <div className="flex-1 h-full min-h-full">
                 
                    <AccountMatchesSection
                      recentGames={recentGames}
                      formatDate={formatDate}
                    />
                  </div>
                )}

                {activeSection === 'stats' && profile?.id && (
                  <div className="flex-1 h-full min-h-full">
                    <AccountStatsSection userId={profile.id} />
                  </div>
                )}

                {activeSection === 'achievements' && (
                  <div className="flex-1 h-full min-h-full">
                    <AccountAchievementsSection
                      userAchievements={userAchievements}
                    />
                  </div>
                )}
                
              </div>
            </main>
        </div>
      </div>

      {showAvatarPolicyModal && (
        <AvatarPolicyModal
          onClose={() => setShowAvatarPolicyModal(false)}
          onAccept={() => {
            setShowAvatarPolicyModal(false);
            fileInputRef.current?.click();
          }}
        />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          passwordForm={passwordForm}
          passwordError={passwordError}
          changingPassword={changingPassword}
          onFormChange={setPasswordForm}
          onClose={() => {
            setShowChangePasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordError('');
          }}
          onSubmit={handleChangePassword}
        />
      )}

      {showEditProfileModal && (
        <EditProfileModal
          editProfileForm={editProfileForm}
          profileEditError={profileEditError}
          editingProfile={editingProfile}
          onFormChange={setEditProfileForm}
          onClose={() => {
            setShowEditProfileModal(false);
            setProfileEditError('');
          }}
          onSubmit={handleEditProfile}
        />
      )}

      {showReportPlayerModal && (
        <ReportPlayerModal
          reportPlayerForm={reportPlayerForm}
          reportPlayerError={reportPlayerError}
          searchingReportUsers={searchingReportUsers}
          reportingPlayer={reportingPlayer}
          reportSearchResults={reportSearchResults}
          selectedReportedUser={selectedReportedUser}
          onSearchChange={handleReportSearchChange}
          onSelectUser={handleReportUserSelect}
          onFormChange={setReportPlayerForm}
          onClose={closeReportPlayerModal}
          onSubmit={handleReportPlayer}
        />
      )}

      {showReportGameModal && (
        <ReportGameModal
          reportGameForm={reportGameForm}
          reportGameError={reportGameError}
          searchingReportGames={searchingReportGames}
          reportingGame={reportingGame}
          reportGameSearchResults={reportGameSearchResults}
          selectedReportedGame={selectedReportedGame}
          onSearchChange={handleGameReportSearchChange}
          onSelectGame={handleReportGameSelect}
          onFormChange={setReportGameForm}
          onClose={closeReportGameModal}
          onSubmit={handleReportGame}
        />
      )}

      {showSupportTicketModal && (
        <SupportTicketModal
          supportTicketForm={supportTicketForm}
          supportTicketError={supportTicketError}
          creatingSupportTicket={creatingSupportTicket}
          onFormChange={setSupportTicketForm}
          onClose={closeSupportTicketModal}
          onSubmit={handleCreateSupportTicket}
        />
      )}

      {showDeveloperRequestModal && (
        <DeveloperRequestModal
          title={devRequestTitle}
          reason={devRequestReason}
          creating={creatingDeveloperRequest}
          onTitleChange={setDevRequestTitle}
          onReasonChange={setDevRequestReason}
          onClose={() => setShowDeveloperRequestModal(false)}
          onSubmit={handleCreateDeveloperRequest}
        />
      )}
    </div>
  );
}
