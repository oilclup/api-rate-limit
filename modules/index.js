import express from 'express'
import news from './news/news.routes.js'
import quota from './quota/quota.routes.js'
import users from './users/users.routes.js'

const router = express.Router()

router.use('/news', news)
router.use('/quota', quota)
router.use('/users', users)

export default router
