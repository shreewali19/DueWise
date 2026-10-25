import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { checkDeadlinesAndDispatchReminders } from '../services/reminderScheduler';

const router = Router();
router.use(authenticateToken);

const createAssignmentSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().optional(),
    subjectId: z.string().min(1, 'Subject is required'),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid due date format',
    }),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).default('PENDING'),
    submissionType: z
      .enum(['LAB_RECORD', 'TECHNICAL_REPORT', 'HOMEWORK', 'DPP', 'MINI_PROJECT', 'ESSAY', 'OTHER'])
      .default('HOMEWORK'),
    estimatedHours: z.number().nonnegative().optional(),
    actualHours: z.number().nonnegative().optional(),
    referenceUrl: z.string().optional(),
    attachmentNotes: z.string().optional(),
    reminderOffsets: z.array(z.number()).optional(), // e.g. [1, 24, 48]
  }),
});

const updateAssignmentSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    subjectId: z.string().min(1).optional(),
    dueDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid due date format',
      })
      .optional(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional(),
    submissionType: z
      .enum(['LAB_RECORD', 'TECHNICAL_REPORT', 'HOMEWORK', 'DPP', 'MINI_PROJECT', 'ESSAY', 'OTHER'])
      .optional(),
    estimatedHours: z.number().nonnegative().optional(),
    actualHours: z.number().nonnegative().optional(),
    referenceUrl: z.string().optional(),
    attachmentNotes: z.string().optional(),
    reminderOffsets: z.array(z.number()).optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']),
    actualHours: z.number().nonnegative().optional(),
  }),
});

// GET /api/assignments
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { status, priority, subjectId, submissionType, search, sortBy = 'dueDate', order = 'asc' } = req.query;

    const where: any = {
      userId: req.user!.id,
    };

    if (status && status !== 'ALL') {
      if (status === 'ACTIVE') {
        where.status = { in: ['PENDING', 'IN_PROGRESS'] };
      } else {
        where.status = String(status);
      }
    }

    if (priority && priority !== 'ALL') {
      where.priority = String(priority);
    }

    if (subjectId && subjectId !== 'ALL') {
      where.subjectId = String(subjectId);
    }

    if (submissionType && submissionType !== 'ALL') {
      where.submissionType = String(submissionType);
    }

    if (search && String(search).trim() !== '') {
      const q = String(search).trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { subject: { name: { contains: q } } },
        { subject: { code: { contains: q } } },
      ];
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            color: true,
            instructor: true,
          },
        },
      },
      orderBy: {
        [String(sortBy)]: order === 'desc' ? 'desc' : 'asc',
      },
    });

    // Compute urgency metadata for client convenience
    const now = new Date();
    const enriched = assignments.map((a) => {
      const diffMs = new Date(a.dueDate).getTime() - now.getTime();
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      const isOverdue = diffMs < 0 && a.status !== 'COMPLETED';
      const isUrgent = diffHours >= 0 && diffHours <= 24 && a.status !== 'COMPLETED';
      const isApproaching = diffHours > 24 && diffHours <= 72 && a.status !== 'COMPLETED';

      return {
        ...a,
        urgency: {
          hoursRemaining: diffHours,
          isOverdue,
          isUrgent,
          isApproaching,
        },
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      assignments: enriched,
    });
  } catch (error) {
    console.error('Fetch assignments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assignments.',
    });
  }
});

