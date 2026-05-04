# 🎨 Consistencia visual (UI)

## Paleta de colores oficial

Usa siempre estos **tokens de color** para mantener la coherencia visual con la plataforma.

> [!NOTE]
> Pasa el cursor sobre cualquier muestra para ver el valor hexadecimal.

<div class="m4g-palette"></div>

| Escala      | Uso principal                                         |
| ----------- | ----------------------------------------------------- |
| **Slate**   | Fondos, bordes y textos secundarios.                  |
| **Violet**  | Acento primario, botones y highlights del portal dev. |
| **Indigo**  | Acento secundario y portal de administración.         |
| **Emerald** | Estados de éxito y juegos activos.                    |
| **Amber**   | Avisos y estados en revisión.                         |
| **Rose**    | Errores y estados rechazados.                         |

## Imagen de portada (thumbnail)

La imagen de portada debe representar claramente el juego y funcionar correctamente tanto en vista reducida como a tamaño completo.

> [!IMPORTANT]
> **Especificaciones técnicas**
>
> | Requisito                           | Valor            |
> | ----------------------------------- | ---------------- |
> | **Formatos admitidos**              | JPG, PNG o WebP. |
> | **Resolución mínima**               | **800×600 px**.  |
> | **Relación de aspecto recomendada** | **4:3**.         |
> | **Tamaño máximo**                   | **2 MB**.        |

### ✅ Buenas prácticas

* Usa una **captura real del juego** o una **ilustración de alta calidad**.
* La imagen debe verse bien tanto en miniatura, por ejemplo a **80×80 px**, como a tamaño completo.

### ⚠️ Restricciones visuales

* Evita bordes, marcos o marcas de agua de terceros.
* El fondo no debe ser negro puro ni blanco puro.
* No incluyas texto superpuesto excesivo.

## Descripción del juego

La descripción es lo primero que un jugador leerá antes de entrar. Debe ser **clara, atractiva y sin errores ortográficos**.

| Campo        |        Mínimo |         Máximo |
| ------------ | ------------: | -------------: |
| **Longitud** | 50 caracteres | 500 caracteres |

> [!TIP]
> **Estructura recomendada**
>
> 1. Primera frase: qué es el juego.
> 2. Segunda frase: cómo se juega.
> 3. Tercera frase: qué lo hace especial.
>
> Ejemplo: *"Un plataformero de precisión ambientado en el espacio. Evita obstáculos y recoge estrellas usando los cursores o WASD. Incluye 20 niveles con dificultad progresiva y tabla de récords."*
