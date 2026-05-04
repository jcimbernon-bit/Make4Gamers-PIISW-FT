import { Link } from "react-router-dom";

interface GameCardProps {
  title: string;
  description: string;
  videoSrc: string;
  gameUrl: string;
}

const GameCard = ({ title, description, videoSrc, gameUrl }: GameCardProps) => {
  return (
    <div className="max-w-5xl mx-auto my-12 group px-4">
      <div className="
        relative overflow-hidden
        bg-gradient-to-br from-[#4c48af] via-[#3a3692] to-[#2d2a70]
        rounded-[3rem]
        p-8 md:p-10 lg:p-12
        shadow-[0_28px_50px_-12px_rgba(0,0,0,0.6)]
        border border-white/10
        flex flex-col md:flex-row items-center gap-7 lg:gap-9
      ">
        <div className="flex-[0.8] space-y-5 z-10">
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-black leading-[0.95] tracking-tighter uppercase italic">
            {title}
          </h2>
          <p className="text-indigo-100/80 text-sm md:text-base leading-relaxed max-w-sm">
            {description}
          </p>

          <div className="pt-1">
            <Link
              to={gameUrl}
              className="
                inline-flex items-center justify-center
                bg-white/10 hover:bg-white/20 backdrop-blur-xl
                text-white text-base font-extrabold
                py-3.5 px-7 rounded-[1.5rem]
                border border-white/20
                transition-all duration-300
                transform hover:scale-105 active:scale-95 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)]
              "
            >
              PLAY <span className="ml-3 text-lg">▶︎</span>
            </Link>
          </div>
        </div>

        <div className="flex-[1.6] w-full relative">
          <div className="absolute -inset-4 bg-green-500/20 rounded-[2.5rem] blur-2xl group-hover:bg-green-500/30 transition-all duration-500"></div>

          <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5">
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
            >
              Tu navegador no soporta videos.
            </video>
          </div>
        </div>

        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
};

export default GameCard;