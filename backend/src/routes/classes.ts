import { Router } from 'express';
import Class from '../models/Class';

const router = Router();

// Get all active classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find({ isDeleted: { $ne: true }, isArchived: { $ne: true } }).sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get all archived classes
router.get('/settings/archives', async (req, res) => {
  try {
    const classes = await Class.find({ isArchived: true, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch archived classes' });
  }
});

// Get all deleted classes
router.get('/settings/bin', async (req, res) => {
  try {
    const classes = await Class.find({ isDeleted: true }).sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deleted classes' });
  }
});

// Create a class
router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create class' });
  }
});

// Get a single class
router.get('/:id', async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

// Update a class
router.put('/:id', async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ error: 'Class not found' });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Soft delete a class
router.delete('/:id', async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!deletedClass) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class moved to bin' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

// Archive a class
router.put('/:id/archive', async (req, res) => {
  try {
    const cls = await Class.findByIdAndUpdate(req.params.id, { isArchived: true, isDeleted: false });
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class archived' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive class' });
  }
});

// Restore a class
router.put('/:id/restore', async (req, res) => {
  try {
    const cls = await Class.findByIdAndUpdate(req.params.id, { isArchived: false, isDeleted: false });
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class restored' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore class' });
  }
});

// Permanently delete a class
router.delete('/:id/permanent', async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class permanently deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to permanently delete class' });
  }
});

export default router;
