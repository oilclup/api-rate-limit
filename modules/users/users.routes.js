import express from 'express';
import { rateLimitStore, initUserData, TIERS } from '../../middleware/rate_limit.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { userId, tier } = req.body;
  
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  
  if (!tier || !TIERS[tier]) {
    return res.status(400).json({ 
      error: 'Invalid tier. Must be one of: free, standard, premium' 
    });
  }
  //console.log("rateLimitStore" , rateLimitStore);
  
  if (rateLimitStore.has(userId)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  const userData = initUserData(userId, tier);
  rateLimitStore.set(userId, userData);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: {
      userId,
      tier,
      limits: TIERS[tier]
    },
    timestamp: new Date().toISOString()
  });
});

router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'];
  
  if (!rateLimitStore.has(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userData = rateLimitStore.get(userId);
  
  res.json({
    success: true,
    user: {
      userId,
      tier: userData.tier,
      limits: TIERS[userData.tier]
    }
  });
});

export default router;