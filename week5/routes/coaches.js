const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')

const logger = require('../utils/logger')('Coaches')
const { isUndefined, isNotValidSting, isNotValidInteger } = require('../utils/validation');


router.get('/', async (req, res, next) => {
  try {
    const {per, page} =  req.query
    const perN = Number(per)
    const pageN = Number(page)
    
    if (isNotValidInteger(perN) || isNotValidInteger(pageN)) {
      logger.warn('欄位格式錯誤')
      res.status(400).json({
        status: 'failed',
        message: '欄位格式錯誤'
      })
      return
    }

    // 抓取Coach ID 以及該教練user_id
    const coaches = await dataSource.getRepository('Coach').find({
      select: ['id', 'user_id']
    })

    // 抓取User 是教練的 ID 以及該User name
    const userRepository = dataSource.getRepository('User')
    const userInfo = await userRepository.find({
      select: ['id', 'name'],
      where: { role: 'COACH' }
    });

    // 將資料改成Coach ID，條件是User id == Coach user_id
    for(let i = 0; i < userInfo.length; i++){
      let targetId = userInfo[i].id; // User id
      for(let j = 0; j < coaches.length; j++ ){
        //條件是User id == Coach user_id
        if(coaches[j].user_id == targetId){
          userInfo[i].id = coaches[j].id;
          break;
        }
      }
    }


    // 根據分頁，以及每頁幾筆去切割陣列範圍
    const startIdx = (pageN-1)*perN;
    const endIdx = pageN*perN;
    const sendData = userInfo.slice(startIdx,endIdx);

    
    res.status(200).json({
      status: 'success',
      data: sendData
    })
    
    

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

    if (result.length === 0) {
      res.status(400).json({
        status: 'failed',
        message: '找不到該教練'
      })
      return
    }

    
    const userRepository = dataSource.getRepository('User')
    const userInfo = await userRepository.findOne({
      select: ['name', 'role'],
      where: { id: result[0].user_id }
    })
    res.status(200).json({
      status: 'success',
      data: {
        user: userInfo,
        coach: result[0]
      }
    })

  } catch (error) {
    logger.error(error)
    next(error)
  }
})

module.exports = router
