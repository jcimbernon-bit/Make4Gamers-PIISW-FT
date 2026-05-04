import introduccion from "../content/developer-guidelines/01-introduccion.md?raw";
import estructuraObligatoria from "../content/developer-guidelines/02-estructura-obligatoria-de-un-juego.md?raw";
import reglasEquilibrio from "../content/developer-guidelines/03-reglas-de-equilibrio-fair-play.md?raw";
import sistemaPuntuacion from "../content/developer-guidelines/04-sistema-de-configuracion-de-partidas.md?raw";
import reglasExperiencia from "../content/developer-guidelines/05-reglas-de-experiencia-de-usuario-ux.md?raw";
import consistenciaVisual from "../content/developer-guidelines/06-consistencia-visual-ui.md?raw";
import gamificacionObligatoria from "../content/developer-guidelines/07-gamificacion-obligatoria.md?raw";
import sistemaElo from "../content/developer-guidelines/08-sistema-de-elo-ranking-y-progresion.md?raw";
import sdkInstalacion from "../content/developer-guidelines/09-sdk-instalacion.md?raw";
import sdkFlujoCompleto from "../content/developer-guidelines/09b-sdk-flujo-completo.md?raw";
import cicloVidaJuego from "../content/developer-guidelines/10-ciclo-de-vida-del-juego.md?raw";

export type ManualSection = {
  id: string;
  title: string;
  description: string;
  content: string;
};

export const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: "introduccion",
    title: "Introducción",
    description:
      "Presentación general del manual para desarrolladores y del propósito de las guidelines de M4G.",
    content: introduccion,
  },
  {
    id: "estructura-obligatoria",
    title: "Estructura obligatoria de un juego",
    description:
      "Requisitos mínimos que debe cumplir un juego para poder integrarse correctamente en la plataforma.",
    content: estructuraObligatoria,
  },
  {
    id: "reglas-equilibrio-fair-play",
    title: "Reglas de equilibrio y fair play",
    description:
      "Normas para garantizar partidas justas, equilibradas y coherentes para todos los jugadores.",
    content: reglasEquilibrio,
  },
  {
    id: "sistema-configuracion-partidas",
    title: "Sistema de configuración de partidas",
    description:
      "Criterios de configuración de partidas e integración técnica con el SDK para registrar matches y movimientos.",
    content: sistemaPuntuacion,
  },
  {
    id: "reglas-experiencia-usuario",
    title: "Reglas de experiencia de usuario UX",
    description:
      "Buenas prácticas y requisitos para asegurar una experiencia clara, usable y accesible.",
    content: reglasExperiencia,
  },
  {
    id: "consistencia-visual-ui",
    title: "Consistencia visual UI",
    description:
      "Normas visuales para mantener una interfaz coherente con la identidad de M4G.",
    content: consistenciaVisual,
  },
  {
    id: "gamificacion-obligatoria",
    title: "Gamificación obligatoria",
    description:
      "Elementos de gamificación que deben respetarse para integrarse correctamente con la experiencia de la plataforma.",
    content: gamificacionObligatoria,
  },
  {
    id: "sistema-elo-ranking-progresion",
    title: "Sistema de ELO, ranking y progresión",
    description:
      "Funcionamiento de la progresión competitiva, rankings e implementación técnica del ELO con el m4g-sdk.",
    content: sistemaElo,
  },
  {
    id: "sdk-instalacion",
    title: "SDK m4g-sdk — Instalación y configuración",
    description:
      "Instala la librería oficial de M4G, configura las dependencias e integra getLaunchContextFromUrl para leer el contexto de lanzamiento.",
    content: sdkInstalacion,
  },
  {
    id: "sdk-flujo-completo",
    title: "SDK m4g-sdk — Flujo completo de integración",
    description:
      "Diagrama de secuencia, patrón host-only y ejemplo completo en TypeScript para un juego por turnos de 2 a 4 jugadores.",
    content: sdkFlujoCompleto,
  },
  {
    id: "ciclo-vida-juego",
    title: "Ciclo de vida del juego",
    description:
      "Fases por las que pasa un juego desde su preparación hasta su publicación, revisión o retirada.",
    content: cicloVidaJuego,
  },
];
