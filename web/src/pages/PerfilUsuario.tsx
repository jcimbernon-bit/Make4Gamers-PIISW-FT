import { useState, useEffect } from 'react';

import { 
  getGlobalTier, 
  calculateLazyGlobalScore,
  getGameControllerData,
  getGlobalControllerData 
} from '../features/progression/services/progression.service';
import GlobalRankEmblem from '../features/progression/components/GlobalRankEmblem';
import { getTierForScore } from '../features/progression/services/progression.service';
import { supabase } from '../supabase';
import { removeFriend } from '../features/chat/services/friend.service';
import { useParams, Link, useNavigate } from 'react-router-dom'; 

import { User as UserIcon, Activity, ArrowLeft, Trophy, Calendar, Gamepad2, Check, AlertCircle, AlertTriangle, Medal, Flag, Swords, Flame, Zap, Star, Save } from 'lucide-react';
import UserAvatar from '../shared/components/UserAvatar';
import { getAccountHighScores } from '../features/account/services/account.service';
import { reportUser } from '../../../packages/api/src/services/reports.service';
import { type Tier } from '../features/progression/config/progression.config';
import { getUserAchievements, 
  checkMatchCountAchievements, checkScoreAchievements, checkSocialAchievements } from '../features/achievements/services/achievements.service';

const IconMap: Record<string, any> = {
  Gamepad2,
  Swords,
  Flame,
  Zap,
  Trophy,
  Medal,
  Star
}; 


