import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

const router = Router();
router.use(authenticateToken);

const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Subject name must be at least 2 characters'),
    code: z.string().min(2, 'Course code is required (e.g. CS601)'),
    instructor: z.string().optional(),
    color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Color must be a valid hex code').default('#3B82F6'),
    department: z.string().optional(),
    semester: z.string().optional(),
    description: z.string().optional(),
  }),
});

const updateSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    code: z.string().min(2).optional(),
    instructor: z.string().optional(),
    color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
    department: z.string().optional(),
    semester: z.string().optional(),
    description: z.string().optional(),
  }),
});

// GET /api/subjects
router.get('/', async (req: AuthRequest, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { userId: req.user!.id },
      include: {
        assignments: {
          select: {
            id: true,
            status: true,
            priority: true,
            dueDate: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const enrichedSubjects = subjects.map((sub) => {
      const total = sub.assignments.length;
      const completed = sub.assignments.filter((a) => a.status === 'COMPLETED').length;
      const pending = sub.assignments.filter((a) => a.status === 'PENDING').length;
      const inProgress = sub.assignments.filter((a) => a.status === 'IN_PROGRESS').length;
      const overdue = sub.assignments.filter((a) => a.status === 'OVERDUE').length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        ...sub,
        stats: {
          total,
          completed,
          pending,
          inProgress,
          overdue,
          completionRate,
        },
      };
    });

    return res.json({
      success: true,
      subjects: enrichedSubjects,
    });
  } catch (error) {
    console.error('Fetch subjects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve academic subjects.',
    });
  }
});

// POST /api/subjects
router.post('/', validateRequest(createSubjectSchema), async (req: AuthRequest, res) => {
  try {
    const { name, code, instructor, color, department, semester, description } = req.body;

    const subject = await prisma.subject.create({
      data: {
        name,
        code: code.toUpperCase(),
        instructor,
        color: color || '#3B82F6',
        department,
        semester,
        description,
        userId: req.user!.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Academic subject added successfully!',
      subject,
    });
  } catch (error) {
    console.error('Create subject error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create academic subject.',
    });
  }
});

// GET /api/subjects/:id
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const subject = await prisma.subject.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        assignments: {
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
      });
    }

    return res.json({
      success: true,
      subject,
    });
  } catch (error) {
    console.error('Fetch single subject error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subject details.',
    });
  }
});

// PUT /api/subjects/:id
router.put('/:id', validateRequest(updateSubjectSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.subject.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
      });
    }

    const { name, code, instructor, color, department, semester, description } = req.body;

    const updated = await prisma.subject.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code: code.toUpperCase() }),
        ...(instructor !== undefined && { instructor }),
        ...(color && { color }),
        ...(department !== undefined && { department }),
        ...(semester !== undefined && { semester }),
        ...(description !== undefined && { description }),
      },
    });

    return res.json({
      success: true,
      message: 'Subject updated successfully!',
      subject: updated,
    });
  } catch (error) {
    console.error('Update subject error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update subject.',
    });
  }
});

// DELETE /api/subjects/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.subject.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
      });
    }

    await prisma.subject.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Subject and associated assignments removed.',
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subject.',
    });
  }
});

export default router;
