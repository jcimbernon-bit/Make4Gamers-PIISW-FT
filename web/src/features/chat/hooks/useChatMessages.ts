import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import type { Message } from '../types/chat.types';
import { markMessagesAsRead } from '../services/chat.service';

export function useChatMessages(roomId: string | null, currentUserId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId || !currentUserId) return;

        const fetchMessages = async () => {
            // ✨ CAMBIO: Seleccionamos '*' y también los datos del perfil relacionado
            const { data, error } = await supabase
                .from('messages')
                .select('*, profiles(username, avatar_url)')
                .eq('room_id', roomId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error("Error cargando historial:", error);
            } else {
                setMessages(data as Message[]);
                await markMessagesAsRead(roomId, currentUserId);
            }
            setLoading(false);
        };

        fetchMessages();

        const channel = supabase.channel(`room_${roomId}`)
            .on('postgres_changes', {
                event: 'INSERT', // Solo nos interesa el INSERT para nuevos mensajes
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${roomId}`
            }, async (payload) => {
                const newMessage = payload.new as Message;
                
                // ✨ CAMBIO: Como Realtime no trae el join automáticamente, 
                // hacemos una pequeña consulta para obtener el nombre del emisor
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('username, avatar_url')
                    .eq('id', newMessage.sender_id)
                    .single();

                const messageWithProfile = {
                    ...newMessage,
                    profiles: profileData || { username: 'Usuario', avatar_url: null }
                };

                setMessages((prev) => [...prev, messageWithProfile]);
                
                if (newMessage.sender_id !== currentUserId) {
                    markMessagesAsRead(roomId, currentUserId);
                }
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
                const partialUpdate = payload.new;
                setMessages((prev) => prev.map(msg =>
                    msg.id === partialUpdate.id ? { ...msg, ...partialUpdate } : msg
                ));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, currentUserId]);

    return { messages, loading };
}