import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../supabase";

export type ChatMessage = {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

async function getOrCreateMatchRoom(matchId: string): Promise<string | null> {
  console.log("[useMatchChat] join_match_chat — matchId:", matchId);

  // RPC atómica con SECURITY DEFINER en el backend:
  //  1. Valida que el usuario es jugador del match
  //  2. Crea la chat_room + match_chats si no existen (idempotente)
  //  3. Añade al usuario como participante
  // Esto evita los problemas de RLS al leer match_chats antes de ser
  // participante (el caso del 3er jugador que no podía entrar al chat).
  const { data, error } = await supabase.rpc("join_match_chat", {
    p_match_id: matchId,
  });

  if (error) {
    console.error("[useMatchChat] Error en join_match_chat:", error.message);
    return null;
  }

  if (!data) {
    console.error("[useMatchChat] join_match_chat devolvió vacío");
    return null;
  }

  console.log("[useMatchChat] room_id obtenido:", data);
  return data as string;
}

async function fetchMessages(roomId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, room_id, sender_id, content, created_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("[useMatchChat] Error fetchMessages:", error.message);
    return [];
  }
  return (data as ChatMessage[]) ?? [];
}

export function useMatchChat(matchId: string | null, userId: string | null) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!matchId || !userId) {
      console.log("[useMatchChat] Esperando matchId/userId:", { matchId, userId });
      return;
    }

    let isMounted = true;
    setLoading(true);

    (async () => {
      const rid = await getOrCreateMatchRoom(matchId);
      if (!isMounted) return;

      if (!rid) {
        console.error("[useMatchChat] No se pudo obtener roomId");
        setLoading(false);
        return;
      }

      setRoomId(rid);
      const msgs = await fetchMessages(rid);
      if (isMounted) {
        setMessages(msgs);
        setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [matchId, userId]);

  // Realtime: mensajes nuevos
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`match-chat-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const msg = payload.new as ChatMessage;
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
          );
        },
      )
      .subscribe((status) => {
        console.log("[useMatchChat] Realtime status:", status);
      });

    return () => { void supabase.removeChannel(channel); };
  }, [roomId]);

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!roomId || !userId || !content.trim()) return;
      const { error } = await supabase.from("messages").insert({
        room_id: roomId,
        sender_id: userId,
        content: content.trim(),
      });
      if (error) console.error("[useMatchChat] Error enviando mensaje:", error.message);
    },
    [roomId, userId],
  );

  return { messages, sendMessage, loading, roomId };
}
