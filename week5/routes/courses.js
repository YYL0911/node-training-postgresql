const express = require('express')
const { IsNull } = require('typeorm')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Course')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})

const courses = require('../controllers/courses')

//取得課程列表
router.get('/', courses.getCourse)

// 報名課程
router.post('/:courseId', courses.postCourse)

// 取消課程
router.delete('/:courseId', courses.deleteCourse)


module.exports = router