export interface NewsItem {
  id: number;
  title: string;
  category: string;
  image: string;
  link?: string;
}

export const newsData: NewsItem[] = [
  
  {
    id: 1,
    title: 'Sistema de ranking ya disponible, empieza a competir',
    category: 'Actualizaciones',
    image: '/assets/news/ranking.jpg',
  },
  {
    id: 2,
    title: 'Nuevo juego exclusivo de M4G "System Override"',
    category: 'Lanzamientos',
    image: 'https://gfuldfbbwdjfetjfvkti.supabase.co/storage/v1/object/public/game-assets/system-override/so-thumbnail.png',
    link: '/game/2ac9d333-2e98-49b9-ab87-ad851ea1b576'
  },
  {
    id: 3,
    title: 'Nuevo mando SNES: como conseguirlo',
    category: 'Guía',
    image: '/assets/news/SNES.png',
  },
  {
    id: 4,
    title: 'Ya somos 10000 usuarios registrados',
    category: 'Noticias',
    image: '/assets/news/10000usuarios.png',
  },
  {
    id: 5,
    title: 'Mas de 50 juegos disponibles para jugar ahora mismo',
    category: 'Lanzamientos',
    image: '/assets/news/juegos.png',
    link: '/juegos',
  },
  {
    id: 6,
    title: 'M4G va global, ya disponible en 3 idiomas',
    category: 'Noticias',
    image: '/assets/news/mapa_mundo.png',
  },
  {
    id: 7,
    title: 'Nuevo juego "Pilot Adventure" ya disponible',
    category: 'Lanzamientos',
    image: 'https://gfuldfbbwdjfetjfvkti.supabase.co/storage/v1/object/public/game-assets/pilot-adventure/game-thumbnail.png',
    link: '/game/61d7df63-b81d-4139-9345-3b104752d2cd',
  },
  {
    id: 8,
    title: 'Nueva suscripción Next Gen, con ventajas exclusivas',
    category: 'Noticias',
    image: '/assets/news/next_gen.png',
    link: '/cuenta'
  },
];