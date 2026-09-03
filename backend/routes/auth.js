const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_sensei';

const normalizeEmail = (email) => email.trim().toLowerCase();

const toClientUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  fullName: user.profile?.full_name || '',
});

const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (user) return user;

  const matches = await prisma.$queryRaw`
    SELECT id FROM "User" WHERE lower("email") = ${email} LIMIT 1
  `;

  if (!matches.length) return null;

  return prisma.user.findUnique({
    where: { id: matches[0].id },
    include: { profile: true },
  });
};

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});

// Zod schemas for input validation
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  full_name: z.string().optional(),
  role: z.enum(['athlete', 'scout']).optional(),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// @desc    Register a new user
// @route   POST /api/v1/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    // Validate input
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: validationResult.error.issues });
    }
    
    const { password, full_name, role } = validationResult.data;
    const email = normalizeEmail(validationResult.data.email);

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'This email is already registered. Please sign in instead.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        role: role || 'athlete',
        profile: {
          create: {
            full_name: full_name || '',
          }
        }
      },
      include: { profile: true },
    });

    res.status(201).json({
      message: 'User registered successfully, Sensei!',
      userId: user.id,
      user: toClientUser(user),
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    // Validate input
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: validationResult.error.issues });
    }

    const { password } = validationResult.data;
    const email = normalizeEmail(validationResult.data.email);

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'No account found for this email. Please sign up first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    // Create token
    const token = jwt.sign(
      { uid: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({ 
      success: true, 
      token, 
      user: toClientUser(user),
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
