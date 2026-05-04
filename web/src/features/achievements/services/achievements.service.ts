import { supabase } from "../../../supabase";
import { getAccountFriends } from '../../account/services/account.service';

export async function checkMatchCountAchievements(userId: string) {
  try {
  
    const { count, error: countError } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('player_1', userId); 

    if (countError || count === null) throw countError;

    const rules = {
      'match_1': 1,
      'match_50': 50,
      'match_100': 100
    };

    const earnedCodes = Object.entries(rules)
      .filter(([_, requiredCount]) => count >= requiredCount)
      .map(([code]) => code);

    if (earnedCodes.length === 0) return;

    const { data: achievements } = await supabase
      .from('achievements')
      .select('id, code')
      .in('code', earnedCodes);

    if (!achievements) return;

    const achievementsToInsert = achievements.map(ach => ({
      user_id: userId,
      achievement_id: ach.id,
      source: 'match_count_evaluator'
    }));

    await supabase
      .from('user_achievements')
      .upsert(achievementsToInsert, { onConflict: 'user_id, achievement_id' });

    console.log(`Evaluación de logros completada. Partidas jugadas: ${count}`);
    
  } catch (error) {
    console.error("Error evaluando logros de partidas:", error);
  }
}


export async function getUserAchievements(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        id,
        unlocked_at,
        achievement_id,
        achievement:achievements (
          title,
          description,
          badge_icon
        )
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;

    const rows = (data || []) as Array<{
      id: string | number;
      unlocked_at: string;
      achievement_id?: string | null;
      achievement?:
        | { title?: string | null; description?: string | null; badge_icon?: string | null }
        | Array<{ title?: string | null; description?: string | null; badge_icon?: string | null }>
        | null;
    }>;

    const normalized = rows.map((row) => {
      const achievementValue = Array.isArray(row.achievement) ? row.achievement[0] : row.achievement;
      return {
        id: row.id,
        unlocked_at: row.unlocked_at,
        achievement_id: row.achievement_id ?? null,
        achievement: achievementValue
          ? [
              {
                title: achievementValue.title ?? null,
                description: achievementValue.description ?? null,
                badge_icon: achievementValue.badge_icon ?? null,
              },
            ]
          : [],
      };
    });

    const missingAchievementIds = normalized
      .filter((row) => row.achievement.length === 0 && row.achievement_id)
      .map((row) => row.achievement_id as string);

    if (missingAchievementIds.length === 0) {
      return normalized;
    }

    const { data: achievementRows, error: achievementsError } = await supabase
      .from('achievements')
      .select('id, title, description, badge_icon')
      .in('id', missingAchievementIds);

    if (achievementsError || !achievementRows) {
      return normalized;
    }

    const achievementById = new Map(
      achievementRows.map((achievement) => [achievement.id, achievement]),
    );

    return normalized.map((row) => {
      if (row.achievement.length > 0 || !row.achievement_id) {
        return row;
      }

      const fallbackAchievement = achievementById.get(row.achievement_id);

      if (!fallbackAchievement) {
        return row;
      }

      return {
        ...row,
        achievement: [
          {
            title: fallbackAchievement.title,
            description: fallbackAchievement.description,
            badge_icon: fallbackAchievement.badge_icon,
          },
        ],
      };
    });
  } catch (error) {
    console.error("Error obteniendo logros del usuario:", error);
    return [];
  }
}

export async function checkScoreAchievements(userId: string) {
  try {
   
    const { data, error } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', userId)
      .order('score', { ascending: false }) 
      .limit(1); 

    if (error) throw error;
    if (!data || data.length === 0) return; 

    const highestScore = data[0].score;

   
    const rules = {
      'score_1000': 1000,
      'score_5000': 5000,
      'score_10000': 10000
    };

   
    const earnedCodes = Object.entries(rules)
      .filter(([_, requiredScore]) => highestScore >= requiredScore)
      .map(([code]) => code);

    if (earnedCodes.length === 0) return;

    
    const { data: achievements } = await supabase
      .from('achievements')
      .select('id, code')
      .in('code', earnedCodes);

    if (!achievements) return;

   
    const achievementsToInsert = achievements.map(ach => ({
      user_id: userId,
      achievement_id: ach.id,
      source: 'score_evaluator'
    }));

    await supabase
      .from('user_achievements')
      .upsert(achievementsToInsert, { onConflict: 'user_id, achievement_id' });

    console.log(`Evaluación de puntos completada. Récord máximo: ${highestScore}`);
    
  } catch (error) {
    console.error("Error evaluando logros de puntuación:", error);
  }
}

export async function checkSocialAchievements(userId: string) {
  try {
    
    const friendsList = await getAccountFriends(userId);
    const friendsCount = friendsList ? friendsList.length : 0;

    if (friendsCount === 0) return; 

   
    const rules = {
      'friend_1': 1,
      'friend_10': 10
    };

   
    const earnedCodes = Object.entries(rules)
      .filter(([_, requiredCount]) => friendsCount >= requiredCount)
      .map(([code]) => code);

    if (earnedCodes.length === 0) return;

  
    const { data: achievements } = await supabase
      .from('achievements')
      .select('id, code')
      .in('code', earnedCodes);

    if (!achievements) return;

    
    const achievementsToInsert = achievements.map(ach => ({
      user_id: userId,
      achievement_id: ach.id,
      source: 'social_evaluator'
    }));

    await supabase
      .from('user_achievements')
      .upsert(achievementsToInsert, { onConflict: 'user_id, achievement_id' });

    console.log(`Evaluación social completada. Amigos totales: ${friendsCount}`);
    
  } catch (error) {
    console.error("Error evaluando logros sociales:", error);
  }
}
