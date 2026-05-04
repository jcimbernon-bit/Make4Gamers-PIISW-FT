import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NewsCarousel } from "./NewsCarousel";
import GameCardRecomendation from "./GameCardRecomendation";
import { RecomendedGames } from "../constants/RecomendedGames";
import { NeonMarquee } from "./NeonMarquee";
import Typewriter from 'typewriter-effect';
import GameCard from "../../games/components/GameCard";
import { getGames, type Game } from "../../games/services/getGames";

export default function Dashboard() {
  const { t } = useTranslation();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    getGames()
      .then(setGames)
      .catch(() => setGames([]));
  }, []);

  const popularGames = [...games]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3);

  return (
    <>
      <section className="relative flex items-center justify-center px-8 py-16 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
          <div className="mb-4 text-2xl font-semibold uppercase tracking-[0.45em] text-lime-200">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString('Challenge the Top,')
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString('Be the Top.')
                  .start()
              }}
            />
          </div>

          <h1 className="w-full text-center text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white drop-shadow-[0_0_6px_rgba(192,132,252,0.2)] md:text-5xl xl:text-6xl">
            Made<span className="text-violet-500">4Gamers</span>
          </h1>

          <div className="mx-auto mt-8 mb-0 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-violet-400/60 to-transparent shadow-[0_0_12px_rgba(167,139,250,0.35)]" />
        </div>
      </section>

      <section className="relative">
        <NewsCarousel />
      </section>

      <section className="relative mt-16">
        <div className="w-full text-center">
          <NeonMarquee />
        </div>
      </section>

      <div className="p-6">
        {RecomendedGames.map((game) => (
          <GameCardRecomendation
            key={game.id}
            title={game.title}
            description={game.description}
            videoSrc={game.videoSrc}
            gameUrl={game.gameUrl}
          />
        ))}
      </div>

      {/* Juegos populares */}
      {popularGames.length > 0 && (
        <section className="px-4 pt-8 pb-16 md:px-8">
          <div className="mx-auto max-w-6xl">

            {/* Título mejorado */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-lime-300/70">{t("game.popular")}</p>
              <div className="mt-1 flex items-end gap-4">
                <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                  Top <span className="text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Juegos</span>
                </h2>
                <Link
                  to="/juegos"
                  className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500 transition-colors hover:text-lime-300"
                >
                  Ver todos →
                </Link>
              </div>
              <div className="mt-3 h-px w-full bg-gradient-to-r from-violet-500/40 via-violet-400/20 to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularGames.map((game) => (
                <Link key={game.id} to={`/game/${game.id}`} className="block">
                  <GameCard
                    title={game.title ?? "Unknown game"}
                    image={game.thumbnail_url ?? "https://via.placeholder.com/400x300?text=No+Image"}
                    genre={game.genre ?? t("gameplay.noGenre")}
                    rating={typeof game.rating === "number" ? game.rating : 0}
                    players={game.players ?? 0}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}