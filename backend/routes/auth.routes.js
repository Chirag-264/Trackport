import { Router } from 'express';
import passport, { isOAuthConfigured } from '../passport.js';
import { registerUser, loginUser, getMe, refreshSession, logoutUser } from '../controllers/auth.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
import { accessTokenResponse, createRefreshSession } from '../utils/auth-session.js';
import { randomBytes, timingSafeEqual } from 'node:crypto';

const router = Router();
const oauthCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: 5 * 60 * 1000
};

function readCookie(req, name) {
  return (req.headers.cookie || '').split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))?.split('=').slice(1).join('=') || '';
}

function oauthMode(req) {
  if (req.oauthMode === 'register' || req.oauthMode === 'login') return req.oauthMode;
  return readCookie(req, 'trackport_oauth_mode') === 'signup' ? 'register' : 'login';
}

function clearOAuthCookies(res) {
  const { maxAge, ...clearOptions } = oauthCookieOptions;
  res.clearCookie('trackport_oauth_state', clearOptions);
  res.clearCookie('trackport_oauth_mode', clearOptions);
}

// Local auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshSession);
router.post('/logout', logoutUser);
router.get('/me', authUser, getMe);

function oauthCallback(provider) {
  return [
    (req, res, next) => passport.authenticate(provider, { session: false }, (error, user) => {
      if (error || !user) {
        console.error(`[oauth:${provider}] callback failed`, error?.name || 'NoUserReturned', error?.code || 'no-code', error?.keyPattern || 'no-key-pattern');
        return res.redirect(frontendLoginUrl('failed', oauthMode(req)));
      }
      req.user = user;
      return next();
    })(req, res, next),
    async (req, res, next) => {
      try {
        const token = accessTokenResponse(req.user._id);
        await createRefreshSession(req.user._id, res);
        const frontendUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
        res.redirect(`${frontendUrl}/auth/callback?mode=${oauthMode(req)}#access_token=${encodeURIComponent(token)}`);
      } catch (error) {
        next(error);
      }
    }
  ];
}

function frontendLoginUrl(reason, mode = 'login') {
    const frontendUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const page = mode === 'register' ? 'register' : 'login';
    return `${frontendUrl}/auth/${page}?oauth=${reason}`;
}

function startOAuth(provider, scope) {
  return (req, res, next) => {
    const mode = req.query.mode === 'signup' ? 'register' : 'login';
    if (!isOAuthConfigured(provider)) return res.redirect(frontendLoginUrl(`${provider}-unconfigured`, mode));
    const state = randomBytes(32).toString('base64url');
    res.cookie('trackport_oauth_state', state, oauthCookieOptions);
    res.cookie('trackport_oauth_mode', mode, oauthCookieOptions);
    return passport.authenticate(provider, { scope, state })(req, res, next);
  };
}

function verifyOAuthState(req, res, next) {
  const cookie = readCookie(req, 'trackport_oauth_state');
  req.oauthMode = oauthMode(req);
  const received = typeof req.query.state === 'string' ? req.query.state : '';
  const expectedBuffer = Buffer.from(cookie);
  const receivedBuffer = Buffer.from(received);
  const matches = expectedBuffer.length === receivedBuffer.length
    && expectedBuffer.length > 0
    && timingSafeEqual(expectedBuffer, receivedBuffer);
  clearOAuthCookies(res);
  if (!matches) return res.redirect(frontendLoginUrl('failed', req.oauthMode));
  return next();
}

function requireConfiguredOAuth(provider) {
  return (req, res, next) => {
    if (isOAuthConfigured(provider)) return next();
    return res.redirect(frontendLoginUrl(`${provider}-unconfigured`, oauthMode(req)));
  };
}

// Google OAuth
router.get('/google', startOAuth('google', ['profile', 'email']));
router.get('/google/callback', requireConfiguredOAuth('google'), verifyOAuthState, ...oauthCallback('google'));

// GitHub OAuth
router.get('/github', startOAuth('github', ['user:email']));
router.get('/github/callback', requireConfiguredOAuth('github'), verifyOAuthState, ...oauthCallback('github'));

export default router;
