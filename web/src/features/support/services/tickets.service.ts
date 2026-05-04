import {
  createSupportTicket as createSupportTicketFromApi,
  getUserSupportTickets as getUserSupportTicketsFromApi,
  type CreateSupportTicketInput,
  type CreateSupportTicketResult,
  type SupportTicket,
} from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export type { CreateSupportTicketInput, CreateSupportTicketResult, SupportTicket };

export function createSupportTicket(
  userId: string,
  input: CreateSupportTicketInput,
): Promise<CreateSupportTicketResult> {
  return createSupportTicketFromApi(supabase, userId, input);
}

export function getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
  return getUserSupportTicketsFromApi(supabase, userId);
}
