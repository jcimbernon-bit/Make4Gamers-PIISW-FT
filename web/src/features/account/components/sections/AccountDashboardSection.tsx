import { useTranslation } from 'react-i18next';
import { Trophy, Star, ChevronRight, Save } from 'lucide-react';
import UserAvatar from '../../../../shared/components/UserAvatar';
import { 
  getTierForScore, 
  getGlobalTier, 
  calculateLazyGlobalScore,
  getGlobalProgress,
  getGameProgress,
  getGlobalControllerData, 
  getGameControllerData
} from '../../../progression/services/progression.service';

type ProfileSummary = {
  username: string | null;
  avatar_url: string | null;
  role?: string | null;
  location?: string | null;
  subscription_tier?: string | null;
};

type HighScoreEntry = {
  displayTitle: string;
  score: number;
};

type AccountDashboardSectionProps = {
  profile: ProfileSummary;
  highScores: HighScoreEntry[];
};



export function AccountDashboardSection({ profile, highScores }: AccountDashboardSectionProps) {
  const { t } = useTranslation();
  

  const globalScore = calculateLazyGlobalScore(highScores || []);
  const globalTier = getGlobalTier(globalScore);
  const globalEmblem = getGlobalControllerData(globalTier);
  const progress = getGlobalProgress(globalScore);

  return (
    <section className="space-y-6 w-full pb-8">


      <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-2xl w-full">
        
       
        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-slate-800/40 to-transparent pointer-events-none"></div>

  
        <div className="relative z-10 shrink-0">
          <div className="p-1.5 bg-slate-950/80 rounded-full border border-slate-700/50 shadow-inner">
            <UserAvatar src={profile.avatar_url} name={profile.username} size={88} />
          </div>
        </div>

      
        <div className="relative z-10 flex-1 text-center sm:text-left min-w-0 w-full flex flex-col items-center sm:items-start">
          
        
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 mb-3 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              {profile.role === 'admin' ? 'Administrador' : 'Jugador Oficial'}
            </span>
          </div>
          
        
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center sm:justify-start">
            <h3 className="text-white text-3xl font-black tracking-tight truncate">
              {profile.username || t('account.dashboard.defaultUser')}
            </h3>

            {profile.subscription_tier === 'premium' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20">
                <Save size={14} className="text-yellow-500 fill-yellow-500/20" />
                <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest hidden sm:inline-block">Premium</span>
              </div>
            )}
          </div>

         
          <p className="text-slate-500 text-sm mt-1.5 font-medium">
            {profile.location ? profile.location : 'Miembro de la comunidad'}
          </p>
        </div>
      </div>
      
      <div className="relative w-full overflow-hidden bg-slate-950 border border-slate-700/50 rounded-[2.5rem] p-5 sm:p-8 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e515_1px,transparent_1px),linear-gradient(to_bottom,#4f46e515_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-[80px]"></div>
        <div className={`absolute bottom-0 left-10 w-64 h-64 ${globalEmblem.color} opacity-20 blur-[60px] rounded-full bg-current`}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full min-w-0">
          
          <div className="relative group shrink-0">
            <div className={`absolute inset-0 blur-[40px] opacity-40 bg-current ${globalEmblem.color}`}></div>
            <img 
              src={globalEmblem.image} 
              alt={globalEmblem.name} 
              className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            />
          </div>

          <div className="text-center md:text-left space-y-4 flex-1 min-w-0 w-full overflow-hidden">
            <div>
               <span className="inline-block px-3 sm:px-4 py-1.5 bg-slate-900/80 text-slate-300 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] border border-slate-700 backdrop-blur-sm">
                 Rango de Plataforma
               </span>
               <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter ${globalEmblem.color} italic break-all md:break-words w-full mt-2`}>
                 {globalEmblem.name}
               </h2>
               <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                 <Star className="text-yellow-500 shrink-0" size={20} fill="currentColor" />
                 <p className="text-white text-lg sm:text-xl font-bold truncate">
                   {globalScore} <span className="text-slate-400 text-xs sm:text-sm font-normal">Puntos Globales</span>
                 </p>
               </div>
            </div>

            <p className="text-slate-400 text-sm max-w-lg mx-auto md:mx-0">
               Juega a más juegos y mejora tus récords para subir tu Rango Global. ¡Cada punto cuenta para desbloquear el siguiente mando!
            </p>

            <div className="max-w-md mx-auto md:mx-0 w-full bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-inner mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                   {progress.isMaxLevel ? (
                     <Trophy size={12} className="text-fuchsia-400" />
                   ) : (
                     <ChevronRight size={12} className={globalEmblem.color} />
                   )}
                  {progress.isMaxLevel ? 'Nivel Máximo Alcanzado' : `Siguiente: ${progress.nextTierName}`}
                </span>
                {!progress.isMaxLevel && (
                  <span className="text-[10px] font-bold text-white bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    Faltan {progress.pointsNeeded} pts
                  </span>
                )}
              </div>

              {/* Contenedor de la barra */}
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 relative shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]">
     
                 <div 
                   className={`h-full rounded-full transition-all duration-1000 ease-out ${globalEmblem.bgClass} ${globalEmblem.glowClass}`}
                   style={{ width: `${progress.percentage}%` }}
                 ></div>
              </div>
              
              <div className="flex justify-between items-center mt-2 text-[10px]">
                <span className={`font-bold ${globalEmblem.color}`}>{globalEmblem.name}</span>
                {!progress.isMaxLevel && (
                  <span className="font-bold text-slate-500">
                     Siguiente rango a los {progress.nextTierThreshold} pts
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>



      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0"><Trophy size={24} /></div>
          <h3 className="text-xl font-bold text-white truncate">Récords por Juego</h3>
        </div>

        {highScores && highScores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        
            {highScores.map((record, index) => {
              const tier = getTierForScore(record.displayTitle, record.score);
              const consoleEmblem = getGameControllerData(tier);
              
             
              const progress = getGameProgress(record.displayTitle, record.score);

              return (
             
                <div key={index} className="group relative bg-slate-900 border border-slate-700/50 rounded-2xl p-4 flex flex-col hover:border-indigo-500/50 transition-colors overflow-hidden h-full">
                  
                 
                  <div className="flex justify-between items-start mb-2 flex-shrink-0">
                    <span className="font-bold text-white group-hover:text-indigo-400 truncate">{record.displayTitle}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-950/50 rounded-lg ${consoleEmblem.color}`}>{consoleEmblem.name}</span>
                  </div>

         
                  <div className="relative w-full h-24 flex items-center justify-center mb-4 mt-2 flex-shrink-0">
                    <div className={`absolute w-20 h-20 rounded-full blur-[40px] opacity-20 ${consoleEmblem.glow} bg-current ${consoleEmblem.color}`}></div>
                    <img src={consoleEmblem.image} className="relative z-10 h-full object-contain group-hover:scale-110 transition-all duration-500" alt="rank" />
                  </div>

           
                  <div className="text-center w-full mb-5 flex-shrink-0">
                    <span className="text-3xl font-black text-white tracking-tighter">{record.score}</span>
                    <span className="text-indigo-400 text-xs font-bold uppercase ml-1">PTS</span>
                  </div>

                
                  <div className="mt-auto pt-3 border-t border-slate-800/50 w-full flex-shrink-0">
                    <div className="flex justify-between items-end mb-1.5 overflow-visible">
                      <span className="text-[10px] text-slate-400 font-medium tracking-wider whitespace-nowrap">
                        {progress.nextTierName === 'MAX' ? 'NIVEL MÁXIMO' : `HACIA ${progress.nextTierName}`}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">
                        {progress.pointsNeeded > 0 ? `${progress.pointsNeeded} pts rest.` : 'MAX'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner border border-slate-800">
                      <div 
                        className={`h-full rounded-full ${consoleEmblem.bgClass} transition-all duration-1000 ease-out`}
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                </div>
              );
            })}
           
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/30 border-dashed">
            <Trophy size={48} className="mx-auto text-slate-600 mb-3 opacity-50" />
            <p className="text-slate-400">Aún no tienes récords. ¡Juega para subir tu Nivel Global!</p>
          </div>
        )}
      </div>
    </section>
  );
}