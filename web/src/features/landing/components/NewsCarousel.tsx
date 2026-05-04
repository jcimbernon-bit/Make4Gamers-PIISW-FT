import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import { newsData } from '../constants/News';
import { Link } from 'react-router-dom';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';




export const NewsCarousel: React.FC = () => {
  return (
    <section className="relative w-full overflow-visible py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(163,230,53,0.14),transparent_40%)]" />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Pagination, EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView={1.1}
          spaceBetween={14}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 16 },
            1024: { slidesPerView: 1.35, spaceBetween: 20 },
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1.4,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          className="w-full
            [&_.swiper-wrapper]:items-center
            [&_.swiper-pagination]:!bottom-0
            [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2
            [&_.swiper-pagination-bullet]:bg-violet-400/60
            [&_.swiper-pagination-bullet]:transition-all
            [&_.swiper-pagination-bullet-active]:w-5
            [&_.swiper-pagination-bullet-active]:rounded-full
            [&_.swiper-pagination-bullet-active]:bg-lime-300"
        >
          {newsData.map((news) => (
            <SwiperSlide key={news.id} className="group pb-9">
              {({ isActive }) => (
                <Link to={news.link || '#'} className={!news.link ? 'cursor-default' : ''}>
                  <article
                    className={`relative overflow-hidden rounded-3xl border transition-all duration-500
                    ${
                      isActive
                        ? 'scale-100 border-white/25 opacity-100 shadow-[0_16px_50px_-16px_rgba(124,58,237,0.72)]'
                        : 'scale-[0.94] border-white/15 opacity-72'
                    }`}
                  >
                    <div className="relative aspect-[16/8]">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/35 to-transparent" />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                    </div>

                    <div
                      className={`absolute bottom-0 left-0 w-full p-5 sm:p-6 transition-all duration-500 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                      }`}
                    >
                      <span className="inline-flex rounded-full bg-lime-300 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-950 sm:text-xs">
                        {news.category}
                      </span>
                      <h3 className="mt-2 text-lg font-extrabold leading-tight text-white drop-shadow md:text-2xl lg:text-3xl">
                        {news.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};