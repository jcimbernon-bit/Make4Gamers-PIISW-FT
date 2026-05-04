import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Crown, Lock, Gamepad2 } from "lucide-react";
import GameCard from "../features/games/components/GameCard";
import { getGames, type Game } from "../features/games/services/getGames";
import { Link } from "react-router-dom";
import { useAuthStatus } from "../features/auth/hooks/useAuthStatus";
import { supabase } from "../supabase";

function safeLower(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}

export default function Juegos() {
  const [games, setGames] = useState<Game[]>([]);
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { user, isAuthenticated } = useAuthStatus();

  const [isPremiumUser, setIsPremiumUser] = useState(false);
  
 
  const [activeTab, setActiveTab] = useState<"catalogo" | "premium">("catalogo");

  const categoryOptions = [
    { value: "all", label: t("game.filters.all") },
    { value: "action", label: t("game.filters.action") },
    { value: "arcade", label: t("game.filters.arcade") },
    { value: "rpg", label: t("game.filters.rpg") },
    { value: "puzzle", label: t("game.filters.puzzle") },
  ];

  useEffect(() => {
    const loadGames = async () => {
      try {
        let isPremium = false;

        if (isAuthenticated && user) {
          const { data } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single();
          
          if (data?.subscription_tier === 'premium') {
            isPremium = true;
          }
        }
        
        setIsPremiumUser(isPremium);

       
        const gamesData = await getGames(isPremium);
        setGames(gamesData);

      } catch (error) {
        console.error("Error cargando juegos:", error);
      }
    };

    loadGames();
  }, [user, isAuthenticated]);

  const premiumGames = games.filter(game => game.status === 'review');
  const regularGames = games.filter(game => game.status !== 'review');

const filteredGames = regularGames.filter((game) => {
    const matchesSearch = safeLower(game.title).includes(safeLower(searchTerm));
    const matchesCategory =
      categoryFilter === "all" ||
      safeLower(game.genre) === safeLower(categoryFilter);
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
  
    const aFunciona = a.game_url ? 1 : 0; 
    const bFunciona = b.game_url ? 1 : 0;
    
    return bFunciona - aFunciona; 
  });
  const hasActiveFilters = searchTerm.trim().length > 0 || categoryFilter !== "all";

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-950/20 to-slate-950">
  
      <section className="container mx-auto pt-12 px-4 pb-12">

       
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight mb-8">
            Descubre <span className="text-indigo-400">Juegos</span>
          </h1>

          <div className="flex items-center gap-6 border-b border-slate-800/80 pb-px">
       
            <button
              onClick={() => setActiveTab("catalogo")}
              className={`relative pb-4 text-lg font-bold transition-colors flex items-center gap-2 ${
                activeTab === "catalogo" 
                  ? "text-white" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Gamepad2 size={20} />
              Catálogo General
              {activeTab === "catalogo" && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded-t-md shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              )}
            </button>

           
            <button
              onClick={() => setActiveTab("premium")}
              className={`relative pb-4 text-lg font-bold transition-colors flex items-center gap-2 ${
                activeTab === "premium" 
                  ? "text-amber-400" 
                  : "text-slate-500 hover:text-amber-400/70"
              }`}
            >
              <Crown size={20} />
              Acceso VIP
              {activeTab === "premium" && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-400 rounded-t-md shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              )}
            </button>
          </div>
        </div>
   
        {activeTab === "catalogo" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{t("game.allGames")}</h2>
              <span className="text-slate-400">{filteredGames.length} {t("game.gamesCount")}</span>
            </div>

            <div className="mb-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="group relative w-full lg:max-w-md lg:flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-slate-300" size={17} />
                  <input
                    type="text"
                    placeholder={t("game.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {categoryOptions.map((option) => {
                    const isActive = categoryFilter === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setCategoryFilter(option.value)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-100"
                            : "border-slate-800 bg-transparent text-slate-300 hover:border-slate-600 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}

                  {hasActiveFilters && (
                    <div className="ml-1 border-l border-slate-800/80 pl-2 sm:ml-2 sm:pl-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter("all");
                        }}
                        className="h-9 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 text-sm font-medium text-rose-200 transition-colors hover:border-rose-400/60 hover:bg-rose-500/20"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <Link key={game.id} to={`/game/${game.id}`} className="block">
                    <GameCard
                      title={game.title ?? "Unknown game"}
                      image={game.thumbnail_url ?? "https://via.placeholder.com/400x300?text=No+Image"}
                      genre={game.genre ?? t("gameplay.noGenre")}
                      rating={typeof game.rating === "number" ? game.rating : 0}
                      players={game.players ?? 0}
                      status={game.status ?? undefined}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-800/50 border-dashed">
                <Gamepad2 size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-400 text-lg">{t("game.noResults")}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "premium" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            
            {!isPremiumUser ? (
            
              <div className="relative rounded-[2rem] overflow-hidden bg-slate-900/20 p-8 md:p-16 border border-slate-800/50 flex items-center justify-center min-h-[450px]">
                
                
                {premiumGames.length > 0 && (
                  <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-4 p-8 opacity-10 blur-2xl pointer-events-none grayscale">
                    {premiumGames.slice(0, 4).map(g => (
                      <div key={g.id} className="bg-slate-700 aspect-video rounded-2xl" />
                    ))}
                  </div>
                )}

                <div className="relative z-10 bg-slate-900/80 backdrop-blur-2xl border border-amber-500/20 p-10 rounded-[3rem] text-center max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
                    <Lock className="text-amber-400" size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Zona Exclusiva VIP</h3>
                  <p className="text-slate-300 text-base mb-8 leading-relaxed">
                    Esta sección contiene juegos en fase beta y lanzamientos anticipados. Mejora tu cuenta para obtener acceso total.
                  </p>
                  <Link to="/cuenta" className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95">
                    <Crown size={20} />
                    Mejorar mi Cuenta
                  </Link>
                </div>
              </div>
            ) : (
             
              premiumGames.length === 0 ? (
               
                <div className="bg-slate-900/30 border border-slate-800/50 border-dashed rounded-3xl py-16 px-6 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="p-4 bg-slate-800/50 rounded-full text-slate-600">
                    <Crown size={40} />
                  </div>
                  <div className="max-w-sm">
                    <h3 className="text-white font-bold text-xl mb-1">¡Todo al día, capitán!</h3>
                    <p className="text-slate-500 text-sm">
                      No hay juegos en fase de pruebas en este momento. ¡Vuelve pronto para ver los nuevos lanzamientos VIP!
                    </p>
                  </div>
                </div>
              ) : (
               
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {premiumGames.map((game) => (
                    <Link key={game.id} to={`/game/${game.id}`} className="block transition-transform hover:scale-[1.02]">
                      <GameCard 
                        title={game.title ?? "Unknown game"}
                        image={game.thumbnail_url ?? "https://via.placeholder.com/400x300?text=No+Image"}
                        genre={game.genre ?? t("gameplay.noGenre")}
                        rating={typeof game.rating === "number" ? game.rating : 0}
                        players={game.players ?? 0}
                        status={game.status ?? undefined}
                      />
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>
        )}

      </section>
    </div>
  );
}
