import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { checkDeadlinesAndDispatchReminders } from '../services/reminderScheduler';

const router = Router();
router.use(authenticateToken);

// GET /api/notifications
router.get('/', async (req: AuthRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            priority: true,
            subject: {
              select: {
                code: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications.',
    });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.notification.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.json({
      success: true,
      notification: updated,
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification.',
    });
  }
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });

    return res.json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notifications.',
    });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.notification.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    await prisma.notification.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Notification deleted.',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notification.',
    });
  }
});

// DELETE /api/notifications (Clear all read)
router.delete('/', async (req: AuthRequest, res) => {
  try {
    await prisma.notification.deleteMany({
      where: { userId: req.user!.id, isRead: true },
    });

    return res.json({
      success: true,
      message: 'Read notifications cleared.',
    });
  } catch (error) {
    console.error('Clear read notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear read notifications.',
    });
  }
});

// POST /api/notifications/check-now (Trigger on-demand deadline reminder scan)
router.post('/check-now', async (req: AuthRequest, res) => {
  try {
    await checkDeadlinesAndDispatchReminders(req.user!.id);
    return res.json({
      success: true,
      message: 'Deadline reminder check evaluated successfully.',
    });
  } catch (error) {
    console.error('Check now error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to trigger deadline check.',
    });
  }
});

export default router;
