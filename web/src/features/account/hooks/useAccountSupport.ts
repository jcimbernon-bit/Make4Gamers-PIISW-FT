import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getUserGameReports,
  getUserReports,
  type GameReport,
  type UserReport,
} from '../../reports/services/reports.service';
import { getUserSupportTickets, type SupportTicket } from '../../support/services/tickets.service';

export function useAccountSupport() {
  const { t } = useTranslation();
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [sentUserReports, setSentUserReports] = useState<UserReport[]>([]);
  const [sentGameReports, setSentGameReports] = useState<GameReport[]>([]);
  const [loadingSupportHistory, setLoadingSupportHistory] = useState(false);

  const loadSupportHistory = useCallback(async (userId: string) => {
    setLoadingSupportHistory(true);
    try {
      const [tickets, userReports, gameReports] = await Promise.all([
        getUserSupportTickets(userId),
        getUserReports(userId),
        getUserGameReports(userId),
      ]);

      setSupportTickets(tickets);
      setSentUserReports(userReports);
      setSentGameReports(gameReports);
    } catch (error) {
      console.warn('Error cargando historial de soporte:', error);
      setSupportTickets([]);
      setSentUserReports([]);
      setSentGameReports([]);
    } finally {
      setLoadingSupportHistory(false);
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const locale = t('account.locale', { defaultValue: 'es-ES' });
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, [t]);

  return {
    supportTickets,
    sentUserReports,
    sentGameReports,
    loadingSupportHistory,
    loadSupportHistory,
    formatDate,
  };
}
