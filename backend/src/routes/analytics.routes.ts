import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

// GET /api/analytics/dashboard
router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const now = new Date();

    const [assignments, subjects, notifications] = await Promise.all([
      prisma.assignment.findMany({
        where: { userId },
        include: {
          subject: {
            select: {
              id: true,
              name: true,
              code: true,
              color: true,
            },
          },
        },
        orderBy: { dueDate: 'asc' },
      }),
      prisma.subject.findMany({
        where: { userId },
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === 'COMPLETED').length;
    const inProgress = assignments.filter((a) => a.status === 'IN_PROGRESS').length;
    const pending = assignments.filter((a) => a.status === 'PENDING').length;
    const overdue = assignments.filter((a) => {
      return a.status === 'OVERDUE' || (new Date(a.dueDate) < now && a.status !== 'COMPLETED');
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    let totalEstimatedHours = 0;
    let totalActualHours = 0;
    for (const a of assignments) {
      if (a.estimatedHours) totalEstimatedHours += a.estimatedHours;
      if (a.actualHours) totalActualHours += a.actualHours;
    }

    // High priority pending
    const highPriorityPending = assignments.filter(
      (a) => a.priority === 'HIGH' && a.status !== 'COMPLETED'
    ).length;

    // Urgent tasks (due within 24 hours and not completed)
    const urgentTasks = assignments
      .filter((a) => {
        if (a.status === 'COMPLETED') return false;
        const diffHours = (new Date(a.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60);
        return diffHours >= 0 && diffHours <= 24;
      })
      .map((a) => {
        const diffHours = Math.round((new Date(a.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60));
        return {
          ...a,
          hoursRemaining: Math.max(1, diffHours),
        };
      });

    // Subject Workload Breakdown
    const subjectBreakdown = subjects.map((sub) => {
      const subAssignments = assignments.filter((a) => a.subjectId === sub.id);
      const subCompleted = subAssignments.filter((a) => a.status === 'COMPLETED').length;
      const subPending = subAssignments.filter((a) => a.status !== 'COMPLETED').length;
      const rate = subAssignments.length > 0 ? Math.round((subCompleted / subAssignments.length) * 100) : 0;

      return {
        id: sub.id,
        name: sub.name,
        code: sub.code,
        color: sub.color,
        total: subAssignments.length,
        completed: subCompleted,
        pending: subPending,
        completionRate: rate,
      };
    });

    // Submission Type Breakdown
    const submissionTypeCounts: Record<string, number> = {
      LAB_RECORD: 0,
      TECHNICAL_REPORT: 0,
      HOMEWORK: 0,
      DPP: 0,
      MINI_PROJECT: 0,
      ESSAY: 0,
      OTHER: 0,
    };

    assignments.forEach((a) => {
      if (submissionTypeCounts[a.submissionType] !== undefined) {
        submissionTypeCounts[a.submissionType]++;
      } else {
        submissionTypeCounts['OTHER']++;
      }
    });

    const submissionTypeData = Object.entries(submissionTypeCounts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        type,
        label: type.replace('_', ' '),
        count,
      }));

    // Weekly Timeline Distribution (next 7 days)
    const next7DaysTimeline = Array.from({ length: 7 }, (_, i) => {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + i);
      const dateStr = targetDate.toISOString().split('T')[0];
      const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

      const dueCount = assignments.filter((a) => {
        const aDate = new Date(a.dueDate).toISOString().split('T')[0];
        return aDate === dateStr;
      }).length;

      const completedCount = assignments.filter((a) => {
        if (a.status !== 'COMPLETED' || !a.completedAt) return false;
        const cDate = new Date(a.completedAt).toISOString().split('T')[0];
        return cDate === dateStr;
      }).length;

      return {
        date: dateStr,
        day: dayName,
        due: dueCount,
        completed: completedCount,
      };
    });

    return res.json({
      success: true,
      data: {
        kpis: {
          total,
          completed,
          inProgress,
          pending,
          overdue,
          completionRate,
          totalEstimatedHours: Math.round(totalEstimatedHours * 10) / 10,
          totalActualHours: Math.round(totalActualHours * 10) / 10,
          highPriorityPending,
        },
        urgentTasks,
        subjectBreakdown,
        submissionTypeData,
        next7DaysTimeline,
        recentNotifications: notifications,
      },
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute academic analytics.',
    });
  }
});

export default router;
