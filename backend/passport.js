import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from './models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails?.[0]?.value || '',
              googleId: profile.id,
              // generate a dummy password/hash because local login expects it
              password: await import('bcryptjs').then(b => b.hash(Math.random().toString(), 10)),
            });
          }
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
        scope: ['user:email'],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });
          if (!user) {
            const primaryEmail = profile.emails?.find(e => e.primary)?.value || profile.emails?.[0]?.value || '';
            user = await User.create({
              name: profile.displayName || profile.username,
              email: primaryEmail,
              githubId: profile.id,
              githubUsername: profile.username,
              password: await import('bcryptjs').then(b => b.hash(Math.random().toString(), 10)),
            });
          }
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );
}

export default passport;

