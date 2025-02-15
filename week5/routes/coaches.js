const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')

const logger = require('../utils/logger')('Coaches')

function isUndefined (value) {
  return value === undefined
}

function isNotValidSting (value) {
  return typeof value !== 'string' || value.trim().length === 0 || value === ''
}

function isNumber (value) {
  return typeof value == 'Number' && value > 0
}



router.get('/', async (req, res, next) => {
  try {
    const {per, page} =  req.query
    if (isNumber(per) && isNumber(page)) {
      const coaches = await dataSource.getRepository('Coach').find({
        select: ['id', 'name']
      })

      let startIdx = (page-1)*per
      let endIdx = page*per
      let sendData = coaches.slice(startIdx,endIdx)
      
      res.status(200).json({
        status: 'success',
        data: sendData
      })
    }
    return

  } catch (error) {
    logger.error(error)
    next(error)
  }
})



router.get('/:coachId', async (req, res, next) => {
  try {
    const { coachId } = req.params
    if (isUndefined(coachId) || isNotValidSting(coachId)) {
      res.status(400).json({
        status: 'failed',
        message: 'ID錯誤'
      })
      return
    }
    
    const result = await dataSource.getRepository('Coach').find({
      select: ['id', 'user_id', 'experience_years', 'description', 'profile_image_url', 'created_at',  'updated_at'] ,
      where: { id: coachId }
    })

    if (result.affected === 0) {
      res.status(400).json({
        status: 'failed',
        message: '找不到該教練'
      })
      return
    }

    const userInfo = await userRepository.findOne({
      select: ['name', 'role'],
      where: { id: result.user_id }
    })
    res.status(201).json({
      status: 'success',
      data: {
        user: userInfo,
        coach: result
      }
    })

  } catch (error) {
    logger.error(error)
    next(error)
  }
})

module.exports = router