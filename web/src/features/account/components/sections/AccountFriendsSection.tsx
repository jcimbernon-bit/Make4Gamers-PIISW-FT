import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Search, User, Save } from 'lucide-react'; 
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
};

export function AccountFriendsSection({
  friendsSearch,
  filteredFriends,
  onFriendsSearchChange,
}: AccountFriendsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h3 className="text-xl font-semibold text-white">{t('account.friends.title')}</h3>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={friendsSearch}
            onChange={(e) => onFriendsSearchChange(e.target.value)}
            placeholder={t('account.friends.searchPlaceholder')}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredFriends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:bg-slate-800 transition-all group">
            
           
            <Link 
              to={`/usuario/${friend.username}`} 
              className="flex-1 flex items-center gap-3 group"
            >
              <div className="relative">
                <UserAvatar src={friend.avatar_url} name={friend.username} size={45} />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${friend.status === 'online' ? 'bg-green-500' : 'bg-slate-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                  <p className="text-white font-medium truncate">
                    {friend.username}
                  </p>
                  {friend.subscription_tier === 'premium' && (
                    <span title="Usuario Premium" className="flex items-center">
                      <Save size={15} className="text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] animate-pulse shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 group-hover:text-slate-300">
                  {friend.status || 'Desconectado'}
                </p>
              </div>
            </Link>

            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-500/20 transition-colors shrink-0"
            >
              <MessageCircle size={15} />
              <span className="hidden xs:inline">{t('account.friends.sendMessage')}</span>
            </Link>

          </div>
        ))}

        {filteredFriends.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm italic">No se encontraron amigos.</p>
          </div>
        )}
      </div>
    </section>
  );
}