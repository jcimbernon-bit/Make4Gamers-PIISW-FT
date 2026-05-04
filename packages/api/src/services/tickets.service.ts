import type { SupabaseClient } from "@supabase/supabase-js";
import { findSupportTicketsByUser, insertSupportTicket, type SupportTicketRow } from "../repositories/tickets.repository";

export type CreateSupportTicketInput = {
  subject: string;
  category: string;
  message: string;
};

export type CreateSupportTicketResult = {
  success: boolean;
  ticketNumber: string | null;
  error: string | null;
};

export type SupportTicket = SupportTicketRow;

function buildTicketNumber() {
  return `TK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function getInitialPriority(category: string) {
  if (category === "Pagos") {
    return "Alta";
  }

  if (category === "Denuncia") {
    return "Urgente";
  }

  return "Normal";
}

export async function createSupportTicket(
  client: SupabaseClient,
  userId: string,
  input: CreateSupportTicketInput,
): Promise<CreateSupportTicketResult> {
  const subject = input.subject.trim();
  const message = input.message.trim();
  const category = input.category.trim() || "Tecnico";

  if (!userId) {
    return { success: false, ticketNumber: null, error: "Debes iniciar sesion para abrir un ticket." };
  }

  if (!subject || !message) {
    return { success: false, ticketNumber: null, error: "El asunto y el mensaje son obligatorios." };
  }

  const ticketNumber = buildTicketNumber();

  try {
    await insertSupportTicket(client, {
      userId,
      ticketNumber,
      subject,
      category,
      message,
      priority: getInitialPriority(category),
    });

    return { success: true, ticketNumber, error: null };
  } catch (error: any) {
    console.error("Error creando ticket de soporte:", error);
    return {
      success: false,
      ticketNumber: null,
      error: error.message || "No se pudo abrir el ticket de soporte.",
    };
  }
}

export async function getUserSupportTickets(
  client: SupabaseClient,
  userId: string,
): Promise<SupportTicket[]> {
  if (!userId) {
    return [];
  }

  return findSupportTicketsByUser(client, userId);
}
