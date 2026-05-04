import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../supabase";

export type ChatMessage = {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

async function addParticipantSafe(roomId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("chat_participants")
    .upsert(
      { room_id: roomId, user_id: userId },
      { onConflict: "room_id,user_id", ignoreDuplicates: true },
    );
  if (error) console.warn("[useMatchChat] addParticipant:", error.message);
}

async function getOrCreateMatchRoom(
  matchId: string,
  userId: string,
): Promise<string | null> {
  console.log("[useMatchChat] getOrCreateMatchRoom — matchId:", matchId, "userId:", userId);

  // 1. ¿Ya existe sala para este match?
  const { data: existing, error: selectError } = await supabase
    .from("match_chats")
    .select("room_id")
    .eq("match_id", matchId)
    .maybeSingle();

  if (selectError) {
    console.error("[useMatchChat] Error leyendo match_chats:", selectError.message);
    return null;
  }

  if (existing?.room_id) {
    console.log("[useMatchChat] Sala existente:", existing.room_id);
    await addParticipantSafe(existing.room_id, userId);
    return existing.room_id;
  }

  // 2. Crear chat_room marcada como sala de partida
  const { data: newRoom, error: roomError } = await supabase
    .from("chat_rooms")
    .insert({ is_group: true, is_match_room: true })
    .select("id")
    .single();

  if (roomError || !newRoom) {
    console.error("[useMatchChat] Error creando chat_room:", roomError?.message);
    return null;
  }
  console.log("[useMatchChat] chat_room creada:", newRoom.id);

  // 3. Vincular con el match
  const { error: linkError } = await supabase
    .from("match_chats")
    .insert({ match_id: matchId, room_id: newRoom.id });

  if (linkError) {
    console.warn("[useMatchChat] Error vinculando match_chats (posible carrera):", linkError.message);

    // Carrera: otro jugador ganó — usar su sala
    const { data: winner } = await supabase
      .from("match_chats")
      .select("room_id")
      .eq("match_id", matchId)
      .maybeSingle();

    if (winner?.room_id) {
      console.log("[useMatchChat] Usando sala del ganador de carrera:", winner.room_id);
      await addParticipantSafe(winner.room_id, userId);
      return winner.room_id;
    }
    return null;
  }

  console.log("[useMatchChat] match_chats vinculado OK");
  await addParticipantSafe(newRoom.id, userId);
  return newRoom.id;
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
      const rid = await getOrCreateMatchRoom(matchId, userId);
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
