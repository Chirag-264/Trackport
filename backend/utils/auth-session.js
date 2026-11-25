import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import RefreshSession from '../models/refresh-session.model.js';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const COOKIE_NAME = 'trackport_refresh';

export function createAccessToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ userId: String(userId), type: 'access' }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
    issuer: 'trackport-api',
    audience: 'trackport-web'
  });
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function cookieOptions() {
  const sameSite = process.env.COOKIE_SAME_SITE || 'lax';
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || sameSite === 'none',
    sameSite,
    path: '/api/auth',
    maxAge: REFRESH_TOKEN_TTL_MS
  };
}

export async function createRefreshSession(userId, res) {
  const token = randomBytes(48).toString('base64url');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await RefreshSession.create({ userId, tokenHash: hashToken(token), expiresAt });
  res.cookie(COOKIE_NAME, token, cookieOptions());
  return token;
}

export function readRefreshCookie(req) {
  const cookieHeader = req.headers.cookie || '';
  const prefix = `${COOKIE_NAME}=`;
  const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
}

export async function rotateRefreshSession(req, res) {
  const token = readRefreshCookie(req);
  if (!token) return null;
  const session = await RefreshSession.findOneAndDelete({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() }
  });
  if (!session) {
    const { path, sameSite, secure, httpOnly } = cookieOptions();
    res.clearCookie(COOKIE_NAME, { path, sameSite, secure, httpOnly });
    return null;
  }
  await createRefreshSession(session.userId, res);
  return session.userId;
}

export async function revokeRefreshSession(req, res) {
  const token = readRefreshCookie(req);
  if (token) await RefreshSession.deleteOne({ tokenHash: hashToken(token) });
  const { path, sameSite, secure, httpOnly } = cookieOptions();
  res.clearCookie(COOKIE_NAME, { path, sameSite, secure, httpOnly });
}

export function accessTokenResponse(userId) {
  return createAccessToken(userId);
}
