import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  reportGame,
  searchReportableGames,
  type ReportableGame,
} from '../../reports/services/reports.service';

export type GameReportSearchEntry = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  status: string | null;
  genre: string | null;
};

type ReportGameForm = {
  reportedGameId: string;
  reportedGameTitle: string;
  searchQuery: string;
  reason: string;
  details: string;
};

type UseReportGameParams = {
  userId?: string;
  onSuccess: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
};

export function useReportGame({ userId, onSuccess, showToast }: UseReportGameParams) {
  const { t } = useTranslation();
  const [showReportGameModal, setShowReportGameModal] = useState(false);
  const [reportGameForm, setReportGameForm] = useState<ReportGameForm>({
    reportedGameId: '',
    reportedGameTitle: '',
    searchQuery: '',
    reason: '',
    details: '',
  });
  const [reportingGame, setReportingGame] = useState(false);
  const [searchingReportGames, setSearchingReportGames] = useState(false);
  const [reportGameSearchResults, setReportGameSearchResults] = useState<GameReportSearchEntry[]>([]);
  const [reportGameError, setReportGameError] = useState('');

  const openReportGameModal = () => {
    setReportGameForm({
      reportedGameId: '',
      reportedGameTitle: '',
      searchQuery: '',
      reason: '',
      details: '',
    });
    setReportGameSearchResults([]);
    setReportGameError('');
    setShowReportGameModal(true);
  };

  const closeReportGameModal = () => {
    setShowReportGameModal(false);
    setReportGameError('');
  };

  const handleGameReportSearchChange = (value: string) => {
    setReportGameForm((current) => ({
      ...current,
      searchQuery: value,
      reportedGameId: '',
      reportedGameTitle: '',
    }));
  };

  const handleReportGameSelect = (game: GameReportSearchEntry) => {
    setReportGameForm((current) => ({
      ...current,
      reportedGameId: game.id,
      reportedGameTitle: game.title,
      searchQuery: game.title,
    }));
  };

  const selectedReportedGame = useMemo(
    () =>
      reportGameForm.reportedGameId
        ? reportGameSearchResults.find((game) => game.id === reportGameForm.reportedGameId) ?? null
        : null,
    [reportGameForm.reportedGameId, reportGameSearchResults],
  );

  const handleReportGame = async () => {
    setReportGameError('');

    if (!userId) {
      setReportGameError(t('account.states.profileLoadError'));
      return;
    }

    if (!reportGameForm.reportedGameId) {
      setReportGameError(t('account.security.reportGameModal.selectGame', { defaultValue: 'Selecciona un juego' }));
      return;
    }

    if (!reportGameForm.reason) {
      setReportGameError(t('account.security.reportGameModal.selectReason', { defaultValue: 'Selecciona un motivo' }));
      return;
    }

    setReportingGame(true);
    try {
      const result = await reportGame(
        userId,
        reportGameForm.reportedGameId,
        reportGameForm.reason,
        reportGameForm.details.trim() || undefined,
      );

      if (!result.success) {
        throw new Error(result.error || t('account.alerts.reportError'));
      }

      setShowReportGameModal(false);
      setReportGameForm({ reportedGameId: '', reportedGameTitle: '', searchQuery: '', reason: '', details: '' });
      setReportGameSearchResults([]);
      onSuccess();
      showToast(t('account.alerts.reportSent'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('account.alerts.reportError');
      setReportGameError(message);
    } finally {
      setReportingGame(false);
    }
  };

  useEffect(() => {
    const runSearch = async () => {
      if (!showReportGameModal || !userId) {
        return;
      }

      const query = reportGameForm.searchQuery.trim();
      if (query.length < 2) {
        setReportGameSearchResults([]);
        return;
      }

      setSearchingReportGames(true);
      setReportGameError('');

      try {
        const games = await searchReportableGames(userId, query);
        const normalized = games
          .filter((game: ReportableGame) => !!game.id)
          .map((game: ReportableGame) => ({
            id: game.id,
            title: game.title || t('account.security.reportGameModal.defaultGame', { defaultValue: 'Juego sin titulo' }),
            thumbnail_url: game.thumbnail_url,
            status: game.status,
            genre: game.genre,
          }));

        setReportGameSearchResults(normalized);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('account.alerts.reportError');
        setReportGameError(message);
      } finally {
        setSearchingReportGames(false);
      }
    };

    const timer = setTimeout(() => {
      void runSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [reportGameForm.searchQuery, showReportGameModal, t, userId]);

  return {
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
  };
}
