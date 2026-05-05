import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Search, User, Save, Check, X } from 'lucide-react'; 
import UserAvatar from '../../../../shared/components/UserAvatar';

type FriendEntry = {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
  subscription_tier?: string | null;
};


type AccountFriendsSectionProps = {
  friendsSearch: string;
  filteredFriends: FriendEntry[];
  onFriendsSearchChange: (value: string) => void;
  pendingRequests: any[]; 
  onAcceptRequest: (requestId: string, senderId: string) => void; 
  onRejectRequest: (requestId: string) => void; 
};

export function AccountFriendsSection({
  friendsSearch,
  filteredFriends,
  onFriendsSearchChange,
  pendingRequests,
  onAcceptRequest,
  onRejectRequest
}: AccountFriendsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h3 className="text-xl font-semibold text-white">{t('account.friends.title')}</h3>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={friendsSearch}
            onChange={(e) => onFriendsSearchChange(e.target.value)}
            placeholder={t('account.friends.searchPlaceholder')}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 px-1">
            Solicitudes pendientes ({pendingRequests.length})
          </h4>
          <div className="grid gap-3">
            {pendingRequests.map((request) => (
              <div 
                key={request.id}
                className="flex items-center justify-between p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar src={request.sender.avatar_url} name={request.sender.username} size={35} />
                  <span className="text-sm font-medium text-white">{request.sender.username}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAcceptRequest(request.id, request.sender.id)}
                    className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                    title="Aceptar"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => onRejectRequest(request.id)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                    title="Rechazar"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="my-6 border-b border-slate-800" />
        </div>
      )}

     
      <div className="grid gap-3">
        {filteredFriends.map((friend) => (
          <div
            key={friend.id}
            className="group flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800/50 rounded-2xl hover:bg-slate-800/50 hover:border-slate-700 transition-all"
          >
            <Link to={`/usuario/${friend.username}`} className="flex items-center gap-3 flex-1 min-w-0">
              <UserAvatar src={friend.avatar_url} name={friend.username} size={40} />
              <div className="min-w-0">
                <div className="flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                  <p className="text-white font-medium truncate">{friend.username}</p>
                  {friend.subscription_tier === 'premium' && (
                    <Save size={14} className="text-yellow-500 fill-yellow-500/20" />
                  )}
                </div>
                <p className="text-xs text-slate-400">{friend.status || 'Desconectado'}</p>
              </div>
            </Link>

            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-500/20 transition-colors"
            >
              <MessageCircle size={15} />
              <span className="hidden xs:inline">Mensaje</span>
            </Link>
          </div>
        ))}

        {filteredFriends.length === 0 && !pendingRequests.length && (
          <div className="text-center py-10">
            <User className="mx-auto text-slate-700 mb-3" size={40} />
            <p className="text-slate-500 text-sm">{t('account.friends.noFriends')}</p>
          </div>
        )}
      </div>
    </section>
  );
}