const getControllerData = (tier: string) => {
  const basePath = '/assets/emblems';
  
  switch(tier) {
    case 'Iniciado': 
      return { name: 'Rango Iniciado', image: `${basePath}/nintendoEmblem.png`, color: 'text-slate-400', glow: 'shadow-slate-500/40' };
    case 'Amateur': 
      return { name: 'Rango Amateur', image: `${basePath}/ps1Emblem.png`, color: 'text-orange-400', glow: 'shadow-orange-500/40' };
    case 'Profesional': 
      return { name: 'Rango Profesional', image: `${basePath}/ps3Emblem.png`, color: 'text-slate-200', glow: 'shadow-slate-300/50' };
    case 'Veterano': 
      return { name: 'Rango Veterano', image: `${basePath}/ps4Emblem.png`, color: 'text-yellow-400', glow: 'shadow-yellow-500/50' };
    case 'Elite': 
      return { name: 'Rango Élite', image: `${basePath}/ps5Emblem.png`, color: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/60' };
    default: 
      return { name: 'Iniciado', image: `${basePath}/nintendoEmblem.png`, color: 'text-slate-500', glow: 'shadow-slate-500/20' };
  }
};
export default function PerfilUsuario() {
  const { username } = useParams(); 
  const [profile, setProfile] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [highScores, setHighScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const navigate = useNavigate();
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const globalScore = calculateLazyGlobalScore(highScores || []);
  const globalTier = getGlobalTier(globalScore);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportFeedback, setReportFeedback] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [testScore, setTestScore] = useState(globalScore);
 

useEffect(() => {
    const fetchProfileAndActivity = async () => {
      try {
       
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

       
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
        }

       
        if (profileData) {
          
         
          const { data: activityData, error: activityError } = await supabase
            .from('scores')
            .select(`
              id,
              score,
              created_at,
              game:games(title)
            `)
            .eq('user_id', profileData.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (!activityError && activityData) {
            setRecentActivity(activityData);
          }

         
          await checkMatchCountAchievements(profileData.id);
          await checkScoreAchievements(profileData.id);
          await checkSocialAchievements(profileData.id);
          const achievementsData = await getUserAchievements(profileData.id);
          setUserAchievements(achievementsData);

       
          const scores = await getAccountHighScores(profileData.id);
          setHighScores(scores);
        }

      } catch (error) {
        console.error("Error cargando el perfil público:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileAndActivity();
    }
  }, [username]);
 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  if (loading) {
    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <UserIcon size={64} className="opacity-20" />
        <h2 className="text-2xl font-bold text-white">Usuario no encontrado</h2>
        <p>El jugador que buscas no existe o ha cambiado de nombre.</p>
        <Link to="/cuenta" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mt-4">
          <ArrowLeft size={16} /> Volver a mi cuenta
        </Link>
      </div>
    );
  }


  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

const executeRemoveFriend = async () => {
    if (!currentUserId || !profile?.id) return;
    
    setDeleteErrorMsg('');
    try {
        const success = await removeFriend(currentUserId, profile.id);
        if (success) {
            setShowDeleteModal(false);
            setDeleteSuccessMsg("Amigo eliminado correctamente");
     
            setTimeout(() => {
                setDeleteSuccessMsg('');
            }, 3000);
            
        } else {
            setDeleteErrorMsg("Hubo un error al eliminar al amigo");
            setShowDeleteModal(false);
        }
    } catch (error) {
        setDeleteErrorMsg("Error de conexión al eliminar.");
        setShowDeleteModal(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportReason) {
      setReportFeedback({ type: 'error', text: 'Por favor, selecciona un motivo.' });
      return;
    }
    if (!currentUserId || !profile?.id) return;

    setIsSubmittingReport(true);
    setReportFeedback(null);

    const result = await reportUser(supabase, currentUserId, profile.id, reportReason, reportDetails);

    setIsSubmittingReport(false);

    if (result.success) {
      setReportFeedback({ type: 'success', text: 'Reporte enviado. Gracias por ayudar a mantener la comunidad segura.' });
   
      setTimeout(() => {
        setShowReportModal(false);
        setReportFeedback(null);
        setReportReason('');
        setReportDetails('');
      }, 3000);
    } else {
      setReportFeedback({ type: 'error', text: result.error || 'Error al enviar el reporte.' });
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        
        {/* Boton volver */}
        <Link to="/cuenta" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Volver a mis amigos
        </Link>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <GlobalRankEmblem score={globalScore} size="xl">
          
                <UserAvatar src={profile?.avatar_url} name={profile?.username} className="w-full h-full" size={128}/>
              </GlobalRankEmblem>
            </div>
 
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                    <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                    
                    {/* Emblema Premium */}
                    {profile?.subscription_tier === 'premium' && (
                      <span title="Usuario Premium" className="flex items-center cursor-help mt-1">
                        <Save 
                          size={22} 
                          className="text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" 
                        />
                      </span>
                    )}
                  </div>
               
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2">
      
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm ${getGlobalControllerData(globalTier).color} border-current bg-slate-800/50`}>
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-black uppercase tracking-widest">
                          Rango {globalTier}
                        </span>
                    </div>
                    
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-tighter">
                      {globalScore} Puntos de Plataforma
                    </div>
                  </div>
                  
                  
               
                  {currentUserId && currentUserId !== profile?.id && (
                    <button 
                      onClick={() => setShowReportModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-2"
                    >
                      <Flag size={16} />
                      Reportar jugador
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                  {/* Botón de Eliminar Amigo */}
                  {currentUserId && profile?.id && currentUserId !== profile.id && (
                    <button 
                      onClick={handleOpenDeleteModal}
                      disabled={!!deleteSuccessMsg} 
                      className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors border border-red-500/20 disabled:opacity-50"
                    >
                      <UserIcon size={18} />
                      Eliminar amigo
                    </button>
                  )}
                </div>
              </div>

              {/* Mensajes de éxito/error */}
              {deleteSuccessMsg && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                  <Check size={18} />
                  {deleteSuccessMsg}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400 mt-6">
                <span className="flex items-center gap-1.5">
                  <Activity size={16} /> 
                  Estado: <span className="text-green-400">{profile.status || 'Disponible'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} /> 
                  Miembro desde: {new Date(profile.created_at).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>


  
        {highScores.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Trophy className="text-yellow-500" size={24} />
              Récords de Temporada
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {highScores.map((record, index) => {
      
                const tierName = getTierForScore(record.displayTitle, record.score);
                const controller = getGameControllerData(tierName);

                return (
                  <div 
                    key={`record-${index}`} 
                    className="group relative bg-gradient-to-b from-slate-800/40 to-slate-900/90 border border-slate-700/50 rounded-3xl p-1 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)]"
                  >
                    <div className="bg-slate-900/40 rounded-[22px] p-6 h-full flex flex-col items-center">
                      
                      {/* Cabecera de la carta */}
                      <div className="w-full flex justify-between items-center mb-4">
                        <span className="px-2 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          TOP {index + 1}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${controller.color}`}>
                          {controller.name}
                        </span>
                      </div>

                     
                      <div className="relative w-full h-40 flex items-center justify-center mb-6">
                   
                        <div className={`absolute w-24 h-24 rounded-full blur-[40px] opacity-20 ${controller.glow} bg-current ${controller.color}`}></div>
                        
                        <img 
                          src={controller.image} 
                          alt={controller.name}
                          className="relative z-10 h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500"
                        />
                      </div>

                      {/* Info de puntuación */}
                      <div className="text-center w-full mt-auto">
                        <h4 className="text-slate-400 text-xs font-medium mb-1 truncate px-2">
                          {record.displayTitle}
                        </h4>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-black text-white tracking-tighter">
                            {record.score}
                          </span>
                          <span className="text-indigo-400 text-xs font-bold uppercase">PTS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

             
<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6 shadow-xl">
  <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
    <Medal className="text-amber-400" size={24} />
    <h3 className="text-xl font-bold text-white">Emblemas Obtenidos</h3>
    <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full ml-auto">
      {userAchievements.length}
    </span>
  </div>

  {userAchievements.length === 0 ? (
    <p className="text-slate-500 text-sm text-center py-6">
      Aún no ha conseguido ningún emblema. ¡A jugar!
    </p>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {userAchievements.map((item) => {
        
        
        let badgeData = item.achievement || item.achievements || item;
        
        
        if (Array.isArray(badgeData)) {
          badgeData = badgeData[0];
        }
       
        
        const IconComponent = IconMap[badgeData?.badge_icon] || Star;
        
        return (
          <div 
            key={item.id} 
            className="flex flex-col items-center justify-center bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl p-4 transition-all group"
            title={badgeData?.description}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <IconComponent size={28} />
            </div>
            <h4 className="text-white font-bold text-sm text-center mb-1">
              {badgeData?.title || 'Emblema'}
            </h4>
            <p className="text-slate-400 text-[10px] text-center line-clamp-2">
              {badgeData?.description}
            </p>
          </div>
        );
      })}
    </div>
  )}
</div>
      

        {/* Actividad reciente */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Gamepad2 className="text-indigo-400" /> Actividad Reciente
          </h3>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 border border-slate-800 border-dashed rounded-xl bg-slate-800/20">
              <p className="text-slate-500">Este usuario aún no ha jugado ninguna partida.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Jugó a <span className="text-indigo-400">{activity.game?.title || 'Juego Desconocido'}</span>
                      </p>
                      <p className="text-sm text-slate-400">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{activity.score}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Puntos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>


      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">¿Eliminar amigo?</h3>
              <p className="text-slate-400 text-sm">
                Estás a punto de eliminar a <span className="text-indigo-400 font-medium">{profile?.username}</span> de tus amigos. Esta acción no se puede deshacer.
              </p>
              
              <div className="flex gap-3 w-full pt-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executeRemoveFriend}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    {/* Modal de Reporte */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <Flag size={24} />
              <h3 className="text-xl font-bold text-white">Reportar a {profile?.username}</h3>
            </div>
            
            <p className="text-slate-400 text-sm mb-4">
              Ayúdanos a entender qué está pasando. Los reportes son anónimos.
            </p>

            {reportFeedback && (
              <div className={`p-3 rounded-lg mb-4 text-sm ${reportFeedback.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {reportFeedback.text}
              </div>
            )}

            {!reportFeedback || reportFeedback.type === 'error' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Motivo del reporte *</label>
                  <select 
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Selecciona un motivo...</option>
                    <option value="Trampas / Hacks">Trampas / Uso de Hacks</option>
                    <option value="Lenguaje Tóxico">Lenguaje Tóxico u Ofensivo</option>
                    <option value="Acoso">Acoso a otros jugadores</option>
                    <option value="Nombre Inapropiado">Nombre o Avatar inapropiado</option>
                    <option value="Spam">Spam / Publicidad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Detalles adicionales (Opcional)</label>
                  <textarea 
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe brevemente lo ocurrido..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  />
                </div>

                <div className="flex gap-3 w-full pt-4">
                  <button 
                    onClick={() => {
                      setShowReportModal(false);
                      setReportFeedback(null);
                    }}
                    disabled={isSubmittingReport}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSubmitReport}
                    disabled={isSubmittingReport}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingReport ? 'Enviando...' : 'Enviar Reporte'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      
    </div>


  );
}