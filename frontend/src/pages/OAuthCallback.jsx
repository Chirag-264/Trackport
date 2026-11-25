import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getMe } from '@/services/auth.service';
import { setAccessToken } from '@/services/api';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { completeOAuth } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const mode = new URLSearchParams(window.location.search).get('mode') === 'signup' ? 'register' : 'login';
    const failurePath = `/auth/${mode}?oauth=failed`;
    const token = params.get('access_token');
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    if (!token) {
      navigate(failurePath, { replace: true });
      return;
    }
    setAccessToken(token);
    getMe()
      .then((response) => {
        if (!response?.data?.user) throw new Error('Could not load your account');
        completeOAuth(token, response.data.user);
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        setAccessToken(null);
        navigate(failurePath, { replace: true });
      });
  }, [completeOAuth, navigate]);

  return <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">Signing you in…</div>;
}
