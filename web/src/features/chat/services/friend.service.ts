import { supabase } from '../../../supabase';
import type { ChatProfile } from '../types/chat.types';


export const searchUsers = async (currentUserId: string, searchTerm: string): Promise<ChatProfile[]> => {
    if (!searchTerm.trim()) return [];

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url') 
        .neq('id', currentUserId)
        .ilike('username', `%${searchTerm}%`)
        .limit(10);

    if (error) {
        console.error("Error buscando usuarios:", error);
        return [];
    }

  
    return (data || []).map(profile => ({
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
        status: 'Disponible' 
    }));
};


export const addFriend = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    try {
      
        const { data: existing, error: checkError } = await supabase
            .from('friendships')
            .select('id')
            .or(`and(user_a.eq.${currentUserId},user_b.eq.${targetUserId}),and(user_a.eq.${targetUserId},user_b.eq.${currentUserId})`);

        if (checkError) throw checkError;

        if (existing && existing.length > 0) {
            console.log("Ya hay una relación o solicitud con este usuario.");
            return true; 
        }

        
        const { error: friendError } = await supabase
            .from('friendships')
            .insert({
                user_a: currentUserId,
                user_b: targetUserId,
                status: 'pending' 
            });

        if (friendError) throw friendError;

      

        return true;

    } catch (err) {
        console.error("Error al enviar solicitud de amistad:", err);
        return false;
    }
};
export const removeFriend = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    try {
        
        await supabase.from('friendships').delete().eq('user_a', currentUserId).eq('user_b', targetUserId);
        await supabase.from('friendships').delete().eq('user_a', targetUserId).eq('user_b', currentUserId);

   
        const { data: myRooms } = await supabase.from('chat_participants').select('room_id').eq('user_id', currentUserId);
        const myRoomIds = myRooms?.map(r => r.room_id) || [];

        if (myRoomIds.length > 0) {
            const { data: sharedRooms } = await supabase.from('chat_participants').select('room_id').in('room_id', myRoomIds).eq('user_id', targetUserId);
            const sharedRoomIds = sharedRooms?.map(r => r.room_id) || [];

            if (sharedRoomIds.length > 0) {

                const { data: directRooms } = await supabase.from('chat_rooms').select('id').in('id', sharedRoomIds).eq('is_group', false).eq('is_match_room', false);
                const directRoomIds = directRooms?.map(r => r.id) || [];

                if (directRoomIds.length > 0) {
               
                    const { error: exitError } = await supabase.from('chat_participants').delete().in('room_id', directRoomIds).eq('user_id', currentUserId);
                    
                    if (exitError) console.error("Error al salir de la sala:", exitError);
                }
            }
        }
        return true;
    } catch (err) {
        console.error("Error al eliminar amigo:", err);
        return false;
    }
};


