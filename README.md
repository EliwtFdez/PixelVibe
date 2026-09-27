# 🎮 PixelVibe — Oficina Virtual Isométrica

> Una oficina virtual retro estilo Gather.Town construida con Phaser 3 + Next.js 14

![PixelVibe Banner](https://img.shields.io/badge/PixelVibe-🎮%20Virtual%20Office-6c63ff?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Phaser](https://img.shields.io/badge/Phaser-3-orange?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ecf8e?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

## ✨ Features

- 🗺️ **Mapa isométrico 16×16** con tiles generados proceduralmente (pixel art)
- 🧑‍💻 **Avatares en tiempo real** via Supabase Realtime
- 💬 **Chat por proximidad** — solo ves mensajes de usuarios a < 300px
- 🎨 **10 colores de avatar** personalizables
- 🔐 **Auth con email y contraseña** via Supabase
- ⚡ **Sincronización cada 200ms** (sin sobrecargar)
- 🏢 **Muebles isométricos**: escritorios, sillas, plantas, lámparas, sofás
- 📡 **Depth sorting automático** — los avatares detrás aparecen detrás
- 🎮 **Controles WASD + flechas** con colisiones y límites
- 📱 **Camera drag** para mover la vista

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend Framework | Next.js 14 (App Router) |
| Game Engine | Phaser 3 (pixel art, isometric) |
| Auth & DB | Supabase (Email Auth + Realtime) |
| Lenguaje | TypeScript 5 |
| Deploy | Vercel |
| Fuentes | Press Start 2P + Inter |

## 🚀 Setup Rápido

### 1. Clona e instala

```bash
git clone https://github.com/Masio84/PixelVibe.git
cd PixelVibe
npm install
```

### 2. Configura Supabase

Crea un proyecto en [supabase.com](https://supabase.com) y ejecuta el schema:

```bash
# En Supabase Dashboard > SQL Editor:
# Copia y ejecuta el contenido de:
supabase/schema.sql
```

### 3. Variables de entorno

Crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Auth por email en Supabase

1. Ve a **Authentication > Sign In / Providers > Email** y verifica que esté activado
2. Opcional: desactiva **Confirm email** si quieres que los usuarios entren sin confirmar su correo
3. En **Authentication > URL Configuration**:
   - **Site URL**: `http://localhost:3000` (o tu dominio en producción)
   - **Redirect URLs**: añade `http://localhost:3000/auth/callback` (y la de producción)

> El servidor SMTP incluido en Supabase tiene un límite bajo de correos por hora. Para producción configura tu propio SMTP en **Authentication > Emails > SMTP Settings**.

### 5. Habilitar Realtime

En **Supabase > Database > Replication**, añade:
- `avatar_positions`
- `messages`

### 6. Corre el proyecto

```bash
npm run dev
# → http://localhost:3000
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Root layout + fuentes
│   ├── globals.css         # Design system completo
│   ├── page.tsx            # Landing / Login
│   ├── office/
│   │   └── page.tsx        # Sala principal (Phaser + HUD + Chat)
│   └── auth/
│       └── callback/
│           └── route.ts    # Callback de confirmación de email
├── components/
│   ├── PhaserGame.tsx      # Wrapper React para Phaser
│   ├── HUD.tsx             # Overlay superior
│   ├── ChatPanel.tsx       # Chat de proximidad
│   └── ProfileModal.tsx    # Editor de perfil
├── game/
│   ├── map.ts              # Layout 16×16 y utilidades iso
│   ├── AvatarManager.ts    # Sistema de sprites de avatares
│   └── scenes/
│       ├── IsometricScene.ts  # Renderizado del mapa
│       └── GameScene.ts       # Movimiento, cámara, sync
└── lib/
    ├── types.ts            # Tipos TypeScript globales
    └── supabase/
        └── client.ts       # Cliente Supabase browser
supabase/
└── schema.sql              # Schema completo con RLS
```

## 🗃️ Base de Datos

### `users`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | FK → auth.users |
| email | TEXT | Email del usuario |
| name | TEXT | Nombre para mostrar |
| avatar_color | TEXT | Color hex del avatar |
| created_at | TIMESTAMPTZ | Timestamp |

### `avatar_positions`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| user_id | UUID | FK → auth.users |
| room_id | TEXT | ID de sala (default: 'main') |
| x, y | FLOAT | Posición en grid |
| direction | TEXT | up/down/left/right |
| name, avatar_color | TEXT | Cache para display |
| updated_at | TIMESTAMPTZ | Para liveness checks |

### `messages`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| user_id | UUID | Autor |
| room_id | TEXT | Sala |
| content | TEXT | Mensaje (max 120 chars) |
| x, y | FLOAT | Posición del emisor |
| name | TEXT | Cache nombre |
| created_at | TIMESTAMPTZ | Timestamp |

## 🌐 Deploy en Vercel

```bash
# 1. Push a GitHub
git push origin main

# 2. En vercel.com importa el repo
# 3. Añade las env vars:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Añade la URL de Vercel en Supabase > Authentication > URL Configuration
```

## 🎮 Controles

| Tecla | Acción |
|-------|--------|
| `W` / `↑` | Mover arriba |
| `S` / `↓` | Mover abajo |
| `A` / `←` | Mover izquierda |
| `D` / `→` | Mover derecha |
| `Arrastrar` | Mover cámara |
| `Enter` | Enviar mensaje en chat |

## 📜 Licencia

MIT © 2026 PixelVibe
