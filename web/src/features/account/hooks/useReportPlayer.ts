import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  reportUser,
  searchReportableUsers,
  type ReportableUser,
} from '../../reports/services/reports.service';

export type ReportSearchEntry = {
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

type UseReportPlayerParams = {
  userId?: string;
  onSuccess: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
};

export function useReportPlayer({ userId, onSuccess, showToast }: UseReportPlayerParams) {
  const { t } = useTranslation();
  const [showReportPlayerModal, setShowReportPlayerModal] = useState(false);
  const [reportPlayerForm, setReportPlayerForm] = useState<ReportPlayerForm>({
    reportedUserId: '',
    reportedUsername: '',
    searchQuery: '',
    reason: '',
    details: '',
  });
  const [reportingPlayer, setReportingPlayer] = useState(false);
  const [searchingReportUsers, setSearchingReportUsers] = useState(false);
  const [reportSearchResults, setReportSearchResults] = useState<ReportSearchEntry[]>([]);
  const [reportPlayerError, setReportPlayerError] = useState('');

  const openReportPlayerModal = () => {
    setReportPlayerForm({
      reportedUserId: '',
      reportedUsername: '',
      searchQuery: '',
      reason: '',
      details: '',
    });
    setReportSearchResults([]);
    setReportPlayerError('');
    setShowReportPlayerModal(true);
  };

  const closeReportPlayerModal = () => {
    setShowReportPlayerModal(false);
    setReportPlayerError('');
  };

  const handleReportSearchChange = (value: string) => {
    setReportPlayerForm((current) => ({
      ...current,
      searchQuery: value,
      reportedUserId: '',
      reportedUsername: '',
    }));
  };

  const handleReportUserSelect = (user: ReportSearchEntry) => {
    setReportPlayerForm((current) => ({
      ...current,
      reportedUserId: user.id,
      reportedUsername: user.username,
      searchQuery: user.username,
    }));
  };

  const selectedReportedUser = useMemo(
    () =>
      reportPlayerForm.reportedUserId
        ? reportSearchResults.find((user) => user.id === reportPlayerForm.reportedUserId) ?? null
        : null,
    [reportPlayerForm.reportedUserId, reportSearchResults],
  );

  const handleReportPlayer = async () => {
    setReportPlayerError('');

    if (!userId) {
      setReportPlayerError(t('account.states.profileLoadError'));
      return;
    }

    if (!reportPlayerForm.reportedUserId) {
      setReportPlayerError(t('account.security.reportModal.selectUser'));
      return;
    }

    if (!reportPlayerForm.reason) {
      setReportPlayerError(t('account.security.reportModal.selectReason'));
      return;
    }

    setReportingPlayer(true);
    try {
      const result = await reportUser(
        userId,
        reportPlayerForm.reportedUserId,
        reportPlayerForm.reason,
        reportPlayerForm.details.trim() || undefined,
      );

      if (!result.success) {
        throw new Error(result.error || t('account.alerts.reportError'));
      }

      setShowReportPlayerModal(false);
      setReportPlayerForm({ reportedUserId: '', reportedUsername: '', searchQuery: '', reason: '', details: '' });
      setReportSearchResults([]);
      onSuccess();
      showToast(t('account.alerts.reportSent'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('account.alerts.reportError');
      setReportPlayerError(message);
    } finally {
      setReportingPlayer(false);
    }
  };

  useEffect(() => {
    const runSearch = async () => {
      if (!showReportPlayerModal || !userId) {
        return;
      }

      const query = reportPlayerForm.searchQuery.trim();
      if (query.length < 2) {
        setReportSearchResults([]);
        return;
      }

      setSearchingReportUsers(true);
      setReportPlayerError('');

      try {
        const users = await searchReportableUsers(userId, query);
        const normalized = users
          .filter((user: ReportableUser) => !!user.id)
          .map((user: ReportableUser) => ({
            id: user.id,
            username: user.username || t('account.dashboard.defaultUser'),
            avatar_url: user.avatar_url,
            status: user.status,
          }));

        setReportSearchResults(normalized);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('account.alerts.reportError');
        setReportPlayerError(message);
      } finally {
        setSearchingReportUsers(false);
      }
    };

    const timer = setTimeout(() => {
      void runSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [reportPlayerForm.searchQuery, showReportPlayerModal, t, userId]);

  return {
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
  };
}
