import { Router } from 'express';
import Billing from '../models/Billing';

const router = Router();

router.get('/status', async (req, res) => {
  try {
    let billing = await Billing.findOne();
    if (!billing) {
      billing = new Billing();
      await billing.save();
    }
    res.json(billing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch billing' });
  }
});

export default router;
