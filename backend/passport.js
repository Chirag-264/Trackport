import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import User from './models/user.model.js';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, '.env') });

function callbackUrl(provider) {
  const apiUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${apiUrl.replace(/\/$/, '')}/api/auth/${provider}/callback`;
}

function usernameBase(profile, provider) {
  const candidate = profile.username || profile.displayName || `${provider}_${profile.id}`;
  const normalized = candidate.toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 22);
  return normalized.length >= 3 ? normalized : `${provider}_${profile.id}`.slice(0, 30);
}

async function findOrCreateProviderUser(provider, profile) {
  const providerField = provider === 'google' ? 'googleId' : 'githubId';
  let user = await User.findOne({ [providerField]: profile.id });
  if (user) return user;

  const emailRecord = provider === 'github'
    ? profile.emails?.find((entry) => entry.verified)
    : profile.emails?.find((entry) => entry.verified) || profile.emails?.[0];
  const email = emailRecord?.value?.trim().toLowerCase();
  const emailVerified = provider === 'google'
    ? profile._json?.email_verified === true
    : emailRecord?.verified === true;
  if (!email) {
    throw new Error(provider === 'github'
      ? 'GitHub did not provide a verified email address'
      : `${provider} did not provide an email address`);
  }

  if (emailVerified) {
    user = await User.findOne({ email });
    if (user) {
      user[providerField] = profile.id;
      if (provider === 'github') user.githubUsername = profile.username || user.githubUsername;
      await user.save();
      return user;
    }
  }

  const base = usernameBase(profile, provider);
  let userName = base;
  let suffix = 1;
  while (await User.exists({ userName })) {
    userName = `${base.slice(0, 25)}_${suffix++}`;
  }
  return User.create({
    name: profile.displayName || profile.username || provider,
    userName,
    email,
    [providerField]: profile.id,
    ...(provider === 'github' ? { githubUsername: profile.username || '' } : {}),
    password: await bcrypt.hash(randomBytes(32).toString('hex'), 10)
  });
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackUrl('google')
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      done(null, await findOrCreateProviderUser('google', profile));
    } catch (error) {
      done(error);
    }
  }));
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: callbackUrl('github'),
    scope: ['user:email'],
    allRawEmails: true
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      done(null, await findOrCreateProviderUser('github', profile));
    } catch (error) {
      done(error);
    }
  }));
}

export function isOAuthConfigured(provider) {
  return provider === 'google'
    ? Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    : Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}

export default passport;
