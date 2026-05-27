import { Router, Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { addGenerationJob } from '../queue/worker';

const router = Router();

// Create new assignment and dispatch BullMQ job
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, subject, studentClass, dueDate, questionTypes, totalQuestions, totalMarks, additionalInfo, fileData, fileMimeType } = req.body;

    const assignment = new Assignment({
      title: title || `${subject} Assignment`,
      studentClass: studentClass || '',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      questionTypes: questionTypes || [],
      totalQuestions: totalQuestions || 0,
      totalMarks: totalMarks || 0,
      additionalInfo: additionalInfo || '',
      status: 'GENERATING'
    });

    await assignment.save();

    // Add to BullMQ generation queue
    addGenerationJob(assignment.id, {
      subject,
      questionTypes,
      additionalInfo,
      fileData,
      fileMimeType
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Failed to create assignment', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// List all active assignments
router.get('/', async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find({ isDeleted: { $ne: true }, isArchived: { $ne: true } }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// List all archived assignments
router.get('/settings/archives', async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find({ isArchived: true, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch archived assignments' });
  }
});

// List all deleted assignments (bin)
router.get('/settings/bin', async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find({ isDeleted: true }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deleted assignments' });
  }
});

// Get specific assignment
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Update specific assignment
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Soft delete specific assignment
router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const assignment = await Assignment.findByIdAndUpdate(req.params.id, { isDeleted: true });
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      res.json({ message: 'Assignment moved to bin' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete assignment' });
    }
});

// Archive specific assignment
router.put('/:id/archive', async (req: Request, res: Response) => {
    try {
      const assignment = await Assignment.findByIdAndUpdate(req.params.id, { isArchived: true, isDeleted: false });
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      res.json({ message: 'Assignment archived' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to archive assignment' });
    }
});

// Restore specific assignment
router.put('/:id/restore', async (req: Request, res: Response) => {
    try {
      const assignment = await Assignment.findByIdAndUpdate(req.params.id, { isArchived: false, isDeleted: false });
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      res.json({ message: 'Assignment restored' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to restore assignment' });
    }
});

// Permanently delete specific assignment
router.delete('/:id/permanent', async (req: Request, res: Response) => {
    try {
      const assignment = await Assignment.findByIdAndDelete(req.params.id);
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      res.json({ message: 'Assignment permanently deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to permanently delete assignment' });
    }
});

export default router;
