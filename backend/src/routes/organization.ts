import { Router } from 'express';
import Organization from '../models/Organization';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let org = await Organization.findOne();
    if (!org) {
      org = new Organization();
      await org.save();
    }
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

router.put('/', async (req, res) => {
  try {
    const org = await Organization.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(org);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update organization' });
  }
});

export default router;
