import type { SupabaseClient } from "@supabase/supabase-js";

export type SupportTicketInsert = {
  userId: string;
  ticketNumber: string;
  subject: string;
  category: string;
  message: string;
  priority: string;
};

export type SupportTicketRow = {
  id: string;
  user_id: string;
  ticket_number: string;
  asunto: string;
  categoria: string;
  mensaje: string;
  prioridad: string;
  estado: string | null;
  created_at: string;
};

export async function insertSupportTicket(
  client: SupabaseClient,
  input: SupportTicketInsert,
): Promise<void> {
  const { error } = await client.from("support_tickets").insert([
    {
      user_id: input.userId,
      ticket_number: input.ticketNumber,
      asunto: input.subject,
      categoria: input.category,
      mensaje: input.message,
      prioridad: input.priority,
    },
  ]);

  if (error) {
    throw new Error(error.message || "No se pudo abrir el ticket de soporte");
  }
}

export async function findSupportTicketsByUser(
  client: SupabaseClient,
  userId: string,
): Promise<SupportTicketRow[]> {
  const { data, error } = await client
    .from("support_tickets")
    .select("id, user_id, ticket_number, asunto, categoria, mensaje, prioridad, estado, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "No se pudieron recuperar los tickets");
  }

  return (data ?? []) as SupportTicketRow[];
}
