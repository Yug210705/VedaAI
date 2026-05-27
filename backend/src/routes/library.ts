import { Router } from 'express';
import Resource from '../models/Resource';

const router = Router();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ date: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Create a resource
router.post('/', async (req, res) => {
  try {
    const newResource = new Resource(req.body);
    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create resource' });
  }
});

// Toggle star on a resource
router.put('/:id/star', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    
    resource.starred = !resource.starred;
    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete a resource
router.delete('/:id', async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);
    if (!deletedResource) return res.status(404).json({ error: 'Resource not found' });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

export default router;
