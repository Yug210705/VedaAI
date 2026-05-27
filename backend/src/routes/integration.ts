import { Router } from 'express';
import Integration from '../models/Integration';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let integrations = await Integration.find();
    if (integrations.length === 0) {
      // Seed default integrations
      const defaults = [
        { name: 'Google Classroom', desc: 'Sync rosters and export grades automatically.', connected: true, icon: 'GC' },
        { name: 'Canvas LMS', desc: 'Deep integration via LTI 1.3 standards.', connected: false, icon: 'CA' },
        { name: 'Moodle', desc: 'Connect assignments to your Moodle courses.', connected: false, icon: 'MO' },
        { name: 'Slack', desc: 'Get notifications for student submissions.', connected: false, icon: 'SL' }
      ];
      integrations = await Integration.insertMany(defaults);
    }
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

router.put('/:id/toggle', async (req, res) => {
  try {
    const integration = await Integration.findById(req.params.id);
    if (!integration) return res.status(404).json({ error: 'Not found' });
    
    integration.connected = !integration.connected;
    await integration.save();
    
    res.json(integration);
  } catch (error) {
    res.status(400).json({ error: 'Failed to toggle integration' });
  }
});

export default router;
