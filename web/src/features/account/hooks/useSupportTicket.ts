import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSupportTicket } from '../../support/services/tickets.service';

type SupportTicketForm = {
  subject: string;
  category: string;
  message: string;
};

type UseSupportTicketParams = {
  userId?: string;
  onSuccess: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
};

export function useSupportTicket({ userId, onSuccess, showToast }: UseSupportTicketParams) {
  const { t } = useTranslation();
  const [showSupportTicketModal, setShowSupportTicketModal] = useState(false);
  const [supportTicketForm, setSupportTicketForm] = useState<SupportTicketForm>({
    subject: '',
    category: 'Tecnico',
    message: '',
  });
  const [creatingSupportTicket, setCreatingSupportTicket] = useState(false);
  const [supportTicketError, setSupportTicketError] = useState('');

  const openSupportTicketModal = () => {
    setSupportTicketForm({
      subject: '',
      category: 'Tecnico',
      message: '',
    });
    setSupportTicketError('');
    setShowSupportTicketModal(true);
  };

  const closeSupportTicketModal = () => {
    setShowSupportTicketModal(false);
    setSupportTicketError('');
  };

  const handleCreateSupportTicket = async () => {
    setSupportTicketError('');

    if (!userId) {
      setSupportTicketError(t('account.states.profileLoadError'));
      return;
    }

    if (!supportTicketForm.subject.trim() || !supportTicketForm.message.trim()) {
      setSupportTicketError(t('account.security.ticketModal.requiredFields'));
      return;
    }

    setCreatingSupportTicket(true);
    try {
      const result = await createSupportTicket(userId, {
        subject: supportTicketForm.subject,
        category: supportTicketForm.category,
        message: supportTicketForm.message,
      });

      if (!result.success) {
        throw new Error(result.error || t('account.security.ticketModal.createError'));
      }

      setShowSupportTicketModal(false);
      setSupportTicketForm({ subject: '', category: 'Tecnico', message: '' });
      onSuccess();
      showToast(t('account.security.ticketModal.created', { ticketNumber: result.ticketNumber }));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('account.security.ticketModal.createError');
      setSupportTicketError(message);
    } finally {
      setCreatingSupportTicket(false);
    }
  };

  return {
    showSupportTicketModal,
    supportTicketForm,
    setSupportTicketForm,
    supportTicketError,
    creatingSupportTicket,
    openSupportTicketModal,
    closeSupportTicketModal,
    handleCreateSupportTicket,
  };
}
