import express from 'express'
const newsModule = await import('../../seed/news_data_seed.json', { 
  with: { type: 'json' } 
});
const news = newsModule.default;

import { paginatedResults } from '../../utils/pagination.js'
import { rateLimitMiddleware } from '../../middleware/rate_limit.js';

const router = express.Router()

router.get('/',rateLimitMiddleware, async (req, res) => {
     const page = Number(req.query.page) || 1
     const limit = Number(req.query.limit) || 5
   
     const startIndex = (page - 1) * limit
     const endIndex = page * limit
   
     const rows = news.slice(startIndex, endIndex)
     const count = news.length
   
     const result = await paginatedResults(rows, count, limit, req)
   
     res.json({
       success: true,
       ...result
     })
   })

export default router
