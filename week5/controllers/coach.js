const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CoachesController')

const { isUndefined, isNotValidSting, isNotValidInteger, isNotValidUuid } = require('../utils/validation');

// 取得教練列表
async function getCoaches (req, res, next)  {
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

    // 方法1 start----------------------------------
    // // 抓取Coach ID 以及該教練user_id
    // const coaches = await dataSource.getRepository('Coach').find({
    //   select: ['id', 'user_id']
    // })

    // // 抓取User 是教練的 ID 以及該User name
    // const userRepository = dataSource.getRepository('User')
    // const userInfo = await userRepository.find({
    //   select: ['id', 'name'],
    //   where: { role: 'COACH' }
    // });

    // // 將資料改成Coach ID，條件是User id == Coach user_id
    // for(let i = 0; i < userInfo.length; i++){
    //   let targetId = userInfo[i].id; // User id
    //   for(let j = 0; j < coaches.length; j++ ){
    //     //條件是User id == Coach user_id
    //     if(coaches[j].user_id == targetId){
    //       userInfo[i].id = coaches[j].id;
    //       break;
    //     }
    //   }
    // }

    // // 根據分頁，以及每頁幾筆去切割陣列範圍
    // const startIdx = (pageN-1)*perN;
    // const endIdx = pageN*perN;
    // const sendData = userInfo.slice(startIdx,endIdx);

    // 方法1 end----------------------------------

    const sendData = await dataSource.getRepository("Coach").find({
      select: {
        id: true,
        User: {
          name: true,
        },
      },
      take: per,
      skip: (pageN-1)*perN,
      relations: {
        User: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: sendData
    })

  } catch (error) {
    logger.error(error)
    next(error)
  }
}

//取得教練資訊
async function getCoachInfo (req, res, next) {
  try {
    const { coachId } = req.params
  
    if (isUndefined(coachId) || isNotValidSting(coachId) || isNotValidUuid(coachId)) {
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
}

//取得指定教練課程列表
async function getCoachCourses (req, res, next) {
  try {
    const { coachId } = req.params

    //驗證id格式
    if (isNotValidUuid(coachId)) {
      res.status(400).json({
        status: 'failed',
        message: 'ID錯誤'
      })
      return
    }


    if (isUndefined(coachId) || isNotValidSting(coachId)) {
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    //該教練資訊
    const coach = await dataSource.getRepository('Coach').findOne({
      select: {
        id: true,
        user_id: true,
        User: {
          name: true
        }
      },
      where: {
        id: coachId
      },
      relations: {
        User: true
      }
    })
    if (!coach) {
      logger.warn('找不到該教練')
      res.status(400).json({
        status: 'failed',
        message: '找不到該教練'
      })
      return
    }
    logger.info(`coach: ${JSON.stringify(coach)}`)

    //該教練課程列表
    const courses = await dataSource.getRepository('Course').find({
      select: {
        id: true,
        name: true,
        description: true,
        start_at: true,
        end_at: true,
        max_participants: true,
        Skill: {
          name: true
        }
      },
      where: {
        user_id: coach.user_id
      },
      relations: {
        Skill: true
      }
    })
    logger.info(`courses: ${JSON.stringify(courses)}`)

    
    res.status(200).json({
      status: 'success',
      data: courses.map((course) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        start_at: course.start_at,
        end_at: course.end_at,
        max_participants: course.max_participants,
        coach_name: coach.User.name,
        skill_name: course.Skill.name
      }))
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

module.exports = {
    getCoaches,
    getCoachInfo,
    getCoachCourses
}