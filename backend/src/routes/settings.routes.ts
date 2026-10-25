import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

const router = Router();
router.use(authenticateToken);

const updateSettingsSchema = z.object({
  body: z.object({
    emailNotifications: z.boolean().optional(),
    browserNotifications: z.boolean().optional(),
    urgentThresholdHours: z.number().int().min(1).max(72).optional(),
    upcomingThresholdHours: z.number().int().min(24).max(168).optional(),
    defaultPriority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
  }),
});

// GET /api/settings
router.get('/', async (req: AuthRequest, res) => {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { userId: req.user!.id },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: req.user!.id,
        },
      });
    }

    return res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notification settings.',
    });
  }
});

// PUT /api/settings
router.put('/', validateRequest(updateSettingsSchema), async (req: AuthRequest, res) => {
  try {
    const {
      emailNotifications,
      browserNotifications,
      urgentThresholdHours,
      upcomingThresholdHours,
      defaultPriority,
      theme,
    } = req.body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user!.id },
      update: {
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(browserNotifications !== undefined && { browserNotifications }),
        ...(urgentThresholdHours !== undefined && { urgentThresholdHours }),
        ...(upcomingThresholdHours !== undefined && { upcomingThresholdHours }),
        ...(defaultPriority && { defaultPriority }),
        ...(theme && { theme }),
      },
      create: {
        userId: req.user!.id,
        emailNotifications: emailNotifications ?? true,
        browserNotifications: browserNotifications ?? true,
        urgentThresholdHours: urgentThresholdHours ?? 24,
        upcomingThresholdHours: upcomingThresholdHours ?? 72,
        defaultPriority: defaultPriority ?? 'MEDIUM',
        theme: theme ?? 'system',
      },
    });

    return res.json({
      success: true,
      message: 'Preferences updated successfully!',
      settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update preferences.',
    });
  }
});

export default router;
