
import { useState, useRef, useEffect } from 'react';
import { Send, Check, CheckCheck, Save } from 'lucide-react';
import { useChatMessages } from '../hooks/useChatMessages';
import { sendMessage } from '../services/chat.service';
import type { ChatProfile } from '../types/chat.types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useChatFilter } from '../hooks/useChatFilter';
import UserAvatar from '../../../shared/components/UserAvatar';

interface ChatAreaProps {
  roomId: string;
  currentUserId: string;
  friendProfile: ChatProfile;
}

export default function ChatArea({ roomId, currentUserId, friendProfile }: ChatAreaProps) {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { censorMessage } = useChatFilter();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading } = useChatMessages(roomId, currentUserId);


  useEffect(() => {
    if (chatContainerRef.current) {
    
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      //Aplicacion del filtro
      const mensajeSeguro = censorMessage(newMessage.trim());
      
      await sendMessage(roomId, currentUserId, mensajeSeguro);
      
      setNewMessage(''); 
    
      setTimeout(() => inputRef.current?.focus(), 10);
    } catch (error) {
      console.error('Error al enviar el mensaje', error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900/50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner">
      {/* Cabecera del chat */}
      <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/50 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          
          {/* Imagen de perfil (Avatar) */}
          <UserAvatar 
            src={friendProfile.avatar_url} 
            size={36}
          />

          <div className="flex flex-col">
            {/* Nombre e Insignia Premium en la misma línea */}
            <div className="flex items-center gap-1.5">
              <Link 
                to={`/usuario/${friendProfile.username}`}
                className="font-semibold text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer"
                title={`Ver perfil de ${friendProfile.username}`}
              >
                {friendProfile.username}
              </Link>
              
              {friendProfile.subscription_tier === 'premium' && (
                <span title="Usuario Premium" className="flex items-center cursor-help">
                  <Save size={14} className="text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                </span>
              )}
            </div>

            <span className={`text-xs flex items-center gap-1.5 mt-0.5 ${
              friendProfile.status === 'Ocupado' ? 'text-red-400' :
              friendProfile.status === 'Ausente' ? 'text-yellow-400' :
              friendProfile.status === 'Invisible' ? 'text-slate-400' :
              'text-green-400' 
            }`}>
              <span className={`w-2 h-2 rounded-full inline-block ${
                friendProfile.status === 'Ocupado' ? 'bg-red-500' :
                friendProfile.status === 'Ausente' ? 'bg-yellow-500' :
                friendProfile.status === 'Invisible' ? 'bg-slate-500' :
                'bg-green-500'
              }`}></span> 
              {friendProfile.status === 'Invisible' ? t('chat.status.disconnected') : 
               friendProfile.status === 'Ocupado' ? t('chat.status.busy') : 
               friendProfile.status === 'Ausente' ? t('chat.status.away') : 
               t('chat.status.online')}
            </span>
          </div>
        </div>
      </div>
      {/* Lista de Mensajes */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              const timeString = new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  
                  {!isMine && friendProfile.is_group && (
                    <span className="text-[10px] font-bold text-indigo-400 mb-1 ml-2 uppercase tracking-wider">
                      {msg.profiles?.username || 'Usuario'}
                    </span>
                  )}
                  
                  <div className={`px-4 py-2.5 max-w-[75%] rounded-2xl shadow-sm ${
                      isMine 
                        ? "bg-indigo-600 text-white rounded-br-sm" 
                        : "bg-slate-700 text-slate-100 rounded-bl-sm"
                    }`}
                  >
                    <p className="break-words leading-relaxed">{msg.content}</p>
                  </div>

                  <div className="flex items-center gap-1 mt-1.5 px-1">
                    <span className="text-[10px] text-slate-500 font-medium">
                      {timeString}
                    </span>
                    {isMine && (
                      msg.is_read ? (
                        <span title="Leído" className="flex items-center">
                          <CheckCheck size={14} className="text-indigo-400" />
                        </span>
                      ) : (
                        <span title="Enviado" className="flex items-center">
                          <Check size={14} className="text-slate-500" />
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Input para escribir */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-800/80 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef} 
            autoFocus
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.placeholder', { name: friendProfile.username })}
            className="flex-1 bg-slate-900 border border-slate-600 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            title={t('chat.send') || 'Enviar'}
            aria-label={t('chat.send') || 'Enviar'}
            className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}