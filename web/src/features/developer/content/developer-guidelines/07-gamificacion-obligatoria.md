# 🎯 Gamificación obligatoria

La gamificación es un elemento esencial de la plataforma y tiene como objetivo transformar la experiencia de juego en un sistema **motivador, progresivo y competitivo**.

No se trata únicamente de jugar, sino de generar una sensación continua de:

* Avance.
* Reto.
* Recompensa.

Estos elementos deben incentivar la participación del usuario a lo largo del tiempo.

> [!IMPORTANT]
> Todos los juegos integrados en la plataforma deben incorporar mecanismos de gamificación que refuercen la implicación del jugador.

## Objetivos de la gamificación

La gamificación debe cumplir los siguientes objetivos:

* Fomentar la participación recurrente.
* Incentivar la mejora del jugador.
* Generar sensación de progreso.
* Promover la competencia sana entre usuarios.
* Aumentar la retención dentro de la plataforma.

## 📋 Elementos mínimos obligatorios

Cada juego debe incluir **uno o varios** de los siguientes sistemas:

| Elemento                    | Objetivo                                     |
| --------------------------- | -------------------------------------------- |
| **Sistema de puntuación**   | Cuantificar el rendimiento del jugador.      |
| **Ranking o clasificación** | Comparar el rendimiento entre jugadores.     |
| **Progresión**              | Mostrar que el jugador mejora con el tiempo. |
| **Logros o retos**          | Incentivar objetivos adicionales.            |
| **Historial de partidas**   | Permitir consultar la evolución del jugador. |

## Sistema de puntuación

Debe existir una forma de **cuantificar el rendimiento del jugador**.

Puede basarse en:

* Resultados, como victoria o derrota.
* Rendimiento, como tiempo, precisión o puntuación.
* Logros dentro de la partida.

## Ranking o clasificación

El ranking permite comparar el rendimiento entre jugadores.

Debe cumplir los siguientes criterios:

* Ser claro y accesible.
* Reflejar el nivel relativo del jugador.
* Motivar la mejora.

## Progresión

El jugador debe percibir que mejora con el tiempo.

Esto puede reflejarse mediante:

* Incremento de puntuación.
* Mejores resultados.
* Avance en rangos o ligas.

## Logros o retos

Se deben incluir objetivos adicionales que incentiven la exploración del juego.

### Ejemplos

* Ganar sin perder vidas.
* Completar una partida en tiempo récord.
* Alcanzar cierta puntuación.

## Historial de partidas

El jugador debe poder consultar su evolución.

Debe incluir:

* Resultados anteriores.
* Estadísticas básicas.
* Progreso acumulado.

## 📈 Sensación de progreso

Uno de los aspectos más importantes es que el usuario perciba claramente su avance.

Para ello, se recomienda:

* Mostrar barras de progreso.
* Indicar puntos necesarios para el siguiente nivel.
* Visualizar cambios de rango o liga.
* Dar feedback tras cada partida.

> [!TIP]
> Un sistema que indica “Te faltan 50 puntos para subir a Bronce” genera motivación inmediata.

## Feedback y recompensas

El sistema debe proporcionar **feedback constante** al jugador.

Esto incluye:

* Resultados al finalizar la partida.
* Puntos ganados o perdidos.
* Cambios en ranking o posición.
* Notificaciones de logros.

El feedback debe ser:

| Criterio                    | Descripción                                                     |
| --------------------------- | --------------------------------------------------------------- |
| **Inmediato**               | Se muestra en el momento adecuado tras una acción o resultado.  |
| **Claro**                   | El jugador entiende qué ha ocurrido y cómo le afecta.           |
| **Visualmente reconocible** | El cambio o recompensa se identifica fácilmente en la interfaz. |

## ⚖️ Equilibrio en la motivación

La gamificación debe diseñarse cuidadosamente para evitar efectos negativos.

Se debe evitar:

* Sistemas que premien el tiempo por encima de la habilidad.
* Progresión excesivamente lenta o frustrante.
* Recompensas irrelevantes.
* Mecánicas que incentiven comportamientos abusivos.

El sistema debe recompensar principalmente:

* Habilidad.
* Mejora.
* Consistencia.

## Integración con el sistema de ELO

La gamificación debe estar alineada con el sistema de puntuación y ranking, o **ELO**.

Esto implica que:

* Los puntos obtenidos tengan impacto en el ranking.
* El progreso refleje el nivel real del jugador.
* La evolución sea coherente entre partidas.

## Ejemplo aplicado en la plataforma

En la plataforma **M4G**, la gamificación se implementa mediante un sistema combinado de:

* Ranking global de jugadores.
* Puntuación acumulada.
* Ligas o rangos progresivos.
* Indicadores de progreso hacia el siguiente nivel.
* Feedback visual tras cada partida.

El usuario puede ver su posición actual, su puntuación y cuánto necesita para avanzar, lo que genera una experiencia motivadora y orientada a objetivos.

> [!NOTE]
> Este enfoque sirve como referencia para los desarrolladores, que deben diseñar sus juegos de forma que contribuyan a esta experiencia global.

## ⚠️ Anti-patrones de gamificación

Para mantener una experiencia equilibrada y motivadora, se deben evitar los siguientes diseños.

| Anti-patrón                             | Descripción                                                                  | Ejemplo                                          |
| --------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------ |
| **Recompensar solo el tiempo de juego** | Premiar únicamente la cantidad de partidas jugadas en lugar del rendimiento. | Dar puntos por jugar sin importar el resultado.  |
| **Progresión demasiado lenta**          | Sistemas donde avanzar requiere un esfuerzo excesivo.                        | Necesitar muchas partidas sin avances visibles.  |
| **Recompensas sin valor**               | Elementos que no aportan impacto real al jugador.                            | Insignias sin utilidad ni visibilidad.           |
| **Falta de feedback**                   | No informar claramente sobre resultados o progreso.                          | No mostrar puntos ganados tras una partida.      |
| **Sistemas explotables o farm**         | Permitir acumular puntos sin esfuerzo real.                                  | Repetir acciones simples para subir ranking.     |
| **Exceso de azar**                      | Cuando la suerte influye más que la habilidad.                               | Grandes recompensas aleatorias.                  |
| **Inconsistencia en el sistema**        | Cambios o reglas poco claras.                                                | Variar puntos sin explicación.                   |
| **Sobrecarga de mecánicas**             | Demasiados sistemas que confunden al usuario.                                | Varias monedas, niveles y rankings sin claridad. |

> [!WARNING]
> Los sistemas de gamificación explotables, poco claros o basados principalmente en azar pueden afectar a la motivación del usuario y al equilibrio competitivo de la plataforma.
