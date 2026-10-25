import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'assignment-reminder-secret-jwt-key-2026-btech-project';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    college: z.string().optional(),
    department: z.string().optional(),
    semester: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    college: z.string().optional(),
    department: z.string().optional(),
    semester: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

function generateTokenAndSetCookie(res: Response, user: { id: string; email: string; role: string }) {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
}

// POST /api/auth/register
router.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { name, email, password, college, department, semester } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A student account with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        college: college || 'Apex Institute of Technology',
        department: department || 'Computer Science & Engineering',
        semester: semester || '6th Semester',
        settings: {
          create: {
            emailNotifications: true,
            browserNotifications: true,
            urgentThresholdHours: 24,
            upcomingThresholdHours: 72,
          },
        },
      },
      include: {
        settings: true,
      },
    });

    // Create a starter welcome subject so their dashboard isn't blank
    await prisma.subject.create({
      data: {
        name: 'Introduction to Computer Science',
        code: 'CS101',
        instructor: 'Department Faculty',
        color: '#3B82F6',
        department: user.department || 'Computer Science',
        semester: user.semester || 'Semester 1',
        description: 'Starter subject for your academic schedule.',
        userId: user.id,
      },
    });

    const token = generateTokenAndSetCookie(res, user);

    const { passwordHash: _, ...safeUser } = user;
    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create student account.',
    });
  }
});

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        settings: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateTokenAndSetCookie(res, user);
    const { passwordHash: _, ...safeUser } = user;

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
});

// POST /api/auth/demo-login (1-Click evaluator / presentation login)
router.post('/demo-login', async (req, res) => {
  try {
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@student.edu' },
      include: {
        settings: true,
      },
    });

    if (!demoUser) {
      // Create on the fly if not yet seeded
      const passwordHash = await bcrypt.hash('password123', 10);
      demoUser = await prisma.user.create({
        data: {
          name: 'Aditya Verma',
          email: 'demo@student.edu',
          passwordHash,
          college: 'Apex Institute of Technology',
          department: 'Computer Science & Engineering',
          semester: '6th Semester (B.Tech)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          settings: {
            create: {
              emailNotifications: true,
              browserNotifications: true,
              urgentThresholdHours: 24,
              upcomingThresholdHours: 72,
              theme: 'dark',
            },
          },
        },
        include: {
          settings: true,
        },
      });
    }

    const token = generateTokenAndSetCookie(res, demoUser);
    const { passwordHash: _, ...safeUser } = demoUser;

    return res.json({
      success: true,
      message: 'Welcome to the Demo Presentation account!',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Demo login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to access demo student profile.',
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: {
        settings: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile data.',
    });
  }
});

// PUT /api/auth/me
router.put('/me', authenticateToken, validateRequest(updateProfileSchema), async (req: AuthRequest, res) => {
  try {
    const { name, college, department, semester, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        ...(name && { name }),
        ...(college && { college }),
        ...(department && { department }),
        ...(semester && { semester }),
        ...(avatar && { avatar }),
      },
      include: {
        settings: true,
      },
    });

    const { passwordHash: _, ...safeUser } = updatedUser;
    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: safeUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
});

export default router;
