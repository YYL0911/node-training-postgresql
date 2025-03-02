const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')

const logger = require('../utils/logger')('Coaches')

const coach = require('../controllers/coach.js')

// 取得教練列表
router.get('/', coach.getCoaches)

//取得教練資訊
router.get('/:coachId', coach.getCoachInfo)

//取得指定教練課程列表
router.get('/:coachId/courses', coach.getCoachCourses)

module.exports = router
