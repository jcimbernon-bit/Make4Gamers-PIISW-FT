import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            es: {
                translation: {
                    nav: {
                        games: "Juegos",
                        ranking: "Ranking",
                        stats: "Estadísticas",
                        chat: "Chat",
                        account: "Cuenta",
                        logout: "Cerrar sesión"
                    },
                    admin: {
                        management: "Gestión",
                        panelButton: "Admin",
                        panelTitle: "Panel de administración",
                        panelSubtitle: "Gestión centralizada de la plataforma.",
                        dashboard: "Panel",
                        devRequests: "Solicitudes Dev",
                        pendingTickets: "Tickets pendientes",
                        pendingSuggestions: "Sugerencias en revisión",
                        pendingDevRequests: "Solicitudes dev pendientes",
                        backHome: "Volver al inicio",
                        loading: "Cargando panel de administración...",
                        requests: {
                            loading: "Cargando solicitudes...",
                            title: "Solicitudes de developer",
                            subtitle: "Gestiona aprobaciones y rechazos.",
                            empty: "No hay solicitudes registradas.",
                            unknownUser: "Usuario desconocido",
                            accept: "Aceptar",
                            reject: "Rechazar"
                        },
                        wordFilterPage: {
                            loading: "Cargando...",
                            title: "Filtro de Chat",
                            subtitle: "Gestiona las palabras ofensivas censuradas automáticamente.",
                            placeholder: "Escriba una palabra",
                            add: "Añadir",
                            added: "Palabra añadida al filtro",
                            deleted: "Palabra eliminada"
                        },
                        suggestionsPage: {
                            checking: "Verificando permisos...",
                            accessDenied: "Acceso Denegado",
                            accessDeniedDesc: "Esta zona es solo para desarrolladores",
                            title: "Panel de Sugerencias",
                            subtitle: "Gestiona las ideas y reportes de la comunidad",
                            total_one: "Total: {{count}} mensaje",
                            total_other: "Total: {{count}} mensajes",
                            empty: "No hay sugerencias",
                            unknownUser: "Usuario desconocido",
                            reviewing: "En revisión",
                            accept: "Aceptar",
                            reject: "Descartar"
                        },
                        ticketsPage: {
                            loading: "Cargando panel de soporte...",
                            accessDenied: "Acceso Denegado",
                            accessDeniedDesc: "Esta zona es solo para el equipo de soporte y desarrolladores",
                            title: "Panel de Soporte",
                            subtitle: "Gestiona y resuelve los tickets de los usuarios",
                            empty: "No hay tickets que coincidan con los filtros",
                            unknownUser: "Usuario desconocido",
                            reviewing: "En revisión",
                            resolve: "Marcar Resuelto"
                        },
                        formulasPage: {
                            title: "Laboratorio de Fórmulas",
                            subtitle: "Ajusta la economía y puntuaciones del juego en tiempo real.",
                            previewTitle: "Vista Previa del Multiplicador",
                            points: "puntos",
                            previewText: {
                                beforeScore: "Si un jugador gana una partida de",
                                beforeMultiplier: "con el multiplicador actual de",
                                beforeTotal: "recibirá un total de",
                                afterTotal: "para el ranking."
                            },
                            success: "¡Fórmulas actualizadas y aplicadas en tiempo real!",
                            error: "Hubo un error al guardar las configuraciones.",
                            saving: "Guardando...",
                            saveApply: "Guardar y Aplicar Fórmulas"
                        },
                        formulas: "Fórmulas",
                        tickets: "Tickets",
                        suggestions: "Sugerencias",
                        wordFilter: "Filtro de Palabras"
                    },
                    developer: {
                        layout: {
                            loading: "Cargando panel de desarrollador…",
                            portalBadge: "Developer Portal",
                            title: "Panel de Desarrollador",
                            subtitle: "Gestión y seguimiento de tus contribuciones a M4G.",
                            backHome: "Volver al inicio",
                            contactPrompt: "¿Dudas o problemas?",
                            contactLink: "Contacta con el equipo",
                            nav: { dashboard: "Panel", games: "Mis juegos", stats: "Estadísticas" }
                        },
                        status: {
                            published: "Publicado", review: "En revisión", rejected: "Rechazado",
                            draft: "Borrador", inactive: "Inactivo", unknown: "Desconocido"
                        },
                        dashboard: {
                            verifiedBadge: "Desarrollador Verificado",
                            welcome: "Bienvenido al equipo de",
                            welcomeDesc: "Desde aquí puedes gestionar tus juegos, seguir su evolución y consultar la documentación oficial.",
                            manualLink: "Manual de Desarrollador",
                            cards: { total: "Total", published: "Publicados", review: "En revisión", rejected: "Rechazados" },
                            drafts_one: "{{count}} juego en borrador",
                            drafts_other: "{{count}} juegos en borrador",
                            draftsDesc: "Pendientes de enviar a revisión",
                            viewGames: "Ver juegos",
                            recentTitle: "Mis juegos recientes",
                            noGames: "Aún no has subido ningún juego."
                        },
                        games: {
                            title: "Mis juegos",
                            count_one: "{{count}} juego", count_other: "{{count}} juegos",
                            addGame: "Añadir juego",
                            emptyTitle: "Aún no has publicado ningún juego",
                            emptyDesc: "Empieza ahora y llega a miles de jugadores en M4G.",
                            publishFirst: "Publicar mi primer juego",
                            noDescription: "Sin descripción", play: "Jugar", edit: "Editar"
                        },
                        stats: {
                            title: "Estadísticas de mis juegos",
                            empty: "No hay juegos para mostrar estadísticas.",
                            totalPlays: "Partidas totales", uniquePlayers: "Jugadores únicos", avgRating: "Valoración media",
                            chartTitle: "Partidas por juego", tableTitle: "Desglose por juego",
                            colGame: "Juego", colPlays: "Partidas", colUnique: "Jugadores únicos", colRating: "Valoración"
                        },
                        manual: {
                            backToPanel: "Volver al panel",
                            title: "Manual de Desarrollador",
                            subtitle: "Documentación técnica oficial de M4G para desarrolladores verificados.",
                            searchPlaceholder: "Buscar en el manual…",
                            results_one: "{{count}} sección encontrada para",
                            results_other: "{{count}} secciones encontradas para",
                            noResults: "No hay secciones que coincidan con tu búsqueda.",
                            clearSearch: "Limpiar búsqueda",
                            footerText: "Manual de Desarrollador M4G · Última actualización: mayo 2026 ·",
                            footerLink: "¿Algo desactualizado? Cuéntanos"
                        },
                        gameEdit: {
                            loading: "Cargando juego…", notFound: "Juego no encontrado.",
                            backToGames: "Volver a mis juegos", pageTitle: "Editar juego",
                            save: "Guardar cambios", saving: "Guardando…",
                            saved: "Juego actualizado correctamente", saveError: "Error al guardar",
                            notFoundError: "Juego no encontrado", permissionError: "No tienes permiso para editar este juego",
                            nameRequired: "El nombre es obligatorio",
                            sections: { basic: "Información básica", urlDist: "URL y distribución del juego", thumbnail: "Imagen de portada", rules: "Documento de reglas", publication: "Publicación" },
                            fields: { title: "Nombre del juego", description: "Descripción", version: "Versión", minAge: "Edad mínima", price: "Precio (€)", genre: "Género", modes: "Modos de juego", url: "URL de alojamiento", dist: "Dist del juego", thumbnail: "Thumbnail", rules: "Nuevo documento", currentStatus: "Estado actual" },
                            hints: { version: "Ej: 1.0.0", minAge: "0 = sin restricción", price: "0 = gratuito", url: "Debe ser HTTPS. Déjala vacía si subes el dist directamente.", dist: ".html, .js, .zip — el HTML se usará como game_url", thumbnail: "JPG, PNG o WebP · mín. 800×600", rules: "PDF, DOC, DOCX, TXT, MD" },
                            sendToReview: "Enviar a revisión",
                            free: "Gratuito", forAll: "Para todos",
                            orUpload: "o sube el archivo del juego",
                            viewCurrentDoc: "Ver documento actual",
                            statusNote: "El estado solo puede cambiarlo el equipo de M4G. Para solicitar cambios de visibilidad,",
                            contactLink: "contacta con el equipo",
                            change: "Cambiar", removeFile: "Quitar archivo", clickOrDrag: "Haz clic o arrastra aquí",
                            slugLabel: "Slug",
                            storageNote: "Archivos en"
                        },
                        gameNew: {
                            pageTitle: "Publicar nuevo juego", backToPortal: "Volver al portal",
                            steps: { info: "Información", technical: "Técnico", assets: "Assets", review: "Revisión" },
                            stepTitles: { info: "Información básica", technical: "Detalles técnicos", assets: "Assets del juego", review: "Revisión y publicación" },
                            buttons: { next: "Siguiente", back: "Atrás", submit: "Publicar juego", submitting: "Publicando…" },
                            validation: {
                                titleRequired: "El nombre del juego es obligatorio.",
                                urlOrFile: "Debes indicar una URL o subir un archivo del juego.",
                                urlHttps: "La URL del juego debe usar HTTPS.",
                                thumbnailRequired: "La imagen de portada es obligatoria.",
                                rulesFormat: "El documento de reglas debe ser un archivo .md",
                                imageSize: "La imagen no puede superar los 2 MB"
                            },
                            uploading: "Subiendo archivos…", creating: "Creando juego…",
                            success: "¡Juego enviado a revisión!", error: "Error al publicar el juego",
                            review: { name: "Nombre", description: "Descripción", genre: "Género", modes: "Modos", version: "Versión", minAge: "Edad mínima", price: "Precio", urlDist: "URL / Dist", rules: "Reglas (.md)", thumbnail: "Imagen de portada" },
                            values: { forAll: "Para todos", free: "Gratuito", notSpecified: "Sin especificar", notIndicated: "No indicados", withoutDoc: "Sin documento", urlConfigured: "URL configurada correctamente.", fileSelected: "Archivo seleccionado: {{name}}" },
                            orUpload: "o sube el archivo del juego",
                            rulesOptional: "documento de reglas (opcional)",
                            stepOf: "Paso {{step}} de {{total}}", percentComplete: "{{percent}}% completado",
                            reviewTitle: "Datos del juego",
                            initialStatus: "Estado inicial: En borrador. El equipo de M4G lo revisará antes de publicarlo.",
                            change: "Cambiar", removeFile: "Quitar archivo", clickOrDrag: "Haz clic o arrastra aquí"
                        }
                    },
                    footer: {
                        description: "La plataforma definitiva para descubrir, jugar y compartir tus experiencias de juego favoritas.",
                        rights: "Todos los derechos reservados.",
                        explore: {
                            title: "Explorar",
                            popular: "Populares",
                            new: "Novedades",
                            offers: "Ofertas"
                        },
                        support: {
                            title: "Soporte",
                            help: "Ayuda",
                            refunds: "Reembolsos",
                            contact: "Contacto"
                        },
                        legal: {
                            title: "Legal",
                            privacy: "Privacidad",
                            terms: "Términos"
                        }
                    },
                    auth: {
                        login: "Iniciar sesión",
                        register: "Registrarse",
                        email: "Correo electrónico",
                        password: "Contraseña",
                        confirmPassword: "Confirmar contraseña",
                        fullName: "Nombre completo",
                        username: "Nombre de usuario",
                        loginButton: "Iniciar sesión",
                        registerButton: "Crear cuenta",
                        loading: "Cargando...",
                        noAccount: "¿No tienes cuenta?",
                        haveAccount: "¿Ya tienes cuenta?",
                        loginLink: "Inicia sesión",
                        registerLink: "Regístrate",
                        forgotPassword: "¿Olvidaste tu contraseña?",
                        rememberMe: "Recuérdame",
                        or: "o",
                        continueWithGoogle: "Continuar con Google",
                        errors: {
                            emailRequired: "El correo es obligatorio",
                            invalidEmail: "El correo no es válido",
                            passwordRequired: "La contraseña es obligatoria",
                            passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
                            passwordMismatch: "Las contraseñas no coinciden",
                            nameRequired: "El nombre es obligatorio",
                            usernameRequired: "El nombre de usuario es obligatorio"
                        },
                        loginRequiredTitle: "Inicia sesión",
                        loginRequired: "Inicia sesión para guardar progreso y acceder a todas las funciones.",
                        recoverPassword: {
                            title: "Recuperar contraseña",
                            subtitle: "Introduce tu correo y te enviaremos un enlace para restablecerla.",
                            emailLabel: "Correo electrónico",
                            emailPlaceholder: "tu@email.com",
                            invalidEmail: "Por favor, introduce un email válido.",
                            success: "¡Correo enviado! Revisa tu bandeja de entrada o spam para restablecer tu contraseña.",
                            sending: "Enviando...",
                            send: "Enviar enlace",
                            remembered: "¿Recordaste tu contraseña?",
                            backToLogin: "Volver al login"
                        },
                        updatePassword: {
                            title: "Actualizar contraseña",
                            subtitle: "Define una nueva contraseña segura para tu cuenta.",
                            newPasswordLabel: "Nueva contraseña",
                            newPasswordPlaceholder: "Mínimo 8 caracteres",
                            confirmPasswordLabel: "Confirmar contraseña",
                            confirmPasswordPlaceholder: "Repite la contraseña",
                            invalidOrExpiredLink: "Este enlace de recuperación no es válido o ha expirado. Solicita uno nuevo.",
                            validateLinkError: "No se pudo validar el enlace de recuperación.",
                            minLength: "La contraseña debe tener al menos 8 caracteres.",
                            mismatch: "Las contraseñas no coinciden.",
                            sessionNotActive: "Tu sesión de recuperación no está activa. Vuelve a solicitar el enlace.",
                            success: "Contraseña actualizada correctamente. Te redirigimos al login.",
                            validating: "Validando enlace...",
                            updating: "Actualizando...",
                            save: "Guardar nueva contraseña",
                            needAnotherLink: "¿Necesitas solicitar otro enlace?",
                            backToRecover: "Volver a recuperar contraseña"
                        }
                    },
                    contact: {
                        title: "Buzón de Sugerencias",
                        subtitle: "Ayúdanos a mejorar Make4Gamers con tus ideas o reportando fallos.",
                        categoryLabel: "¿Qué tipo de mensaje es?",
                        categories: {
                            idea: "Tengo una idea o sugerencia de mejora",
                            bug: "He encontrado un error",
                            support: "Necesito ayuda con la plataforma",
                            other: "Otro tema"
                        },
                        contentLabel: "Detalles de tu mensaje",
                        contentPlaceholder: "Explícanos con detalle...",
                        submit: "Enviar Mensaje",
                        submitting: "Enviando...",
                        successMessage: "¡Gracias! Tu mensaje ha sido enviado al equipo de desarrollo.",
                        errorAuth: "Debes iniciar sesión para enviar una sugerencia.",
                        errorGeneric: "Hubo un error al enviar tu mensaje. Inténtalo de nuevo."
                    },
                    game: {
                        popular: "Juegos Populares",
                        search: "Buscar juegos...",
                        allGames: "Todos los Juegos",
                        noResults: "No se encontraron juegos",
                        filters: {
                            category: "Categoría",
                            all: "Todos",
                            action: "Acción",
                            arcade: "Arcade",
                            rpg: "RPG",
                            puzzle: "Puzle"
                        },
                        players: "jugadores",
                        filtersLabel: "Filtros:",
                        gamesCount: "juegos"
                    },
                    genres: {
                        arcade: "Arcade",
                        action: "Acción",
                        rpg: "RPG",
                        puzzle: "Puzle"
                    },
                    gameplay: {
                        loading: "Cargando juego...",
                        notFound: "No se encontró el juego.",
                        noGenre: "Sin género",
                        viewRanking: "Ver ranking",
                        myScore: "Mi score",
                        chat: "Chat",
                        history: "Historial",
                        noMessages: "Sin mensajes todavía.",
                        writeMessage: "Escribe un mensaje...",
                        send: "Enviar",
                        noMovesRequired: "Este juego no requiere historial de movimientos.",
                        noMovesYet: "Sin movimientos aún.",
                        backToGames: "Volver a juegos",
                        rules: "Reglas",
                        rulesTitle: "Reglas del juego",
                        rulesLoading: "Cargando reglas...",
                        rulesError: "No se pudieron cargar las reglas.",
                        backButton: "Volver"
                    },
                    ranking: {
                        currentSeason: "Temporada Actual",
                        title: "Ranking Global",
                        subtitle: "Asciende de liga en liga hasta alcanzar el nivel Ray-Tracing.",
                        selectGame: "Selecciona un juego",
                        unknownGame: "Juego Desconocido",
                        noScoresTitle: "Aún no hay puntuaciones",
                        noScoresDesc: "¡Sé el primero en jugar y corona el Top 1!",
                        you: "(Tú)",
                        colPos: "Pos",
                        colPlayer: "Jugador",
                        colTier: "Liga / Rango",
                        colScore: "Puntuación",
                        yourPosition: "Tu posición actual",
                        keepPlaying: "Sigue jugando para subir de liga"
                    },
                    chat: {
                        unauthorizedTitle: "¡Alto ahí!",
                        unauthorizedDesc: "Para poder chatear con otros usuarios y acceder a tus mensajes privados, necesitas iniciar sesión en tu cuenta.",
                        loginButton: "Ir a Iniciar Sesión",
                        myStatus: "Mi estado:",
                        status: {
                            online: "Disponible",
                            away: "Ausente",
                            busy: "Ocupado",
                            offline: "Invisible",
                            disconnected: "Desconectado"
                        },
                        messagesTitle: "Mensajes",
                        addFriendTooltip: "Añadir amigo",
                        selectFriend: "Selecciona un amigo de la lista para empezar a chatear.",
                        errorLoading: "Hubo un error al preparar el chat. Inténtalo de nuevo.",
                        breakIce: "¡Rompe el hielo!",
                        firstMessage: "Envía el primer mensaje a {{name}}.",
                        placeholder: "Escribe un mensaje a {{name}}..."
                    },
                    home: {
                        splitHero: {
                            one: {
                                imageAlt: "Producto",
                                prefix: "As el mundo gaming evoluciona, en",
                                brand: "Made",
                                suffix: "4Gamers tú también puedes hacerlo."
                            },
                            two: {
                                imageAlt: "Producto",
                                prefix: "Empieza desde abajo, compite con jugadores de tu nivel y alcanza la",
                                highlight: "Cima"
                            },
                            three: {
                                imageAlt: "Producto",
                                highlight: "COMPITE, PRACTICA",
                                suffix: " y llegarás a ser el mejor."
                            }
                        },
                        ranks: {
                            title: "Escala en nuestra clasificación",
                            firstButton: "Comenzar  ➜"
                        }
                    },
                    account: {
                        locale: "es-ES",
                        common: {
                            cancel: "Cancelar",
                            save: "Guardar"
                        },
                        alerts: {
                            saveConfigError: "Hubo un error al guardar la configuración.",
                            emptyUsername: "El nombre de usuario no puede estar vacío.",
                            saveUsernameError: "Hubo un error al guardar. Es posible que ese nombre de usuario ya esté en uso.",
                            avatarUpdated: "Foto de perfil actualizada con éxito.",
                            avatarUploadError: "Error al subir la imagen",
                            passwordChanged: "Contraseña cambiada exitosamente.",
                            profileUpdated: "Perfil actualizado exitosamente.",
                            profileUpdateError: "Error al actualizar el perfil",
                            reportSent: "Reporte enviado correctamente.",
                            reportError: "No se pudo enviar el reporte."
                        },
                        states: {
                            profileLoadError: "No se pudo cargar el perfil. Asegúrate de haber iniciado sesión."
                        },
                        sidebar: {
                            title: "Mi Cuenta",
                            dashboard: "Panel",
                            personal: "Personal",
                            friends: "Amigos",
                            payments: "Pagos",
                            security: "Seguridad",
                            support: "Soporte",
                            matches: "Partidas",
                            stats: "Estadisticas",
                            achievements: "Logros"
                        },
                        dashboard: {
                            defaultUser: "Usuario",
                            role: "Rol",
                            defaultRole: "Jugador",
                            noLocation: "Sin localización",
                            lastGames: "Últimas partidas",
                            unknownGame: "Juego desconocido",
                            vs: "Vs.",
                            defaultOpponent: "OpponentName",
                            status: "Estado",
                            finished: "Finalizado",
                            bestRecords: "Mis Mejores Marcas",
                            achievements: "Mis Logros",
                            noAchievements: "Aun no has desbloqueado ningun logro.",
                            achievementFallbackTitle: "Logro desbloqueado",
                            achievementFallbackDescription: "Este logro no tiene descripcion disponible.",
                            recentGames: "Últimas partidas",
                            noRecentGames: "No hay partidas recientes registradas.",
                            score: "Puntos"
                        },
                        stats: {
                            title: "Estadisticas",
                            subtitle: "Analisis detallado de tu rendimiento en juegos.",
                            totalMatches: "Partidas totales",
                            highestScore: "Puntuacion maxima",
                            favoriteGame: "Juego favorito",
                            favoriteGamePlays: "{{count}} partidas jugadas",
                            gamesChart: "Partidas por juego",
                            recentActivity: "Actividad reciente",
                            matches: "Partidas",
                            emptyTitle: "Aun no hay estadisticas",
                            emptyDescription: "Juega algunas partidas para empezar a ver tus graficas.",
                            emptyActivity: "Aun no hay actividad reciente."
                        },
                        personal: {
                            noUsername: "Usuario Sin Nombre",
                            name: "Nombre",
                            lastName: "Apellido",
                            username: "Usuario",
                            email: "Correo",
                            birthDate: "Fecha de nacimiento",
                            phone: "Teléfono",
                            notDefined: "No definido"
                        },
                        friends: {
                            title: "Amigos",
                            searchPlaceholder: "Buscar amigo...",
                            sendMessage: "Enviar mensaje",
                            noResults: "No se encontraron amigos con ese filtro."
                        },
                        payments: {
                            title: "Pagos",
                            subscriptionType: "Tipo de suscripción",
                            defaultSubscription: "Pro Gamer Monthly",
                            paymentMethods: "Métodos de pago",
                            defaultMethod: "Predeterminado",
                            addMethod: "Agregar nuevo método",
                            subscriptionInfo: "Info de la suscripción",
                            benefitEarlyAccess: "Permite acceso temprano a juegos",
                            benefitLeagues: "Permite crear ligas",
                            renewalNote: "La suscripción se renueva automáticamente al final de cada periodo."
                        },
                        support: {
                            title: "Soporte",
                            subtitle: "Consulta tus tickets y reportes enviados al equipo.",
                            openTicket: "Abrir ticket",
                            loading: "Cargando historial de soporte...",
                            reason: "Motivo",
                            unknownUser: "Usuario desconocido",
                            unknownGame: "Juego desconocido",
                            emptyTickets: "Todavía no has abierto ningún ticket.",
                            emptyUserReports: "Todavía no has reportado ningún jugador.",
                            emptyGameReports: "Todavía no has reportado ningún juego.",
                            tabs: {
                                tickets: "Tickets",
                                users: "Jugadores",
                                games: "Juegos"
                            },
                            status: {
                                pending: "Pendiente"
                            }
                        },
                        security: {
                            title: "Seguridad",
                            personalSection: "Cuenta personal",
                            changePassword: "Cambiar contraseña",
                            accountInfo: "Información de la cuenta",
                            deactivateAccount: "Desactivar cuenta",
                            accountSecuritySection: "Seguridad de la cuenta",
                            enable2fa: "Activar doble factor",
                            changePaymentMethod: "Cambiar método de pago",
                            verifyEmail: "Verificar correo electrónico",
                            socialSupportSection: "Social y soporte",
                            reportPlayer: "Reportar jugador",
                            reportGame: "Reportar juego",
                            reportIncident: "Reportar incidente",
                            openTicket: "Abrir ticket",
                            friendPrivacy: "Privacidad de amistad",
                            requestsEnabled: "Recibiendo solicitudes",
                            requestsBlocked: "Solicitudes bloqueadas",
                            passwords: {
                                currentPassword: "Contraseña actual",
                                enterCurrentPassword: "Introduce tu contraseña actual",
                                newPassword: "Nueva contraseña",
                                enterNewPassword: "Introduce tu nueva contraseña",
                                confirmPassword: "Confirmar contraseña",
                                confirmNewPassword: "Confirma tu nueva contraseña",
                                allFieldsRequired: "Todos los campos son obligatorios",
                                minLength: "La contraseña debe tener al menos 8 caracteres",
                                passwordMismatch: "Las contraseñas no coinciden",
                                invalidCurrentPassword: "La contraseña actual no es correcta",
                                changeError: "Error al cambiar la contraseña"
                            },
                            personalInfo: {
                                requiredFields: "El nombre y apellido son obligatorios",
                                enterFirstName: "Introduce tu nombre",
                                enterLastName: "Introduce tu apellido",
                                emailNotEditable: "El email no se puede cambiar desde aquí"
                            },
                            reportModal: {
                                title: "Reportar jugador",
                                targetUser: "Jugador",
                                selectUser: "Selecciona un jugador",
                                searchPlaceholder: "Busca por nombre de usuario (min. 2 caracteres)",
                                selectedUser: "Seleccionado: {{username}}",
                                searching: "Buscando jugadores...",
                                noResults: "No se encontraron jugadores con ese nombre.",
                                reason: "Motivo",
                                selectReason: "Selecciona un motivo",
                                details: "Detalles",
                                detailsPlaceholder: "Describe brevemente lo ocurrido...",
                                submit: "Enviar reporte",
                                reasons: {
                                    cheating: "Trampas",
                                    abuse: "Lenguaje ofensivo",
                                    spam: "Spam",
                                    harassment: "Acoso",
                                    other: "Otro"
                                }
                            },
                            reportGameModal: {
                                title: "Reportar juego",
                                targetGame: "Juego",
                                selectedGameLabel: "Juego seleccionado",
                                changeSelection: "Cambiar",
                                selectGame: "Selecciona un juego",
                                searchPlaceholder: "Busca por nombre del juego (min. 2 caracteres)",
                                searching: "Buscando juegos...",
                                noResults: "No se encontraron juegos con ese nombre.",
                                defaultGame: "Juego sin titulo",
                                noMetadata: "Sin informacion adicional",
                                reason: "Motivo",
                                selectReason: "Selecciona un motivo",
                                details: "Detalles",
                                detailsPlaceholder: "Describe brevemente el problema del juego...",
                                submit: "Enviar reporte",
                                reasons: {
                                    bug: "Error o bug",
                                    inappropriate: "Contenido inapropiado",
                                    brokenLink: "No carga o enlace roto",
                                    copyright: "Problema de derechos",
                                    other: "Otro"
                                }
                            },
                            ticketModal: {
                                title: "Abrir ticket de soporte",
                                subject: "Asunto",
                                subjectPlaceholder: "Ej: Problema al iniciar una partida",
                                category: "Categoría",
                                message: "Descripción",
                                messagePlaceholder: "Cuéntanos qué ocurre con el mayor detalle posible...",
                                requiredFields: "El asunto y la descripción son obligatorios.",
                                createError: "No se pudo abrir el ticket.",
                                created: "Ticket {{ticketNumber}} abierto correctamente.",
                                submit: "Enviar ticket",
                                categories: {
                                    technical: "Problema técnico",
                                    payments: "Pagos y facturación",
                                    abuse: "Denunciar un abuso",
                                    other: "Otro"
                                }
                            }
                        },
                        avatarPolicy: {
                            title: "Normativa de imágenes",
                            description: "Antes de subir una nueva foto de perfil, por favor recuerda las normas de la comunidad para asegurar un entorno agradable para todos:",
                            rule1: "No se permiten imágenes con contenido adulto o violento",
                            rule2: "Prohibido material ofensivo, discriminatorio o de odio",
                            rule3: "Cualquier infracción resultará en la eliminación de la foto o de la cuenta",
                            accept: "He leído y acepto"
                        }
                    },
                    dashboard: {
                        welcomePrefix: "Bienvenido,",
                        userFallback: "Jugador",
                        marquee: {
                            play: "JUEGA",
                            chat: "CHATEA",
                            compete: "COMPITE",
                            climb: "ESCALA"
                        }
                    },
                    seo: {
                        default: {
                            title: "Plataforma de videojuegos",
                            description: "Make4Gamers es tu plataforma para descubrir juegos, competir en rankings y conectar con la comunidad gamer."
                        },
                        home: {
                            title: "Inicio",
                            description: "Descubre Make4Gamers, mejora tus habilidades y conecta con jugadores de tu nivel."
                        },
                        games: {
                            title: "Juegos",
                            description: "Explora el catalogo de juegos, aplica filtros y encuentra tu proximo reto en Make4Gamers."
                        },
                        ranking: {
                            title: "Ranking",
                            description: "Consulta la clasificacion y sube posiciones compitiendo en Make4Gamers."
                        },
                        login: {
                            title: "Iniciar sesion",
                            description: "Accede a tu cuenta de Make4Gamers para guardar progreso y usar funciones sociales."
                        },
                        register: {
                            title: "Registro",
                            description: "Crea tu cuenta en Make4Gamers y empieza a competir con la comunidad."
                        },
                        recoverPassword: {
                            title: "Recuperar contrasena",
                            description: "Restablece tu contrasena de forma segura para volver a tu cuenta Make4Gamers."
                        },
                        chat: {
                            title: "Chat",
                            description: "Habla con tus amigos y coordina partidas desde el chat de Make4Gamers."
                        },
                        account: {
                            title: "Cuenta",
                            description: "Gestiona tu perfil, preferencias y datos de cuenta en Make4Gamers."
                        },
                        gameplay: {
                            title: "Partida",
                            description: "Juega y mejora tus resultados en Make4Gamers con seguimiento de puntuacion."
                        }
                    }
                }
            },
            en: {
                translation: {
                    nav: {
                        games: "Games",
                        ranking: "Ranking",
                        stats: "Stats",
                        chat: "Chat",
                        account: "Account",
                        logout: "Sign Out"
                    },
                    admin: {
                        management: "Management",
                        panelButton: "Admin",
                        panelTitle: "Administration panel",
                        panelSubtitle: "Centralized platform management.",
                        dashboard: "Dashboard",
                        devRequests: "Dev requests",
                        pendingTickets: "Pending tickets",
                        pendingSuggestions: "Suggestions in review",
                        pendingDevRequests: "Pending dev requests",
                        backHome: "Back to home",
                        loading: "Loading administration panel...",
                        requests: {
                            loading: "Loading requests...",
                            title: "Developer requests",
                            subtitle: "Manage approvals and rejections.",
                            empty: "No requests found.",
                            unknownUser: "Unknown user",
                            accept: "Accept",
                            reject: "Reject"
                        },
                        wordFilterPage: {
                            loading: "Loading...",
                            title: "Chat Filter",
                            subtitle: "Manage offensive words censored automatically.",
                            placeholder: "Type a word",
                            add: "Add",
                            added: "Word added to filter",
                            deleted: "Word removed"
                        },
                        suggestionsPage: {
                            checking: "Checking permissions...",
                            accessDenied: "Access denied",
                            accessDeniedDesc: "This area is only for developers",
                            title: "Suggestions panel",
                            subtitle: "Manage community ideas and reports",
                            total_one: "Total: {{count}} message",
                            total_other: "Total: {{count}} messages",
                            empty: "No suggestions",
                            unknownUser: "Unknown user",
                            reviewing: "Reviewing",
                            accept: "Accept",
                            reject: "Discard"
                        },
                        ticketsPage: {
                            loading: "Loading support panel...",
                            accessDenied: "Access denied",
                            accessDeniedDesc: "This area is only for support and developers",
                            title: "Support panel",
                            subtitle: "Manage and resolve user tickets",
                            empty: "No tickets match current filters",
                            unknownUser: "Unknown user",
                            reviewing: "Reviewing",
                            resolve: "Mark resolved"
                        },
                        formulasPage: {
                            title: "Formula Lab",
                            subtitle: "Adjust game economy and scoring in real time.",
                            previewTitle: "Multiplier Preview",
                            points: "points",
                            previewText: {
                                beforeScore: "If a player wins a match worth",
                                beforeMultiplier: "with the current multiplier",
                                beforeTotal: "they will receive a total of",
                                afterTotal: "for the ranking."
                            },
                            success: "Formulas updated and applied in real time!",
                            error: "There was an error saving the settings.",
                            saving: "Saving...",
                            saveApply: "Save and Apply Formulas"
                        },
                        formulas: "Formulas",
                        tickets: "Tickets",
                        suggestions: "Suggestions",
                        wordFilter: "Word Filter"
                    },
                    developer: {
                        layout: {
                            loading: "Loading developer panel…",
                            portalBadge: "Developer Portal",
                            title: "Developer Panel",
                            subtitle: "Manage and track your contributions to M4G.",
                            backHome: "Back to home",
                            contactPrompt: "Questions or issues?",
                            contactLink: "Contact the team",
                            nav: { dashboard: "Dashboard", games: "My games", stats: "Stats" }
                        },
                        status: {
                            published: "Published", review: "In review", rejected: "Rejected",
                            draft: "Draft", inactive: "Inactive", unknown: "Unknown"
                        },
                        dashboard: {
                            verifiedBadge: "Verified Developer",
                            welcome: "Welcome to the team at",
                            welcomeDesc: "From here you can manage your games, track their progress and check the official documentation.",
                            manualLink: "Developer Manual",
                            cards: { total: "Total", published: "Published", review: "In review", rejected: "Rejected" },
                            drafts_one: "{{count}} game in draft",
                            drafts_other: "{{count}} games in draft",
                            draftsDesc: "Pending submission for review",
                            viewGames: "View games",
                            recentTitle: "My recent games",
                            noGames: "You haven't uploaded any games yet."
                        },
                        games: {
                            title: "My games",
                            count_one: "{{count}} game", count_other: "{{count}} games",
                            addGame: "Add game",
                            emptyTitle: "You haven't published any games yet",
                            emptyDesc: "Start now and reach thousands of players on M4G.",
                            publishFirst: "Publish my first game",
                            noDescription: "No description", play: "Play", edit: "Edit"
                        },
                        stats: {
                            title: "My games stats",
                            empty: "No games to show stats for.",
                            totalPlays: "Total plays", uniquePlayers: "Unique players", avgRating: "Average rating",
                            chartTitle: "Plays by game", tableTitle: "Breakdown by game",
                            colGame: "Game", colPlays: "Plays", colUnique: "Unique players", colRating: "Rating"
                        },
                        manual: {
                            backToPanel: "Back to panel",
                            title: "Developer Manual",
                            subtitle: "Official M4G technical documentation for verified developers.",
                            searchPlaceholder: "Search the manual…",
                            results_one: "{{count}} section found for",
                            results_other: "{{count}} sections found for",
                            noResults: "No sections match your search.",
                            clearSearch: "Clear search",
                            footerText: "M4G Developer Manual · Last updated: May 2026 ·",
                            footerLink: "Something outdated? Let us know"
                        },
                        gameEdit: {
                            loading: "Loading game…", notFound: "Game not found.",
                            backToGames: "Back to my games", pageTitle: "Edit game",
                            save: "Save changes", saving: "Saving…",
                            saved: "Game updated successfully", saveError: "Error saving",
                            notFoundError: "Game not found", permissionError: "You don't have permission to edit this game",
                            nameRequired: "Name is required",
                            sections: { basic: "Basic information", urlDist: "Game URL and distribution", thumbnail: "Cover image", rules: "Rules document", publication: "Publication" },
                            fields: { title: "Game title", description: "Description", version: "Version", minAge: "Minimum age", price: "Price (€)", genre: "Genre", modes: "Game modes", url: "Hosting URL", dist: "Game dist", thumbnail: "Thumbnail", rules: "New document", currentStatus: "Current status" },
                            hints: { version: "E.g. 1.0.0", minAge: "0 = no restriction", price: "0 = free", url: "Must be HTTPS. Leave empty if uploading dist directly.", dist: ".html, .js, .zip — HTML will be used as game_url", thumbnail: "JPG, PNG or WebP · min. 800×600", rules: "PDF, DOC, DOCX, TXT, MD" },
                            sendToReview: "Submit for review",
                            free: "Free", forAll: "For all ages",
                            orUpload: "or upload the game file",
                            viewCurrentDoc: "View current document",
                            statusNote: "Status can only be changed by the M4G team. To request visibility changes,",
                            contactLink: "contact the team",
                            change: "Change", removeFile: "Remove file", clickOrDrag: "Click or drag here",
                            slugLabel: "Slug",
                            storageNote: "Files stored at"
                        },
                        gameNew: {
                            pageTitle: "Publish new game", backToPortal: "Back to portal",
                            steps: { info: "Information", technical: "Technical", assets: "Assets", review: "Review" },
                            stepTitles: { info: "Basic information", technical: "Technical details", assets: "Game assets", review: "Review and publish" },
                            buttons: { next: "Next", back: "Back", submit: "Publish game", submitting: "Publishing…" },
                            validation: {
                                titleRequired: "Game title is required.",
                                urlOrFile: "You must provide a URL or upload the game file.",
                                urlHttps: "The game URL must use HTTPS.",
                                thumbnailRequired: "A cover image is required.",
                                rulesFormat: "The rules document must be a .md file",
                                imageSize: "Image cannot exceed 2 MB"
                            },
                            uploading: "Uploading files…", creating: "Creating game…",
                            success: "Game submitted for review!", error: "Error publishing game",
                            review: { name: "Name", description: "Description", genre: "Genre", modes: "Modes", version: "Version", minAge: "Min. age", price: "Price", urlDist: "URL / Dist", rules: "Rules (.md)", thumbnail: "Cover image" },
                            values: { forAll: "For all ages", free: "Free", notSpecified: "Not specified", notIndicated: "Not indicated", withoutDoc: "No document", urlConfigured: "URL configured correctly.", fileSelected: "File selected: {{name}}" },
                            orUpload: "or upload the game file",
                            rulesOptional: "rules document (optional)",
                            stepOf: "Step {{step}} of {{total}}", percentComplete: "{{percent}}% complete",
                            reviewTitle: "Game data",
                            initialStatus: "Initial status: Draft. The M4G team will review it before publishing.",
                            change: "Change", removeFile: "Remove file", clickOrDrag: "Click or drag here"
                        }
                    },
                    footer: {
                        description: "The ultimate platform to discover, play and share your favorite gaming experiences.",
                        rights: "All rights reserved.",
                        explore: {
                            title: "Explore",
                            popular: "Popular",
                            new: "New",
                            offers: "Offers"
                        },
                        support: {
                            title: "Support",
                            help: "Help",
                            refunds: "Refunds",
                            contact: "Contact"
                        },
                        legal: {
                            title: "Legal",
                            privacy: "Privacy",
                            terms: "Terms"
                        }
                    },
                    ranking: {
                        currentSeason: "Current Season",
                        title: "Global ranking",
                        subtitle: "Climb from tier to tier until you reach Ray-Tracing level.",
                        selectGame: "Select a game",
                        unknownGame: "Unknown Game",
                        noScoresTitle: "No scores yet",
                        noScoresDesc: "Be the first to play and claim the Top 1!",
                        you: "(You)",
                        colPos: "Pos",
                        colPlayer: "Player",
                        colTier: "Tier / League",
                        colScore: "Score",
                        yourPosition: "Your current position",
                        keepPlaying: "Keep playing to rank up"
                    },
                    auth: {
                        login: "Sign In",
                        register: "Sign Up",
                        email: "Email",
                        password: "Password",
                        confirmPassword: "Confirm Password",
                        fullName: "Full Name",
                        username: "Username",
                        loginButton: "Sign In",
                        registerButton: "Create Account",
                        loading: "Loading...",
                        noAccount: "Don't have an account?",
                        haveAccount: "Already have an account?",
                        loginLink: "Sign in here",
                        registerLink: "Sign up here",
                        forgotPassword: "Forgot your password?",
                        rememberMe: "Remember me",
                        or: "or",
                        continueWithGoogle: "Continue with Google",
                        errors: {
                            emailRequired: "Email is required",
                            invalidEmail: "Email is invalid",
                            passwordRequired: "Password is required",
                            passwordTooShort: "Password must be at least 6 characters",
                            passwordMismatch: "Passwords don't match",
                            nameRequired: "Name is required",
                            usernameRequired: "Username is required"
                        },
                        loginRequiredTitle: "Sign in",
                        loginRequired: "Sign in to save progress and access all features.",
                        recoverPassword: {
                            title: "Recover password",
                            subtitle: "Enter your email and we will send you a link to reset it.",
                            emailLabel: "Email",
                            emailPlaceholder: "you@email.com",
                            invalidEmail: "Please enter a valid email.",
                            success: "Email sent! Check your inbox or spam folder to reset your password.",
                            sending: "Sending...",
                            send: "Send link",
                            remembered: "Remembered your password?",
                            backToLogin: "Back to login"
                        },
                        updatePassword: {
                            title: "Update password",
                            subtitle: "Set a new secure password for your account.",
                            newPasswordLabel: "New password",
                            newPasswordPlaceholder: "At least 8 characters",
                            confirmPasswordLabel: "Confirm password",
                            confirmPasswordPlaceholder: "Repeat your password",
                            invalidOrExpiredLink: "This recovery link is invalid or has expired. Please request a new one.",
                            validateLinkError: "The recovery link could not be validated.",
                            minLength: "Password must be at least 8 characters long.",
                            mismatch: "Passwords do not match.",
                            sessionNotActive: "Your recovery session is not active. Request a new link.",
                            success: "Password updated successfully. Redirecting you to login.",
                            validating: "Validating link...",
                            updating: "Updating...",
                            save: "Save new password",
                            needAnotherLink: "Need another link?",
                            backToRecover: "Back to recover password"
                        }
                    },
                    contact: {
                        title: "Suggestions Box",
                        subtitle: "Help us improve Make4Gamers with your ideas or by reporting issues.",
                        categoryLabel: "What type of message is this?",
                        categories: {
                            idea: "I have an idea or improvement suggestion",
                            bug: "I found a bug",
                            support: "I need help with the platform",
                            other: "Other topic"
                        },
                        contentLabel: "Message details",
                        contentPlaceholder: "Tell us in detail...",
                        submit: "Send Message",
                        submitting: "Sending...",
                        successMessage: "Thank you! Your message has been sent to the development team.",
                        errorAuth: "You must be logged in to send a suggestion.",
                        errorGeneric: "There was an error sending your message. Please try again."
                    },
                    game: {
                        popular: "Popular Games",
                        search: "Search games...",
                        allGames: "All Games",
                        noResults: "No games found",
                        filters: {
                            category: "Category",
                            all: "All",
                            action: "Action",
                            arcade: "Arcade",
                            rpg: "RPG",
                            puzzle: "Puzzle"
                        },
                        players: "players",
                        filtersLabel: "Filters:",
                        gamesCount: "games"
                    },
                    genres: {
                        arcade: "Arcade",
                        action: "Action",
                        rpg: "RPG",
                        puzzle: "Puzzle"
                    },
                    gameplay: {
                        loading: "Loading game...",
                        notFound: "Game not found.",
                        noGenre: "No genre",
                        viewRanking: "View ranking",
                        myScore: "My score",
                        chat: "Chat",
                        history: "History",
                        noMessages: "No messages yet.",
                        writeMessage: "Write a message...",
                        send: "Send",
                        noMovesRequired: "This game does not require move history.",
                        noMovesYet: "No moves yet.",
                        backToGames: "Back to games",
                        rules: "Rules",
                        rulesTitle: "Game Rules",
                        rulesLoading: "Loading rules...",
                        rulesError: "Could not load rules.",
                        backButton: "Back"
                    },
                    chat: {
                        unauthorizedTitle: "Hold on!",
                        unauthorizedDesc: "To chat with other users and access your private messages, you need to sign in to your account.",
                        loginButton: "Go to Sign In",
                        myStatus: "My status:",
                        status: {
                            online: "Online",
                            away: "Away",
                            busy: "Busy",
                            offline: "Invisible",
                            disconnected: "Offline"
                        },
                        messagesTitle: "Messages",
                        addFriendTooltip: "Add friend",
                        selectFriend: "Select a friend from the list to start chatting.",
                        errorLoading: "There was an error setting up the chat. Please try again.",
                        breakIce: "Break the ice!",
                        firstMessage: "Send the first message to {{name}}.",
                        placeholder: "Write a message to {{name}}..."
                    },
                    home: {
                        splitHero: {
                            one: {
                                imageAlt: "Product",
                                prefix: "As the gaming world evolves, in",
                                brand: "Made",
                                suffix: "4Gamers you can do it too."
                            },
                            two: {
                                imageAlt: "Product",
                                prefix: "Start from the bottom, compete with players at your level and reach the",
                                highlight: "Top"
                            },
                            three: {
                                imageAlt: "Product",
                                highlight: "COMPETE, PRACTICE",
                                suffix: " and you will become the best."
                            }
                        },
                        ranks: {
                            title: "Climb our ranking",
                            firstButton: "Start ➜"
                        }
                    },
                    account: {
                        locale: "en-US",
                        common: {
                            cancel: "Cancel",
                            save: "Save"
                        },
                        alerts: {
                            saveConfigError: "There was an error saving the settings.",
                            emptyUsername: "Username cannot be empty.",
                            saveUsernameError: "There was an error saving. That username may already be in use.",
                            avatarUpdated: "Profile picture updated successfully.",
                            avatarUploadError: "Error uploading image",
                            passwordChanged: "Password changed successfully.",
                            profileUpdated: "Profile updated successfully.",
                            profileUpdateError: "Error updating profile",
                            reportSent: "Report sent successfully.",
                            reportError: "Could not send report."
                        },
                        states: {
                            profileLoadError: "Profile could not be loaded. Make sure you are signed in."
                        },
                        sidebar: {
                            title: "My Account",
                            dashboard: "Dashboard",
                            personal: "Personal",
                            friends: "Friends",
                            payments: "Payments",
                            security: "Security",
                            support: "Support",
                            matches: "Matches",
                            stats: "Stats",
                            achievements: "Achievements"
                        },
                        dashboard: {
                            defaultUser: "User",
                            role: "Role",
                            defaultRole: "Player",
                            noLocation: "No location",
                            lastGames: "Last games",
                            unknownGame: "Unknown game",
                            vs: "Vs.",
                            defaultOpponent: "OpponentName",
                            status: "Status",
                            finished: "Finished",
                            bestRecords: "My Best Records",
                            achievements: "My Achievements",
                            noAchievements: "You have not unlocked any achievement yet.",
                            achievementFallbackTitle: "Achievement unlocked",
                            achievementFallbackDescription: "This achievement has no description available.",
                            recentGames: "Recent matches",
                            noRecentGames: "No recent matches recorded.",
                            score: "Score"
                        },
                        stats: {
                            title: "Stats",
                            subtitle: "Detailed analysis of your game performance.",
                            totalMatches: "Total matches",
                            highestScore: "Highest score",
                            favoriteGame: "Favorite game",
                            favoriteGamePlays: "{{count}} matches played",
                            gamesChart: "Matches by game",
                            recentActivity: "Recent activity",
                            matches: "Matches",
                            emptyTitle: "No stats yet",
                            emptyDescription: "Play a few matches to start seeing your charts.",
                            emptyActivity: "No recent activity yet."
                        },
                        personal: {
                            noUsername: "Unnamed user",
                            name: "Name",
                            lastName: "Last name",
                            username: "Username",
                            email: "Email",
                            birthDate: "Birth date",
                            phone: "Phone",
                            notDefined: "Not defined"
                        },
                        friends: {
                            title: "Friends",
                            searchPlaceholder: "Search friend...",
                            sendMessage: "Send message",
                            noResults: "No friends found for that filter."
                        },
                        payments: {
                            title: "Payments",
                            subscriptionType: "Subscription type",
                            defaultSubscription: "Pro Gamer Monthly",
                            paymentMethods: "Payment methods",
                            defaultMethod: "Default",
                            addMethod: "Add new method",
                            subscriptionInfo: "Subscription info",
                            benefitEarlyAccess: "Early access to games",
                            benefitLeagues: "Create leagues",
                            renewalNote: "Subscription renews automatically at the end of each billing period."
                        },
                        support: {
                            title: "Support",
                            subtitle: "Review your tickets and reports sent to the team.",
                            openTicket: "Open ticket",
                            loading: "Loading support history...",
                            reason: "Reason",
                            unknownUser: "Unknown user",
                            unknownGame: "Unknown game",
                            emptyTickets: "You have not opened any tickets yet.",
                            emptyUserReports: "You have not reported any players yet.",
                            emptyGameReports: "You have not reported any games yet.",
                            tabs: {
                                tickets: "Tickets",
                                users: "Players",
                                games: "Games"
                            },
                            status: {
                                pending: "Pending"
                            }
                        },
                        security: {
                            title: "Security",
                            personalSection: "Personal account",
                            changePassword: "Change password",
                            accountInfo: "Account information",
                            deactivateAccount: "Deactivate account",
                            accountSecuritySection: "Account security",
                            enable2fa: "Enable two-factor authentication",
                            changePaymentMethod: "Change payment method",
                            verifyEmail: "Verify email",
                            socialSupportSection: "Social and support",
                            reportPlayer: "Report player",
                            reportGame: "Report game",
                            reportIncident: "Report incident",
                            openTicket: "Open ticket",
                            friendPrivacy: "Friend request privacy",
                            requestsEnabled: "Receiving requests",
                            requestsBlocked: "Requests blocked",
                            passwords: {
                                currentPassword: "Current password",
                                enterCurrentPassword: "Enter your current password",
                                newPassword: "New password",
                                enterNewPassword: "Enter your new password",
                                confirmPassword: "Confirm password",
                                confirmNewPassword: "Confirm your new password",
                                allFieldsRequired: "All fields are required",
                                minLength: "Password must be at least 8 characters",
                                passwordMismatch: "Passwords do not match",
                                invalidCurrentPassword: "Current password is incorrect",
                                changeError: "Error changing password"
                            },
                            personalInfo: {
                                requiredFields: "Name and surname are required",
                                enterFirstName: "Enter your name",
                                enterLastName: "Enter your surname",
                                emailNotEditable: "Email cannot be changed from here"
                            },
                            reportModal: {
                                title: "Report player",
                                targetUser: "Player",
                                selectUser: "Select a player",
                                searchPlaceholder: "Search by username (min. 2 characters)",
                                selectedUser: "Selected: {{username}}",
                                searching: "Searching players...",
                                noResults: "No players found with that username.",
                                reason: "Reason",
                                selectReason: "Select a reason",
                                details: "Details",
                                detailsPlaceholder: "Briefly describe what happened...",
                                submit: "Send report",
                                reasons: {
                                    cheating: "Cheating",
                                    abuse: "Abusive language",
                                    spam: "Spam",
                                    harassment: "Harassment",
                                    other: "Other"
                                }
                            },
                            reportGameModal: {
                                title: "Report game",
                                targetGame: "Game",
                                selectedGameLabel: "Selected game",
                                changeSelection: "Change",
                                selectGame: "Select a game",
                                searchPlaceholder: "Search by game title (min. 2 characters)",
                                searching: "Searching games...",
                                noResults: "No games found with that title.",
                                defaultGame: "Untitled game",
                                noMetadata: "No additional information",
                                reason: "Reason",
                                selectReason: "Select a reason",
                                details: "Details",
                                detailsPlaceholder: "Briefly describe the game issue...",
                                submit: "Send report",
                                reasons: {
                                    bug: "Bug or error",
                                    inappropriate: "Inappropriate content",
                                    brokenLink: "Won't load or broken link",
                                    copyright: "Copyright issue",
                                    other: "Other"
                                }
                            },
                            ticketModal: {
                                title: "Open support ticket",
                                subject: "Subject",
                                subjectPlaceholder: "Example: Problem starting a match",
                                category: "Category",
                                message: "Description",
                                messagePlaceholder: "Tell us what is happening with as much detail as possible...",
                                requiredFields: "Subject and description are required.",
                                createError: "The ticket could not be opened.",
                                created: "Ticket {{ticketNumber}} opened successfully.",
                                submit: "Send ticket",
                                categories: {
                                    technical: "Technical issue",
                                    payments: "Payments and billing",
                                    abuse: "Report abuse",
                                    other: "Other"
                                }
                            }
                        },
                        avatarPolicy: {
                            title: "Image policy",
                            description: "Before uploading a new profile photo, please keep these community guidelines in mind to maintain a friendly environment:",
                            rule1: "Images with adult or violent content are not allowed",
                            rule2: "Offensive, discriminatory, or hateful material is forbidden",
                            rule3: "Any violation may result in profile image or account removal",
                            accept: "I have read and accept"
                        }
                    },
                    dashboard: {
                        welcomePrefix: "Welcome,",
                        userFallback: "Player",
                        marquee: {
                            play: "PLAY",
                            chat: "CHAT",
                            compete: "COMPETE",
                            climb: "CLIMB"
                        }
                    },
                    seo: {
                        default: {
                            title: "Gaming platform",
                            description: "Make4Gamers helps you discover games, climb rankings, and connect with the gaming community."
                        },
                        home: {
                            title: "Home",
                            description: "Discover Make4Gamers, level up your skills, and connect with players at your level."
                        },
                        games: {
                            title: "Games",
                            description: "Browse the game catalog, apply filters, and find your next challenge on Make4Gamers."
                        },
                        ranking: {
                            title: "Ranking",
                            description: "Check the leaderboard and climb positions by competing on Make4Gamers."
                        },
                        login: {
                            title: "Sign in",
                            description: "Access your Make4Gamers account to save progress and use social features."
                        },
                        register: {
                            title: "Sign up",
                            description: "Create your Make4Gamers account and start competing with the community."
                        },
                        recoverPassword: {
                            title: "Recover password",
                            description: "Reset your password securely to get back into your Make4Gamers account."
                        },
                        chat: {
                            title: "Chat",
                            description: "Talk with friends and coordinate matches in the Make4Gamers chat."
                        },
                        account: {
                            title: "Account",
                            description: "Manage your profile, preferences, and account data on Make4Gamers."
                        },
                        gameplay: {
                            title: "Match",
                            description: "Play and improve your scores with match tracking on Make4Gamers."
                        }
                    }
                }
            },
            zh: {
                translation: {
                    nav: {
                        games: "游戏",
                        ranking: "排行榜",
                        stats: "统计数据",
                        chat: "聊天",
                        account: "账户",
                        logout: "退出登录"
                    },
                    admin: {
                        management: "管理",
                        panelButton: "管理",
                        panelTitle: "管理面板",
                        panelSubtitle: "平台集中管理。",
                        dashboard: "面板",
                        devRequests: "开发者申请",
                        pendingTickets: "待处理工单",
                        pendingSuggestions: "审核中建议",
                        pendingDevRequests: "待处理开发者申请",
                        backHome: "返回首页",
                        loading: "正在加载管理面板...",
                        requests: {
                            loading: "正在加载申请...",
                            title: "开发者申请",
                            subtitle: "管理通过与拒绝。",
                            empty: "暂无申请。",
                            unknownUser: "未知用户",
                            accept: "通过",
                            reject: "拒绝"
                        },
                        wordFilterPage: {
                            loading: "加载中...",
                            title: "聊天过滤",
                            subtitle: "管理自动屏蔽的敏感词。",
                            placeholder: "输入词语",
                            add: "添加",
                            added: "词语已加入过滤",
                            deleted: "词语已删除"
                        },
                        suggestionsPage: {
                            checking: "正在验证权限...",
                            accessDenied: "拒绝访问",
                            accessDeniedDesc: "此区域仅限开发者",
                            title: "建议面板",
                            subtitle: "管理社区建议与反馈",
                            total_one: "总计：{{count}} 条消息",
                            total_other: "总计：{{count}} 条消息",
                            empty: "暂无建议",
                            unknownUser: "未知用户",
                            reviewing: "审核中",
                            accept: "通过",
                            reject: "丢弃"
                        },
                        ticketsPage: {
                            loading: "正在加载支持面板...",
                            accessDenied: "拒绝访问",
                            accessDeniedDesc: "此区域仅限支持团队和开发者",
                            title: "支持面板",
                            subtitle: "管理并处理用户工单",
                            empty: "没有符合筛选条件的工单",
                            unknownUser: "未知用户",
                            reviewing: "审核中",
                            resolve: "标记为已解决"
                        },
                        formulasPage: {
                            title: "公式实验室",
                            subtitle: "实时调整游戏经济与得分规则。",
                            previewTitle: "倍率预览",
                            points: "分",
                            previewText: {
                                beforeScore: "如果玩家当前赢得一局",
                                beforeMultiplier: "按当前倍率",
                                beforeTotal: "将获得总计",
                                afterTotal: "用于排行榜。"
                            },
                            success: "公式已更新并实时生效！",
                            error: "保存配置时发生错误。",
                            saving: "保存中...",
                            saveApply: "保存并应用公式"
                        },
                        formulas: "公式",
                        tickets: "工单",
                        suggestions: "建议",
                        wordFilter: "词语过滤"
                    },
                    developer: {
                        layout: {
                            loading: "正在加载开发者面板…",
                            portalBadge: "Developer Portal",
                            title: "开发者面板",
                            subtitle: "管理并追踪你对 M4G 的贡献。",
                            backHome: "返回首页",
                            contactPrompt: "有疑问或问题？",
                            contactLink: "联系团队",
                            nav: { dashboard: "面板", games: "我的游戏", stats: "统计" }
                        },
                        status: {
                            published: "已发布", review: "审核中", rejected: "已拒绝",
                            draft: "草稿", inactive: "未激活", unknown: "未知"
                        },
                        dashboard: {
                            verifiedBadge: "已认证开发者",
                            welcome: "欢迎加入",
                            welcomeDesc: "在这里你可以管理游戏、跟踪进展并查阅官方文档。",
                            manualLink: "开发者手册",
                            cards: { total: "总计", published: "已发布", review: "审核中", rejected: "已拒绝" },
                            drafts_one: "{{count}} 个草稿游戏",
                            drafts_other: "{{count}} 个草稿游戏",
                            draftsDesc: "待提交审核",
                            viewGames: "查看游戏",
                            recentTitle: "最近的游戏",
                            noGames: "你还没有上传任何游戏。"
                        },
                        games: {
                            title: "我的游戏",
                            count_one: "{{count}} 款游戏", count_other: "{{count}} 款游戏",
                            addGame: "添加游戏",
                            emptyTitle: "你还没有发布任何游戏",
                            emptyDesc: "立即开始，在 M4G 吸引数千玩家。",
                            publishFirst: "发布我的第一款游戏",
                            noDescription: "暂无描述", play: "游玩", edit: "编辑"
                        },
                        stats: {
                            title: "我的游戏统计",
                            empty: "没有可显示统计的游戏。",
                            totalPlays: "总对局数", uniquePlayers: "独立玩家数", avgRating: "平均评分",
                            chartTitle: "各游戏对局数", tableTitle: "各游戏详情",
                            colGame: "游戏", colPlays: "对局数", colUnique: "独立玩家", colRating: "评分"
                        },
                        manual: {
                            backToPanel: "返回面板",
                            title: "开发者手册",
                            subtitle: "M4G 官方技术文档，专供已认证开发者使用。",
                            searchPlaceholder: "搜索手册…",
                            results_one: "找到 {{count}} 个板块，关键词：",
                            results_other: "找到 {{count}} 个板块，关键词：",
                            noResults: "没有与搜索匹配的板块。",
                            clearSearch: "清除搜索",
                            footerText: "M4G 开发者手册 · 最后更新：2026年5月 ·",
                            footerLink: "内容过时？告诉我们"
                        },
                        gameEdit: {
                            loading: "正在加载游戏…", notFound: "未找到游戏。",
                            backToGames: "返回我的游戏", pageTitle: "编辑游戏",
                            save: "保存更改", saving: "保存中…",
                            saved: "游戏更新成功", saveError: "保存出错",
                            notFoundError: "未找到游戏", permissionError: "你没有权限编辑此游戏",
                            nameRequired: "名称为必填项",
                            sections: { basic: "基本信息", urlDist: "游戏 URL 和分发", thumbnail: "封面图", rules: "规则文档", publication: "发布" },
                            fields: { title: "游戏标题", description: "描述", version: "版本", minAge: "最低年龄", price: "价格 (€)", genre: "类型", modes: "游戏模式", url: "托管 URL", dist: "游戏 Dist", thumbnail: "缩略图", rules: "新文档", currentStatus: "当前状态" },
                            hints: { version: "例：1.0.0", minAge: "0 = 不限年龄", price: "0 = 免费", url: "必须是 HTTPS。如直接上传 dist 可留空。", dist: ".html、.js、.zip — HTML 将用作 game_url", thumbnail: "JPG、PNG 或 WebP · 最小 800×600", rules: "PDF、DOC、DOCX、TXT、MD" },
                            sendToReview: "提交审核",
                            free: "免费", forAll: "全年龄",
                            orUpload: "或上传游戏文件",
                            viewCurrentDoc: "查看当前文档",
                            statusNote: "状态只能由 M4G 团队更改。如需申请可见性变更，",
                            contactLink: "联系团队",
                            change: "更换", removeFile: "移除文件", clickOrDrag: "点击或拖拽至此",
                            slugLabel: "Slug",
                            storageNote: "文件存储于"
                        },
                        gameNew: {
                            pageTitle: "发布新游戏", backToPortal: "返回开发者门户",
                            steps: { info: "基本信息", technical: "技术", assets: "资源", review: "审阅" },
                            stepTitles: { info: "基本信息", technical: "技术细节", assets: "游戏资源", review: "审阅与发布" },
                            buttons: { next: "下一步", back: "上一步", submit: "发布游戏", submitting: "发布中…" },
                            validation: {
                                titleRequired: "标题为必填项。",
                                urlOrFile: "必须提供 URL 或上传游戏文件。",
                                urlHttps: "游戏 URL 必须使用 HTTPS。",
                                thumbnailRequired: "封面图为必填项。",
                                rulesFormat: "规则文档必须为 .md 格式",
                                imageSize: "图片不能超过 2 MB"
                            },
                            uploading: "正在上传文件…", creating: "正在创建游戏…",
                            success: "游戏已提交审核！", error: "发布游戏时出错",
                            review: { name: "名称", description: "描述", genre: "类型", modes: "模式", version: "版本", minAge: "最低年龄", price: "价格", urlDist: "URL / Dist", rules: "规则 (.md)", thumbnail: "封面图" },
                            values: { forAll: "全年龄", free: "免费", notSpecified: "未指定", notIndicated: "未填写", withoutDoc: "无文档", urlConfigured: "URL 配置正确。", fileSelected: "已选择文件：{{name}}" },
                            orUpload: "或上传游戏文件",
                            rulesOptional: "规则文档（可选）",
                            stepOf: "步骤 {{step}} / {{total}}", percentComplete: "已完成 {{percent}}%",
                            reviewTitle: "游戏数据",
                            initialStatus: "初始状态：草稿。M4G 团队将在发布前进行审核。",
                            change: "更换", removeFile: "移除文件", clickOrDrag: "点击或拖拽至此"
                        }
                    },
                    footer: {
                        description: "发现、玩耍和分享您最喜爱的游戏体验的终极平台。",
                        rights: "版权所有。",
                        explore: {
                            title: "探索",
                            popular: "热门",
                            new: "新品",
                            offers: "优惠"
                        },
                        support: {
                            title: "支持",
                            help: "帮助",
                            refunds: "退款",
                            contact: "联系"
                        },
                        legal: {
                            title: "法律",
                            privacy: "隐私",
                            terms: "条款"
                        }
                    },
                    auth: {
                        login: "登录",
                        register: "注册",
                        email: "电子邮件",
                        password: "密码",
                        confirmPassword: "确认密码",
                        fullName: "全名",
                        username: "用户名",
                        loginButton: "登录",
                        registerButton: "创建账户",
                        loading: "加载中...",
                        noAccount: "没有账户？",
                        haveAccount: "已有账户？",
                        loginLink: "在这里登录",
                        registerLink: "在这里注册",
                        forgotPassword: "忘记密码？",
                        rememberMe: "记住我",
                        or: "或",
                        continueWithGoogle: "使用Google继续",
                        errors: {
                            emailRequired: "电子邮件是必需的",
                            invalidEmail: "电子邮件无效",
                            passwordRequired: "密码是必需的",
                            passwordTooShort: "密码至少需要6个字符",
                            passwordMismatch: "密码不匹配",
                            nameRequired: "名称是必需的",
                            usernameRequired: "用户名是必需的"
                        },
                        loginRequiredTitle: "请登录",
                        loginRequired: "登录后可保存进度并访问所有功能。",
                        recoverPassword: {
                            title: "找回密码",
                            subtitle: "输入你的邮箱，我们会发送一个重置链接。",
                            emailLabel: "电子邮箱",
                            emailPlaceholder: "you@email.com",
                            invalidEmail: "请输入有效的邮箱地址。",
                            success: "邮件已发送！请检查收件箱或垃圾邮件以重置密码。",
                            sending: "发送中...",
                            send: "发送链接",
                            remembered: "想起密码了？",
                            backToLogin: "返回登录"
                        },
                        updatePassword: {
                            title: "更新密码",
                            subtitle: "为你的账户设置一个新的安全密码。",
                            newPasswordLabel: "新密码",
                            newPasswordPlaceholder: "至少 8 个字符",
                            confirmPasswordLabel: "确认密码",
                            confirmPasswordPlaceholder: "再次输入密码",
                            invalidOrExpiredLink: "该恢复链接无效或已过期，请重新申请。",
                            validateLinkError: "无法验证恢复链接。",
                            minLength: "密码至少需要 8 个字符。",
                            mismatch: "两次输入的密码不一致。",
                            sessionNotActive: "恢复会话未激活，请重新申请链接。",
                            success: "密码更新成功，正在跳转到登录页。",
                            validating: "正在验证链接...",
                            updating: "正在更新...",
                            save: "保存新密码",
                            needAnotherLink: "需要新的恢复链接？",
                            backToRecover: "返回找回密码"
                        }
                    },
                    contact: {
                        title: "意见箱",
                        subtitle: "用你的想法或问题报告帮助我们改进 Make4Gamers。",
                        categoryLabel: "这是什么类型的消息？",
                        categories: {
                            idea: "我有一个想法或改进建议",
                            bug: "我发现了一个错误",
                            support: "我需要平台帮助",
                            other: "其他主题"
                        },
                        contentLabel: "消息详情",
                        contentPlaceholder: "请详细说明...",
                        submit: "发送消息",
                        submitting: "发送中...",
                        successMessage: "谢谢！您的消息已发送给开发团队。",
                        errorAuth: "您必须登录才能发送建议。",
                        errorGeneric: "发送消息时出错，请重试。"
                    },
                    game: {
                        popular: "热门游戏",
                        search: "搜索游戏...",
                        allGames: "所有游戏",
                        noResults: "未找到游戏",
                        filters: {
                            category: "类别",
                            all: "全部",
                            action: "动作",
                            arcade: "街机",
                            rpg: "角色扮演",
                            puzzle: "益智"
                        },
                        players: "玩家",
                        filtersLabel: "筛选:",
                        gamesCount: "游戏"
                    },
                    genres: {
                        arcade: "街机",
                        action: "动作",
                        rpg: "角色扮演",
                        puzzle: "益智"
                    },
                    gameplay: {
                        loading: "正在加载游戏...",
                        notFound: "未找到游戏。",
                        noGenre: "无类型",
                        viewRanking: "查看排行榜",
                        myScore: "我的分数",
                        chat: "聊天",
                        history: "历史记录",
                        noMessages: "暂无消息。",
                        writeMessage: "输入消息...",
                        send: "发送",
                        noMovesRequired: "该游戏不需要操作历史。",
                        noMovesYet: "暂无操作记录。",
                        backToGames: "返回游戏列表",
                        rules: "规则",
                        rulesTitle: "游戏规则",
                        rulesLoading: "正在加载规则...",
                        rulesError: "无法加载规则。",
                        backButton: "返回"
                    },
                    ranking: {
                        currentSeason: "当前赛季",
                        title: "全球排名",
                        subtitle: "在各个级别中攀升，直到达到光线追踪级别。",
                        selectGame: "选择一个游戏",
                        unknownGame: "未知游戏",
                        noScoresTitle: "暂无分数",
                        noScoresDesc: "成为第一个玩并占据榜首的人！",
                        you: "(你)",
                        colPos: "排名",
                        colPlayer: "玩家",
                        colTier: "段位 / 联赛",
                        colScore: "分数",
                        yourPosition: "你当前的位置",
                        keepPlaying: "继续游戏以提升排名"
                    },
                    chat: {
                        unauthorizedTitle: "请等一下！",
                        unauthorizedDesc: "要与其他用户聊天并访问您的私人消息，您需要登录您的账户。",
                        loginButton: "去登录",
                        myStatus: "我的状态：",
                        status: {
                            online: "在线",
                            away: "离开",
                            busy: "忙碌",
                            offline: "隐身",
                            disconnected: "离线"
                        },
                        messagesTitle: "消息",
                        addFriendTooltip: "添加好友",
                        selectFriend: "从列表中选择一个好友开始聊天。",
                        errorLoading: "准备聊天时出错，请重试。",
                        breakIce: "打破僵局！",
                        firstMessage: "给 {{name}} 发送第一条消息。",
                        placeholder: "给 {{name}} 发送消息..."
                    },
                    home: {
                        splitHero: {
                            one: {
                                imageAlt: "产品",
                                prefix: "正如游戏世界不断进化，在",
                                brand: "Made",
                                suffix: "4Gamers 你也可以做到。"
                            },
                            two: {
                                imageAlt: "产品",
                                prefix: "从底部开始，与同级玩家竞争并冲向",
                                highlight: "巅峰"
                            },
                            three: {
                                imageAlt: "产品",
                                highlight: "进化",
                                suffix: "，你将成为最强。"
                            }
                        },
                        ranks: {
                            title: "提升我们的排名",
                            firstButton: "开始 ➜"
                        }
                    },
                    account: {
                        locale: "zh-CN",
                        common: {
                            cancel: "取消",
                            save: "保存"
                        },
                        alerts: {
                            saveConfigError: "保存设置时出错。",
                            emptyUsername: "用户名不能为空。",
                            saveUsernameError: "保存时出错，该用户名可能已被占用。",
                            avatarUpdated: "头像更新成功。",
                            avatarUploadError: "上传图片时出错",
                            passwordChanged: "密码已成功更改。",
                            profileUpdated: "个人资料已成功更新。",
                            profileUpdateError: "更新个人资料出错",
                            reportSent: "举报发送成功。",
                            reportError: "无法发送举报。"
                        },
                        states: {
                            profileLoadError: "无法加载个人资料，请确认你已登录。"
                        },
                        sidebar: {
                            title: "我的账户",
                            dashboard: "概览",
                            personal: "个人信息",
                            friends: "好友",
                            payments: "支付",
                            security: "安全",
                            support: "支持",
                            matches: "对局",
                            stats: "统计",
                            achievements: "成就"
                        },
                        dashboard: {
                            defaultUser: "用户",
                            role: "角色",
                            defaultRole: "玩家",
                            noLocation: "未设置位置",
                            lastGames: "最近对局",
                            unknownGame: "未知游戏",
                            vs: "对战",
                            defaultOpponent: "未知对手",
                            status: "状态",
                            finished: "已结束",
                            bestRecords: "我的最佳纪录",
                            achievements: "我的成就",
                            noAchievements: "你还没有解锁任何成就。",
                            achievementFallbackTitle: "已解锁成就",
                            achievementFallbackDescription: "该成就暂无详细说明。",
                            recentGames: "最近对局",
                            noRecentGames: "没有记录的对局。",
                            score: "分数"
                        },
                        stats: {
                            title: "统计",
                            subtitle: "你的游戏表现详细分析。",
                            totalMatches: "总对局",
                            highestScore: "最高分",
                            favoriteGame: "最常玩游戏",
                            favoriteGamePlays: "已玩 {{count}} 场",
                            gamesChart: "各游戏对局数",
                            recentActivity: "最近活动",
                            matches: "对局",
                            emptyTitle: "暂无统计数据",
                            emptyDescription: "先玩几场游戏，就能看到你的统计图表。",
                            emptyActivity: "暂无最近活动。"
                        },
                        personal: {
                            noUsername: "未命名用户",
                            name: "名字",
                            lastName: "姓氏",
                            username: "用户名",
                            email: "邮箱",
                            birthDate: "出生日期",
                            phone: "电话",
                            notDefined: "未定义"
                        },
                        friends: {
                            title: "好友",
                            searchPlaceholder: "搜索好友...",
                            sendMessage: "发送消息",
                            noResults: "没有符合筛选条件的好友。"
                        },
                        payments: {
                            title: "支付",
                            subscriptionType: "订阅类型",
                            defaultSubscription: "Pro Gamer 月度",
                            paymentMethods: "支付方式",
                            defaultMethod: "默认",
                            addMethod: "添加新方式",
                            subscriptionInfo: "订阅信息",
                            benefitEarlyAccess: "可提前体验游戏",
                            benefitLeagues: "可创建联赛",
                            renewalNote: "订阅将在每个计费周期结束时自动续费。"
                        },
                        support: {
                            title: "支持",
                            subtitle: "查看你发送给团队的工单和举报。",
                            openTicket: "打开工单",
                            loading: "正在加载支持历史...",
                            reason: "原因",
                            unknownUser: "未知用户",
                            unknownGame: "未知游戏",
                            emptyTickets: "你还没有打开任何工单。",
                            emptyUserReports: "你还没有举报任何玩家。",
                            emptyGameReports: "你还没有举报任何游戏。",
                            tabs: {
                                tickets: "工单",
                                users: "玩家",
                                games: "游戏"
                            },
                            status: {
                                pending: "待处理"
                            }
                        },
                        security: {
                            title: "安全",
                            personalSection: "个人账户",
                            changePassword: "更改密码",
                            accountInfo: "账户信息",
                            deactivateAccount: "停用账户",
                            accountSecuritySection: "账户安全",
                            enable2fa: "启用双重验证",
                            changePaymentMethod: "更改支付方式",
                            verifyEmail: "验证邮箱",
                            socialSupportSection: "社交与支持",
                            reportPlayer: "举报玩家",
                            reportGame: "举报游戏",
                            reportIncident: "举报事件",
                            friendPrivacy: "好友申请隐私",
                            requestsEnabled: "接收申请中",
                            requestsBlocked: "已屏蔽申请",
                            passwords: {
                                currentPassword: "当前密码",
                                enterCurrentPassword: "输入你的当前密码",
                                newPassword: "新密码",
                                enterNewPassword: "输入你的新密码",
                                confirmPassword: "确认密码",
                                confirmNewPassword: "确认你的新密码",
                                allFieldsRequired: "所有字段都是必需的",
                                minLength: "密码必须至少 8 个字符",
                                passwordMismatch: "密码不匹配",
                                invalidCurrentPassword: "当前密码不正确",
                                changeError: "更改密码出错"
                            },
                            personalInfo: {
                                requiredFields: "名字和姓氏是必需的",
                                enterFirstName: "输入你的名字",
                                enterLastName: "输入你的姓氏",
                                emailNotEditable: "邮箱无法从这里更改"
                            },
                            reportModal: {
                                title: "举报玩家",
                                targetUser: "玩家",
                                selectUser: "选择一名玩家",
                                searchPlaceholder: "按用户名搜索（至少 2 个字符）",
                                selectedUser: "已选择：{{username}}",
                                searching: "正在搜索玩家...",
                                noResults: "未找到该用户名的玩家。",
                                reason: "原因",
                                selectReason: "选择一个原因",
                                details: "详情",
                                detailsPlaceholder: "简要描述发生了什么...",
                                submit: "提交举报",
                                reasons: {
                                    cheating: "作弊",
                                    abuse: "辱骂言论",
                                    spam: "垃圾信息",
                                    harassment: "骚扰",
                                    other: "其他"
                                }
                            }
                        },
                        avatarPolicy: {
                            title: "图片规范",
                            description: "上传新头像前，请遵守社区规范以维护良好环境：",
                            rule1: "禁止上传成人或暴力内容",
                            rule2: "禁止上传冒犯、歧视或仇恨内容",
                            rule3: "违规可能导致头像或账户被移除",
                            accept: "我已阅读并同意"
                        }
                    },
                    dashboard: {
                        welcomePrefix: "欢迎你，",
                        userFallback: "玩家",
                        marquee: {
                            play: "游玩",
                            chat: "聊天",
                            compete: "竞技",
                            climb: "攀升"
                        }
                    },
                    seo: {
                        default: {
                            title: "游戏平台",
                            description: "Make4Gamers 帮助你发现游戏、冲击排行榜并与玩家社区连接。"
                        },
                        home: {
                            title: "首页",
                            description: "探索 Make4Gamers，提升你的实力，并与同水平玩家互动。"
                        },
                        games: {
                            title: "游戏",
                            description: "浏览游戏目录，使用筛选功能，在 Make4Gamers 找到下一场挑战。"
                        },
                        ranking: {
                            title: "排行榜",
                            description: "查看排行榜并通过比赛在 Make4Gamers 提升名次。"
                        },
                        login: {
                            title: "登录",
                            description: "登录 Make4Gamers 账户以保存进度并使用社交功能。"
                        },
                        register: {
                            title: "注册",
                            description: "创建你的 Make4Gamers 账户并开始与社区一起竞技。"
                        },
                        recoverPassword: {
                            title: "找回密码",
                            description: "安全重置密码，重新进入你的 Make4Gamers 账户。"
                        },
                        chat: {
                            title: "聊天",
                            description: "在 Make4Gamers 聊天中与好友沟通并协调对局。"
                        },
                        account: {
                            title: "账户",
                            description: "在 Make4Gamers 管理你的个人资料、偏好设置和账户信息。"
                        },
                        gameplay: {
                            title: "对局",
                            description: "在 Make4Gamers 进行对局并通过成绩追踪持续提升。"
                        }
                    }
                }
            }
        },
        fallbackLng: "es",
        interpolation: { escapeValue: false }
    });

export default i18n;
