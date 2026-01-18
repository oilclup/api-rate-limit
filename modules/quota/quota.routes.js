import express from 'express'
import { getUserData, TIERS } from '../../middleware/rate_limit.js';

const router = express.Router()

router.get('/', async (req, res) => {
     const userId = req.headers['x-user-id'];
     //console.log("x-user-id", userId);

     if (!userId) {
          return res.status(400).json({ error: 'x-user-id header is required' });
     }

     const userData = getUserData(userId);

     //console.log("userData", userData);
     if (!userData) {
          return res.status(404).json({ error: 'User not found' });
     }

     const limits = TIERS[userData.tier];
     //console.log("limits", limits);
     res.json({
          success: true,
          userId,
          tier: userData.tier,
          quota: {
            hourly: {
              limit: limits.hourly,
              used: userData.hourly.count,
              remaining: limits.hourly - userData.hourly.count
            },
            daily: {
              limit: limits.daily,
              used: userData.daily.count,
              remaining: limits.daily - userData.daily.count
            }
          },
          timestamp: new Date().toISOString()
        });

})

export default router
