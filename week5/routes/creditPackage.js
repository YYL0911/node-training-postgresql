const express = require('express')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})


const creditPackage = require('../controllers/creditPackage')

//取得購買方案列表
router.get('/', creditPackage.getCreditPackage)

//新增購買方案
router.post('/', creditPackage.postCreditPackage)

//刪除購買方案
router.delete('/:creditPackageId', creditPackage.deleteCreditPackage)

//使用者購買方案
router.post('/:creditPackageId', auth, creditPackage.postUserCreditPackage)

module.exports = router
