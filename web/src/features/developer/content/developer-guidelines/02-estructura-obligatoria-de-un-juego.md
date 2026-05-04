# 📋 Estructura obligatoria de un juego

Todo juego implementado en la plataforma debe cumplir una **estructura mínima** que garantice:

* Coherencia.
* Jugabilidad.
* Correcta integración dentro del sistema.

## Tipo de juego

Se debe especificar claramente el **modo de juego**, ya que condiciona la lógica, la interacción y el sistema de puntuación.

### Tipos posibles

* **1 vs 1**.
* **Multijugador**.
* **Por turnos**.
* **Tiempo real**.

### Opciones adicionales

Opcionalmente, se puede indicar:

* **Individual** o **single-player**.
* **Cooperativo**.

> [!IMPORTANT]
> Es obligatorio indicar **al menos un modo de juego**.

## Género del juego

Cada juego debe indicar **al menos un género** que permita clasificarlo dentro de la plataforma.

### Géneros disponibles

* Acción.
* Aventura.
* Puzzle.
* Plataformas.
* Arcade.
* Estrategia.
* Rol o RPG.
* Simulación.
* Deportes.
* Multijugador.
* Educativo.
* Otro.

> [!NOTE]
> El género debe reflejar la **experiencia principal del juego** y facilitar su identificación por parte de los usuarios.

## Configuración de la partida

El juego debe permitir definir una **configuración previa** antes de iniciar la partida.

Esta configuración puede incluir:

* Modo de juego.
* Número de jugadores.
* Tiempo límite.
* Nivel de dificultad, si aplica.
* Parámetros específicos del juego.

> [!IMPORTANT]
> El usuario debe visualizar un **resumen de la configuración** antes de comenzar.

## Reglas y manual del juego

Cada juego debe proporcionar una explicación **clara, completa y accesible** de su funcionamiento antes de iniciar la partida.

Esta información debe estar disponible mediante un **manual o guía accesible desde la interfaz en todo momento**, antes y durante la partida, garantizando que ningún jugador comience sin conocer las reglas.

## Contenido mínimo del manual

El manual debe incluir, como mínimo, los siguientes apartados:

| Contenido                             | Descripción                                                          |
| ------------------------------------- | -------------------------------------------------------------------- |
| **Objetivo del juego**                | Explicación clara de qué debe conseguir el jugador.                  |
| **Reglas completas**                  | Normas que regulan el funcionamiento de la partida.                  |
| **Condiciones de victoria y derrota** | Criterios que determinan cuándo se gana o se pierde.                 |
| **Ejemplos de jugadas o mecánicas**   | Casos prácticos que ayuden a entender el juego.                      |
| **Explicación de la interfaz**        | Descripción de elementos visuales o controles relevantes, si aplica. |

> [!IMPORTANT]
> La información debe presentarse de forma **clara, estructurada y comprensible**, evitando ambigüedades que puedan afectar al desarrollo de la partida o generar situaciones de desventaja entre jugadores.

## Mantenimiento del manual

El contenido del manual debe mantenerse actualizado conforme a la evolución del juego, siguiendo las pautas definidas en el apartado de mantenimiento del documento.

> [!NOTE]
> El documento original menciona un apartado de mantenimiento, pero no incluye su contenido en el borrador proporcionado.

## Formato del manual

Las reglas del juego deben subirse en formato Markdown (`.md`).

El manual puede incluir:

* Texto estructurado.
* Listas.
* Tablas.
* Bloques de código.
* Imágenes.

> [!IMPORTANT]
> Se debe utilizar sintaxis estándar de Markdown para garantizar compatibilidad y correcta visualización dentro de la plataforma.

## Flujo de la partida

El juego debe definir claramente cómo se desarrolla una partida desde el inicio hasta el final.

Debe incluir:

1. **Inicio de la partida**.
2. **Desarrollo de la partida**: turnos, acciones, fases u otros elementos aplicables.
3. **Finalización**.
4. **Resultado**.

> [!WARNING]
> El flujo debe ser consistente y no presentar comportamientos inesperados.

## Sistema de puntuación

El juego debe definir un **sistema de puntuación o evaluación del rendimiento del jugador**.

> [!NOTE]
> Para más información, véase el apartado **Sistema de ELO, ranking y progresión**.

## Duración de la partida

El juego debe definir claramente **cuándo y cómo termina una partida**.

Esto puede establecerse mediante:

* Límite de tiempo.
* Objetivo alcanzado.
* Condición de victoria o derrota.
* Finalización por reglas internas.

> [!IMPORTANT]
> El jugador debe conocer estas condiciones antes de comenzar.

## ⚠️ Gestión de estados excepcionales

El juego debe contemplar situaciones no ideales y definir reglas claras para cada caso.

| Situación excepcional        | Requisito                                                  |
| ---------------------------- | ---------------------------------------------------------- |
| **Desconexión de jugadores** | Definir cómo afecta a la partida y al resultado.           |
| **Abandono de partida**      | Definir consecuencias y tratamiento de la puntuación.      |
| **Empates**                  | Definir si son posibles y cómo se resuelven.               |
| **Errores inesperados**      | Definir comportamiento esperado o medidas de recuperación. |
