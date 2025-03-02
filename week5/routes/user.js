const express = require('express')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Users')


const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})


const user = require('../controllers/user')


//註冊
router.post('/signup', user.postSignup)

//使用者登入
router.post('/login', user.postLogin)

//取得個人資料
router.get('/profile', auth, user.getProfile)

//變更個人資料
router.put('/profile', auth, user.putProfile)


//使用者更新密碼
router.put('/password', auth, user.putPassword)

//取得已預約的課程列表
router.get('/courses', auth, user.getCourseBooking)

//取得使用者已購買的方案列表
router.get('/credit-package', auth, user.getCreditPackage)


module.exports = router
