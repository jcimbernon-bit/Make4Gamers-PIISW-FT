
import { supabase } from '../../../supabase';
import type { ChatProfile } from '../types/chat.types';

export const getFriendsList = async (currentUserId: string): Promise<ChatProfile[]> => {
    
  
    const { data: friendships } = await supabase
        .from('friendships')
        .select('user_a, user_b')
        .eq('status', 'accepted')
        .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`);

    const activeFriendIds = friendships?.map(f => f.user_a === currentUserId ? f.user_b : f.user_a) ?? [];
   

    const { data: participations } = await supabase
        .from('chat_participants')
        .select('room_id')
        .eq('user_id', currentUserId);

    const allRoomIds = participations?.map(p => p.room_id) ?? [];
    if (!allRoomIds.length) return [];

    const { data: rooms } = await supabase
        .from('chat_rooms')
        .select('id, is_group')
        .in('id', allRoomIds)
        .eq('is_match_room', false);

    if (!rooms?.length) return [];

    const oneToOneIds = rooms.filter(r => !r.is_group).map(r => r.id);
    const groupIds = rooms.filter(r => r.is_group).map(r => r.id);

    const profiles: ChatProfile[] = [];


    if (oneToOneIds.length > 0 && activeFriendIds.length > 0) {
        const { data: others } = await supabase
            .from('chat_participants')
            .select('room_id, user_id')
            .in('room_id', oneToOneIds)
            .neq('user_id', currentUserId)
            .in('user_id', activeFriendIds);

        const otherUserIds = [...new Set(others?.map(p => p.user_id) ?? [])];

        if (otherUserIds.length > 0) {
            const { data: userProfiles } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, status, subscription_tier')
                .in('id', otherUserIds);

            const roomToUser = new Map(others?.map(p => [p.room_id, p.user_id]) ?? []);
            const userMap = new Map(userProfiles?.map(p => [p.id, p]) ?? []);

            for (const roomId of oneToOneIds) {
                const userId = roomToUser.get(roomId);
                if (!userId) continue;
                const profile = userMap.get(userId);
                if (!profile) continue;

                if (!profiles.some(p => p.id === profile.id)) {
                    profiles.push({
                        id: profile.id,
                        room_id: roomId,
                        username: profile.username || 'Usuario',
                        avatar_url: profile.avatar_url,
                        status: profile.status || 'Disponible',
                        subscription_tier: profile.subscription_tier,
                        is_group: false
                    });
                }
            }
        }
    }
    
   
    if (groupIds.length > 0) {
        const { data: allParticipants } = await supabase
            .from('chat_participants')
            .select('room_id, profiles(username)')
            .in('room_id', groupIds);

        const roomMap = new Map<string, string[]>();
        allParticipants?.forEach(p => {
            if (!roomMap.has(p.room_id)) roomMap.set(p.room_id, []);
            // @ts-ignore - Supabase devuelve profiles anidado
            if (p.profiles?.username) roomMap.get(p.room_id)?.push(p.profiles.username);
        });

        for (const roomId of groupIds) {
            const members = roomMap.get(roomId) || [];
            const title = `Grupo (${members.length}): ${members.join(', ')}`;
            profiles.push({
                id: roomId,
                room_id: roomId,
                username: title.length > 25 ? title.substring(0, 22) + '...' : title,
                avatar_url: null,
                status: 'Grupo',
                is_group: true
            });
        }
    }

    return profiles;
};

export const getOrCreateChatRoom = async (myId: string, friendId: string): Promise<string | null> => {

  const { data: myParticipations, error: myRoomsError } = await supabase
    .from('chat_participants')
    .select('room_id')
    .eq('user_id', myId);

  if (myRoomsError || !myParticipations) return null;

  const allMyRoomIds = myParticipations.map(r => r.room_id);


  let myRoomIds: string[] = [];
  if (allMyRoomIds.length > 0) {
    const { data: normalRooms } = await supabase
      .from('chat_rooms')
      .select('id')
      .in('id', allMyRoomIds)
      .eq('is_group', false);
    myRoomIds = normalRooms?.map(r => r.id) ?? [];
  }

  if (myRoomIds.length > 0) {
   
    const { data: sharedRooms } = await supabase
      .from('chat_participants')
      .select('room_id')
      .in('room_id', myRoomIds)
      .eq('user_id', friendId)
      .limit(1);

    if (sharedRooms && sharedRooms.length > 0) {
      return sharedRooms[0].room_id;
    }
  }


  const { data: newRoom, error: roomError } = await supabase
    .from('chat_rooms')
    .insert([{ is_group: false }])
    .select('id')
    .single();

  if (roomError || !newRoom) return null;

 
  await supabase.from('chat_participants').insert([
    { room_id: newRoom.id, user_id: myId },
    { room_id: newRoom.id, user_id: friendId }
  ]);

  return newRoom.id;
};

export const sendMessage = async (roomId: string, currentUserId: string, content: string) => {
    const { error } = await supabase
        .from('messages')
        .insert({
            room_id: roomId,
            sender_id: currentUserId, 
            content: content
        });

    if (error) {
        console.error("Error enviando mensaje:", error);
        throw error;
    }
};


export const updateUserStatus = async (userId: string, newStatus: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (err) {
        console.error("Error actualizando estado:", err);
        return false;
    }
};

export const markMessagesAsRead = async (roomId: string, currentUserId: string) => {
    const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('room_id', roomId)
        .neq('sender_id', currentUserId) 
        .eq('is_read', false); 

    if (error) {
        console.error("Error marcando mensajes como leídos:", error);
    }
};

export const createGroupChat = async (currentUserId: string, participantIds: string[], groupName: string): Promise<string | null> => {
    try {
        
        const { data: newRoom, error: roomError } = await supabase
            .from('chat_rooms')
            .insert([{ is_group: true }])
            .select('id')
            .single();

        if (roomError || !newRoom) throw roomError;

        
        const participants = [currentUserId, ...participantIds].map(id => ({
            room_id: newRoom.id,
            user_id: id
        }));

        const { error: partError } = await supabase
            .from('chat_participants')
            .insert(participants);

        if (partError) throw partError;

        return newRoom.id;

    } catch (error) {
        console.error("Error creando grupo:", error);
        return null;
    }
};