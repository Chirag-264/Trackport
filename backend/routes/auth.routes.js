import { Router } from 'express';
import passport from '../passport.js';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

const router = Router();

// Local auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authUser, getMe);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }),
  (req, res) => {
    // Generate JWT and send it back (could use a redirect with token in query)
    const token = req.user._id ? require('jsonwebtoken').sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }) : '';
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/auth/login' }),
  (req, res) => {
    const token = req.user._id ? require('jsonwebtoken').sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }) : '';
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
  }
);

export default router;
