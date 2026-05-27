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

// List all assignments
router.get('/', async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
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

// Delete specific assignment
router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const assignment = await Assignment.findByIdAndDelete(req.params.id);
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      res.json({ message: 'Assignment deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete assignment' });
    }
  });

export default router;
