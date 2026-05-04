import { useTranslation } from 'react-i18next';
import { Trophy, Gamepad2, Swords, Flame, Zap, Medal, Star } from 'lucide-react';


const IconMap: Record<string, any> = {
  Gamepad2,
  Swords,
  Flame,
  Zap,
  Trophy,
  Medal,
  Star
};

type AchievementEntry = {
  id: string | number;
  unlocked_at: string;
  achievement: {
    title: string | null;
    description: string | null;
    badge_icon: string | null; 
  }[];
};

export function AccountAchievementsSection({ userAchievements }: { userAchievements: AchievementEntry[] }) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
          <Trophy size={24} />
        </div>
        <h3 className="text-2xl font-bold text-white">{t('account.dashboard.achievements')}</h3>
      </div>

      {userAchievements && userAchievements.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {userAchievements.map((ua) => {
         
            const data = Array.isArray(ua.achievement) ? ua.achievement[0] : ua.achievement; 
            
        
            const badgeStr = data?.badge_icon || '';
            const isUrl = badgeStr.startsWith('http') || badgeStr.startsWith('/');
            const IconComponent = !isUrl && IconMap[badgeStr] ? IconMap[badgeStr] : null;

            return (
              <div key={ua.id} className="group relative bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:bg-slate-800 hover:border-indigo-500/50">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all overflow-hidden">
                  
                
                  {isUrl ? (
                    <img src={badgeStr} alt={data?.title || 'Logro'} className="w-full h-full object-cover" />
                  ) : IconComponent ? (
                    <IconComponent size={28} className="text-indigo-400" />
                  ) : (
                    <Trophy size={28} className="text-indigo-400" />
                  )}

                </div>
                <h4 className="text-white font-bold text-sm mb-1">{data?.title || 'Logro'}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{data?.description || 'Desbloqueado'}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed">
           <Trophy size={48} className="mx-auto text-slate-600 mb-3 opacity-20" />
           <p className="text-slate-500">Aún no has desbloqueado ningún logro.</p>
        </div>
      )}
    </section>
  );
}