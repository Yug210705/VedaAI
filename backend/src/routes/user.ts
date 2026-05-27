import { Router } from 'express';
import User from '../models/User';

const router = Router();

// Get user profile (assuming single user for now)
router.get('/', async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      // Seed default user if none exists
      user = new User({
        displayName: 'Madhur Rastogi',
        email: 'madhur@vedaai.com',
        role: 'Teacher'
      });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({}, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user' });
  }
});

// Get all team members
router.get('/team', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Update a team member
router.put('/team/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update team member' });
  }
});

// Invite (create) a team member
router.post('/team', async (req, res) => {
  try {
    const newUser = new User({ ...req.body, status: 'Pending' });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to invite team member' });
  }
});

// Delete team member
router.delete('/team/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;
