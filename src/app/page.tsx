'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/lib/types';
import { getURL } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === 'auth_failed') {
      setError('El enlace de confirmación no es válido o expiró. Intenta de nuevo.');
    }

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.replace('/office');
      } else {
        setLoading(false);
      }
    });
  }, [router, supabase]);

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSigningIn(true);

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getURL()}auth/callback`,
          data: { full_name: name.trim() || undefined },
        },
      });
      setSigningIn(false);
      if (error) {
        setError(translateAuthError(error.message));
        return;
      }
      if (data.session) {
        // Email confirmation disabled in Supabase — already signed in
        router.replace('/office');
        return;
      }
      setInfo(`Te enviamos un correo a ${email}. Confirma tu cuenta para poder entrar.`);
      setMode('login');
      setPassword('');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(translateAuthError(error.message));
      setSigningIn(false);
      return;
    }
    router.replace('/office');
  };

  if (loading) {
    return (
      <div className="landing-bg">
        <div className="landing-stars" />
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="landing-bg">
      <div className="landing-stars" />
      <div className="landing-card">
        <div className="landing-pixel-art">🏢</div>

        <h1 className="landing-pixel-title">PixelVibe</h1>
        <p className="landing-subtitle">
          Tu oficina virtual isométrica. Muévete, chatea y colabora<br />
          con tu equipo en tiempo real al estilo pixel art retro.
        </p>

        <div className="landing-features">
          <div className="landing-feature">
            <span className="landing-feature-icon">🗺️</span>
            <span>Mapa iso 16×16</span>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon">🧑‍💻</span>
            <span>Avatares en vivo</span>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon">💬</span>
            <span>Chat por cercanía</span>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon">⚡</span>
            <span>Realtime</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleEmailAuth}>
          {mode === 'signup' && (
            <input
              id="auth-name"
              className="auth-input"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={40}
            />
          )}
          <input
            id="auth-email"
            className="auth-input"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            id="auth-password"
            className="auth-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            minLength={6}
            required
          />

          {error && <p className="auth-message auth-error">{error}</p>}
          {info && <p className="auth-message auth-info">{info}</p>}

          <button
            id="btn-email-auth"
            type="submit"
            className="btn-auth"
            disabled={signingIn}
          >
            {signingIn
              ? 'Cargando...'
              : mode === 'signup' ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>¿No tienes cuenta? <button type="button" onClick={() => switchMode('signup')}>Regístrate</button></>
          ) : (
            <>¿Ya tienes cuenta? <button type="button" onClick={() => switchMode('login')}>Inicia sesión</button></>
          )}
        </p>

        <p className="landing-footer">
          Al entrar aceptas los términos de uso. Solo almacenamos tu nombre y email.
        </p>
      </div>
    </div>
  );
}

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (m.includes('email not confirmed')) return 'Confirma tu email antes de entrar (revisa tu bandeja de entrada).';
  if (m.includes('user already registered')) return 'Ya existe una cuenta con ese email. Inicia sesión.';
  if (m.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (m.includes('rate limit')) return 'Demasiados intentos. Espera un momento e intenta de nuevo.';
  return message;
}