// POST /api/assignments
router.post('/', validateRequest(createAssignmentSchema), async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      subjectId,
      dueDate,
      priority,
      status,
      submissionType,
      estimatedHours,
      actualHours,
      referenceUrl,
      attachmentNotes,
      reminderOffsets,
    } = req.body;

    // Verify subject belongs to user
    const subject = await prisma.subject.findFirst({
      where: { id: subjectId, userId: req.user!.id },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Selected subject not found in your account.',
      });
    }

    const parsedDueDate = new Date(dueDate);
    const now = new Date();
    const finalStatus = status || (parsedDueDate < now ? 'OVERDUE' : 'PENDING');

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        subjectId,
        userId: req.user!.id,
        dueDate: parsedDueDate,
        priority: priority || 'MEDIUM',
        status: finalStatus,
        submissionType: submissionType || 'HOMEWORK',
        estimatedHours: estimatedHours !== undefined ? Number(estimatedHours) : 2.0,
        actualHours: actualHours !== undefined ? Number(actualHours) : null,
        referenceUrl: referenceUrl || null,
        attachmentNotes: attachmentNotes || null,
        reminderOffsets: reminderOffsets ? JSON.stringify(reminderOffsets) : '[1,24,48]',
      },
      include: {
        subject: true,
      },
    });

    // Check deadlines immediately so urgent reminder is created if needed
    checkDeadlinesAndDispatchReminders(req.user!.id);

    return res.status(201).json({
      success: true,
      message: 'Assignment scheduled successfully!',
      assignment,
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create assignment.',
    });
  }
});

// GET /api/assignments/:id
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        subject: true,
        notifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    return res.json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error('Fetch assignment details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assignment details.',
    });
  }
});

// PUT /api/assignments/:id
router.put('/:id', validateRequest(updateAssignmentSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.assignment.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    const {
      title,
      description,
      subjectId,
      dueDate,
      priority,
      status,
      submissionType,
      estimatedHours,
      actualHours,
      referenceUrl,
      attachmentNotes,
      reminderOffsets,
    } = req.body;

    if (subjectId) {
      const subject = await prisma.subject.findFirst({
        where: { id: subjectId, userId: req.user!.id },
      });
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Selected subject not found.',
        });
      }
    }

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(subjectId && { subjectId }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(priority && { priority }),
        ...(status && {
          status,
          completedAt: status === 'COMPLETED' ? (existing.completedAt || new Date()) : null,
        }),
        ...(submissionType && { submissionType }),
        ...(estimatedHours !== undefined && { estimatedHours: Number(estimatedHours) }),
        ...(actualHours !== undefined && { actualHours: Number(actualHours) }),
        ...(referenceUrl !== undefined && { referenceUrl }),
        ...(attachmentNotes !== undefined && { attachmentNotes }),
        ...(reminderOffsets && { reminderOffsets: JSON.stringify(reminderOffsets) }),
      },
      include: {
        subject: true,
      },
    });

    return res.json({
      success: true,
      message: 'Assignment updated successfully!',
      assignment: updated,
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update assignment.',
    });
  }
});

// PATCH /api/assignments/:id/status (Fast status toggle)
router.patch('/:id/status', validateRequest(updateStatusSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, actualHours } = req.body;

    const existing = await prisma.assignment.findFirst({
      where: { id, userId: req.user!.id },
      include: { subject: true },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    const isNowCompleted = status === 'COMPLETED';
    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        status,
        completedAt: isNowCompleted ? new Date() : null,
        ...(actualHours !== undefined && { actualHours: Number(actualHours) }),
      },
      include: {
        subject: true,
      },
    });

    // If marked completed, generate celebration in-app notification
    if (isNowCompleted && existing.status !== 'COMPLETED') {
      await prisma.notification.create({
        data: {
          userId: req.user!.id,
          assignmentId: id,
          title: `🎉 Finished: ${existing.title}`,
          message: `Awesome progress! You completed your ${existing.submissionType.replace('_', ' ').toLowerCase()} for ${existing.subject.code}.`,
          type: 'COMPLETED',
          isRead: false,
        },
      });
    }

    return res.json({
      success: true,
      message: `Assignment marked as ${status.replace('_', ' ').toLowerCase()}!`,
      assignment: updated,
    });
  } catch (error) {
    console.error('Toggle assignment status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update assignment status.',
    });
  }
});

// DELETE /api/assignments/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.assignment.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    await prisma.assignment.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Assignment deleted successfully.',
    });
  } catch (error) {
    console.error('Delete assignment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete assignment.',
    });
  }
});

export default router;
