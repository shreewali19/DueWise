import cron from 'node-cron';
import prisma from '../prisma';

export async function checkDeadlinesAndDispatchReminders(targetUserId?: string) {
  try {
    const now = new Date();

    // Query active non-completed assignments
    const whereClause: any = {
      status: {
        not: 'COMPLETED',
      },
    };

    if (targetUserId) {
      whereClause.userId = targetUserId;
    }

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        subject: true,
        user: {
          include: {
            settings: true,
          },
        },
      },
    });

    for (const assignment of assignments) {
      const diffMs = assignment.dueDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // 1. Check for OVERDUE status
      if (diffMs < 0) {
        if (assignment.status !== 'OVERDUE') {
          await prisma.assignment.update({
            where: { id: assignment.id },
            data: { status: 'OVERDUE' },
          });

          // Check if overdue notification already sent
          const existingNotification = await prisma.notification.findFirst({
            where: {
              assignmentId: assignment.id,
              type: 'OVERDUE',
            },
          });

          if (!existingNotification) {
            await prisma.notification.create({
              data: {
                userId: assignment.userId,
                assignmentId: assignment.id,
                title: '🚨 Deadline Overdue Notice',
                message: `"${assignment.title}" in ${assignment.subject.code} has passed its deadline! Please submit as soon as possible.`,
                type: 'OVERDUE',
                isRead: false,
                sentAt: now,
              },
            });
          }
        }
        continue;
      }

      // 2. Urgent reminder threshold (default 24h)
      const urgentThreshold = assignment.user.settings?.urgentThresholdHours ?? 24;
      if (diffHours <= urgentThreshold) {
        const existingUrgent = await prisma.notification.findFirst({
          where: {
            assignmentId: assignment.id,
            type: 'URGENT',
          },
        });

        if (!existingUrgent) {
          const hoursLeft = Math.max(1, Math.round(diffHours));
          await prisma.notification.create({
            data: {
              userId: assignment.userId,
              assignmentId: assignment.id,
              title: `⚠️ Urgent: Deadline in ${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}!`,
              message: `"${assignment.title}" (${assignment.subject.code}) is due soon. Finalize your submission.`,
              type: 'URGENT',
              isRead: false,
              sentAt: now,
            },
          });
        }
      }

      // 3. Upcoming reminder threshold (default 72h / 48h)
      const upcomingThreshold = assignment.user.settings?.upcomingThresholdHours ?? 72;
      if (diffHours <= upcomingThreshold && diffHours > urgentThreshold) {
        const existingUpcoming = await prisma.notification.findFirst({
          where: {
            assignmentId: assignment.id,
            type: 'UPCOMING',
          },
        });

        if (!existingUpcoming) {
          const daysLeft = Math.max(1, Math.round(diffHours / 24));
          await prisma.notification.create({
            data: {
              userId: assignment.userId,
              assignmentId: assignment.id,
              title: `⏰ Upcoming Deadline (${assignment.subject.code})`,
              message: `"${assignment.title}" is due in approximately ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Plan your study schedule.`,
              type: 'UPCOMING',
              isRead: false,
              sentAt: now,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error('Error running reminder scheduler:', error);
  }
}

export function startReminderScheduler() {
  // Run every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    console.log('⏰ [Scheduler] Scanning upcoming assignment deadlines and evaluating reminder rules...');
    await checkDeadlinesAndDispatchReminders();
  });
  console.log('✅ Automated Reminder Cron Scheduler initialized (Interval: every 2 minutes)');
}
