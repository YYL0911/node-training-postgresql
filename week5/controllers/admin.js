const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('AdminController')

dayjs.extend(utc)
const monthMap = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12
}

const { isUndefined, isNotValidSting, isNotValidInteger, isNotValidUuid} = require('../utils/validation');

//新增教練課程資料(未使用middlewares)
/*
router.post('/coaches/courses', async (req, res, next) => {
  try {
    const {
      user_id: userId, skill_id: skillId, name, description, start_at: startAt, end_at: endAt,
      max_participants: maxParticipants, meeting_url: meetingUrl
    } = req.body
    if (isUndefined(userId) || isNotValidSting(userId) ||
      isUndefined(skillId) || isNotValidSting(skillId) ||
      isUndefined(name) || isNotValidSting(name) ||
      isUndefined(description) || isNotValidSting(description) ||
      isUndefined(startAt) || isNotValidSting(startAt) ||
      isUndefined(endAt) || isNotValidSting(endAt) ||
      isUndefined(maxParticipants) || isNotValidInteger(maxParticipants) ||
      isUndefined(meetingUrl) || isNotValidSting(meetingUrl) || !meetingUrl.startsWith('https')) {
      logger.warn('欄位未填寫正確')
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }
    const userRepository = dataSource.getRepository('User')
    const existingUser = await userRepository.findOne({
      select: ['id', 'name', 'role'],
      where: { id: userId }
    })
    if (!existingUser) {
      logger.warn('使用者不存在')
      res.status(400).json({
        status: 'failed',
        message: '使用者不存在'
      })
      return
    } else if (existingUser.role !== 'COACH') {
      logger.warn('使用者尚未成為教練')
      res.status(400).json({
        status: 'failed',
        message: '使用者尚未成為教練'
      })
      return
    }
    const courseRepo = dataSource.getRepository('Course')
    const newCourse = courseRepo.create({
      user_id: userId,
      skill_id: skillId,
      name,
      description,
      start_at: startAt,
      end_at: endAt,
      max_participants: maxParticipants,
      meeting_url: meetingUrl
    })
    const savedCourse = await courseRepo.save(newCourse)
    const course = await courseRepo.findOne({
      where: { id: savedCourse.id }
    })
    res.status(201).json({
      status: 'success',
      data: {
        course
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
})
*/

// 新增教練課程資料
async function postCourses (req, res, next) {
  try {
    const { id } = req.user
    const {
      skill_id: skillId, name, description, start_at: startAt, end_at: endAt,
      max_participants: maxParticipants, meeting_url: meetingUrl
    } = req.body
    if (isUndefined(skillId) || isNotValidSting(skillId) ||
      isUndefined(name) || isNotValidSting(name) ||
      isUndefined(description) || isNotValidSting(description) ||
      isUndefined(startAt) || isNotValidSting(startAt) ||
      isUndefined(endAt) || isNotValidSting(endAt) ||
      isUndefined(maxParticipants) || isNotValidInteger(maxParticipants) ||
      isUndefined(meetingUrl) || isNotValidSting(meetingUrl) || !meetingUrl.startsWith('https')) {
      logger.warn('欄位未填寫正確')
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }
    const courseRepo = dataSource.getRepository('Course')
    const newCourse = courseRepo.create({
      user_id: id,
      skill_id: skillId,
      name,
      description,
      start_at: startAt,
      end_at: endAt,
      max_participants: maxParticipants,
      meeting_url: meetingUrl
    })
    const savedCourse = await courseRepo.save(newCourse)
    const course = await courseRepo.findOne({
      where: { id: savedCourse.id }
    })
    res.status(201).json({
      status: 'success',
      data: {
        course
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

//編輯教練課程資料
async function putCourses (req, res, next) {
  try {
    const { id } = req.user
    const { courseId } = req.params
    const {
      skill_id: skillId, name, description, start_at: startAt, end_at: endAt,
      max_participants: maxParticipants, meeting_url: meetingUrl
    } = req.body

    if (isNotValidUuid(courseId)) {
      res.status(400).json({
        status: 'failed',
        message: 'ID錯誤'
      })
      return
    }


    if (isNotValidSting(courseId) ||
      isUndefined(skillId) || isNotValidSting(skillId) ||
      isUndefined(name) || isNotValidSting(name) ||
      isUndefined(description) || isNotValidSting(description) ||
      isUndefined(startAt) || isNotValidSting(startAt) ||
      isUndefined(endAt) || isNotValidSting(endAt) ||
      isUndefined(maxParticipants) || isNotValidInteger(maxParticipants) ||
      isUndefined(meetingUrl) || isNotValidSting(meetingUrl) || !meetingUrl.startsWith('https')) {
      logger.warn('欄位未填寫正確')
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }
    const courseRepo = dataSource.getRepository('Course')
    const existingCourse = await courseRepo.findOne({
      where: { id: courseId, user_id: id }
    })
    if (!existingCourse) {
      logger.warn('課程不存在')
      res.status(400).json({
        status: 'failed',
        message: '課程不存在'
      })
      return
    }
    const updateCourse = await courseRepo.update({
      id: courseId
    }, {
      skill_id: skillId,
      name,
      description,
      start_at: startAt,
      end_at: endAt,
      max_participants: maxParticipants,
      meeting_url: meetingUrl
    })
    if (updateCourse.affected === 0) {
      logger.warn('更新課程失敗')
      res.status(400).json({
        status: 'failed',
        message: '更新課程失敗'
      })
      return
    }
    const savedCourse = await courseRepo.findOne({
      where: { id: courseId }
    })
    res.status(200).json({
      status: 'success',
      data: {
        course: savedCourse
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

//將使用者新增為教練
async function postCoaches (req, res, next) {
  try {
    const { userId } = req.params
    const { experience_years: experienceYears, description, profile_image_url: profileImageUrl = null } = req.body
   
    if (isNotValidUuid(userId)) {
      res.status(400).json({
        status: 'failed',
        message: 'ID錯誤'
      })
      return
    }

    if (isUndefined(experienceYears) || isNotValidInteger(experienceYears) || isUndefined(description) || isNotValidSting(description)) {
      logger.warn('欄位未填寫正確')
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }
    if (profileImageUrl && !isNotValidSting(profileImageUrl) && !profileImageUrl.startsWith('https')) {
      logger.warn('大頭貼網址錯誤')
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }
    const userRepository = dataSource.getRepository('User')
    const existingUser = await userRepository.findOne({
      select: ['id', 'name', 'role'],
      where: { id: userId }
    })
    if (!existingUser) {
      logger.warn('使用者不存在')
      res.status(400).json({
        status: 'failed',
        message: '使用者不存在'
      })
      return
    } else if (existingUser.role === 'COACH') {
      logger.warn('使用者已經是教練')
      res.status(409).json({
        status: 'failed',
        message: '使用者已經是教練'
      })
      return
    }
    const coachRepo = dataSource.getRepository('Coach')
    const newCoach = coachRepo.create({
      user_id: userId,
      experience_years: experienceYears,
      description,
      profile_image_url: profileImageUrl
    })
    const updatedUser = await userRepository.update({
      id: userId,
      role: 'USER'
    }, {
      role: 'COACH'
    })
    if (updatedUser.affected === 0) {
      logger.warn('更新使用者失敗')
      res.status(400).json({
        status: 'failed',
        message: '更新使用者失敗'
      })
      return
    }
    const savedCoach = await coachRepo.save(newCoach)
    const savedUser = await userRepository.findOne({
      select: ['name', 'role'],
      where: { id: userId }
    })
    res.status(201).json({
      status: 'success',
      data: {
        user: savedUser,
        coach: savedCoach
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

//取得教練自己的月營收資料
async function getCoachRevenue (req, res, next) {
  try {
    const { id } = req.user
    const { month } = req.query
    if (isUndefined(month) || !Object.prototype.hasOwnProperty.call(monthMap, month)) {
      logger.warn('欄位未填寫正確')
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    const courseRepo = dataSource.getRepository('Course')
    const courses = await courseRepo.find({
      select: ['id'],
      where: { user_id: id }
    })
    //找尋此教練有開的課程id
    const courseIds = courses.map(course => course.id)
    if (courseIds.length === 0) {
      res.status(200).json({
        status: 'success',
        data: {
          total: {
            revenue: 0,
            participants: 0,
            course_count: 0
          }
        }
      })
      return
    }

    //已預訂的課程
    const courseBookingRepo = dataSource.getRepository('CourseBooking')
    //收尋的日期範圍
    const year = new Date().getFullYear()
    const calculateStartAt = dayjs(`${year}-${month}-01`).startOf('month').toISOString()
    const calculateEndAt = dayjs(`${year}-${month}-01`).endOf('month').toISOString()
    
    //在指定日期內的未刪除的所有課程筆數
    const courseCount = await courseBookingRepo.createQueryBuilder('course_booking')
      .select('COUNT(*)', 'count')
      .where('course_id IN (:...ids)', { ids: courseIds })
      .andWhere('cancelled_at IS NULL')
      .andWhere('created_at >= :startDate', { startDate: calculateStartAt })
      .andWhere('created_at <= :endDate', { endDate: calculateEndAt })
      .getRawOne()
    
    //在指定日期內的未刪除的訂單中，有幾位不同的使用者
    const participants = await courseBookingRepo.createQueryBuilder('course_booking')
      .select('COUNT(DISTINCT(user_id))', 'count')
      .where('course_id IN (:...ids)', { ids: courseIds })
      .andWhere('cancelled_at IS NULL')
      .andWhere('created_at >= :startDate', { startDate: calculateStartAt })
      .andWhere('created_at <= :endDate', { endDate: calculateEndAt })
      .getRawOne()

    //總共堂數以及總金額
    const totalCreditPackage = await dataSource.getRepository('CreditPackage').createQueryBuilder('credit_package')
      .select('SUM(credit_amount)', 'total_credit_amount')
      .addSelect('SUM(price)', 'total_price')
      .getRawOne()

    //平均一堂課多少錢
    const perCreditPrice = totalCreditPackage.total_price / totalCreditPackage.total_credit_amount
    //總營收
    const totalRevenue = courseCount.count * perCreditPrice
    res.status(200).json({
      status: 'success',
      data: {
        total: {
          revenue: Math.floor(totalRevenue),
          participants: parseInt(participants.count, 10),
          course_count: parseInt(courseCount.count, 10)
        }
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

//取得教練自己的課程詳細資料
async function getCoachCourseDetail (req, res, next) {
  try {
    const { courseId } = req.params
    
    //驗證格式
    if (isNotValidUuid(courseId)) {
      res.status(400).json({
        status: 'failed',
        message: 'ID錯誤'
      })
      return
    }

    //找尋指定課程
    const course = await dataSource.getRepository('Course').findOne({
      select: {
        id: true,
        name: true,
        description: true,
        start_at: true,
        end_at: true,
        max_participants: true,
        meeting_url: true,
        Skill: {
          name: true
        }
      },
      where: { id: courseId },
      relations: {
        Skill: true
      }
    })

    if(!course){
      logger.warn('找不到該課程')
      res.status(400).json({
        status: 'failed',
        message: '找不到該課程'
      })
      return
    }


    res.status(200).json({
      status: 'success',
      data: {
        id: course.id,
        name: course.name,
        description: course.description,
        start_at: course.start_at,
        end_at: course.end_at,
        max_participants: course.max_participants,
        skill_name: course.Skill.name,
        meeting_url: course.meeting_url
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

//取得教練自己的詳細資料
async function getCoachProfile (req, res, next) {
  try {
    const { id } = req.user

    //取得該教練資訊以及該教練的技能id
    const result = await dataSource.getRepository('Coach').findOne({
      select: {
        id: true,
        experience_years: true,
        description: true,
        profile_image_url: true,
        CoachLinkSkill: {
          skill_id: true
        }
      },
      where: { user_id: id },
      relations: {
        CoachLinkSkill: true
      }
    })
    logger.info(`result: ${JSON.stringify(result, null, 1)}`)
    
    res.status(200).json({
      status: 'success',
      data: {
        id: result.id,
        experience_years: result.experience_years,
        description: result.description,
        profile_image_url: result.profile_image_url,
        skill_ids: result.CoachLinkSkill.length > 0 ? result.CoachLinkSkill.map(skill => skill.skill_id) : result.CoachLinkSkill
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

//取得教練自己的課程列表
async function getCoachCourses (req, res, next) {
  try {
    const { id } = req.user
    //找此教練有開的課程
    const courses = await dataSource.getRepository('Course').find({
      select: {
        id: true,
        name: true,
        start_at: true,
        end_at: true,
        max_participants: true
      },
      where: {
        user_id: id
      }
    })

    //所有課程的ID
    const courseIds = courses.map((course) => course.id)

    //在預定課程中 未取消預定的每堂課程課程分別的總人數
    const coursesParticipant = await dataSource.getRepository('CourseBooking')
      .createQueryBuilder('course_booking')
      .select('course_id')
      .addSelect('COUNT(course_id)', 'count')
      .where('course_id IN (:...courseIds)', { courseIds })
      .andWhere('cancelled_at is null')
      .groupBy('course_id')
      .getRawMany()
    logger.info(`coursesParticipant: ${JSON.stringify(coursesParticipant, null, 1)}`)

    const now = new Date()
    res.status(200).json({
      status: 'success',
      data: courses.map((course) => {
        const startAt = new Date(course.start_at)
        const endAt = new Date(course.end_at)

        //根據目前查詢時間以及課程時間來對推出目前課程的狀態
        let status = '尚未開始'
        if (startAt < now) {
          status = '進行中'
          if (endAt < now) {
            status = '已結束'
          }
        }

        //找目前此課程的報名人數
        const courseParticipant = coursesParticipant.find((courseParticipant) => courseParticipant.course_id === course.id)
        return {
          id: course.id,
          name: course.name,
          status,
          start_at: course.start_at,
          end_at: course.end_at,
          max_participants: course.max_participants,
          participants: courseParticipant ? courseParticipant.count : 0
        }
      })
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

//變更教練資料
async function putCoachProfile (req, res, next) {
  try {
    const { id } = req.user
    const {
      experience_years: experienceYears,
      description,
      profile_image_url: profileImageUrl = null,
      skill_ids: skillIds
    } = req.body

    if (isUndefined(experienceYears) || isNotValidInteger(experienceYears) ||
      isUndefined(description) || isNotValidSting(description) ||
      isUndefined(profileImageUrl) || isNotValidSting(profileImageUrl) ||
      !profileImageUrl.startsWith('https') ||
      isUndefined(skillIds) || !Array.isArray(skillIds)) {
      logger.warn('欄位未填寫正確')
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    if (skillIds.length === 0 || skillIds.every(skill => isUndefined(skill) || isNotValidSting(skill) || isNotValidUuid(skill))) {
      logger.warn('欄位未填寫正確')
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    const coachRepo = dataSource.getRepository('Coach')
    const coach = await coachRepo.findOne({
      select: ['id'],
      where: { user_id: id }
    })

    //變更基本資訊
    await coachRepo.update({
      id: coach.id
    }, {
      experience_years: experienceYears,
      description,
      profile_image_url: profileImageUrl
    })

    // 把全部擅長技能重新加入
    const coachLinkSkillRepo = dataSource.getRepository('CoachLinkSkill')
    const newCoachLinkSkill = skillIds.map(skill => ({
      coach_id: coach.id,
      skill_id: skill
    }))

    //刪除全部舊有擅長技能
    await coachLinkSkillRepo.delete({ coach_id: coach.id })
    //加入新的擅長技能
    const insert = await coachLinkSkillRepo.insert(newCoachLinkSkill)
    logger.info(`newCoachLinkSkill: ${JSON.stringify(newCoachLinkSkill, null, 1)}`)
    logger.info(`insert: ${JSON.stringify(insert, null, 1)}`)
    
    //取得更新後的資訊
    const result = await coachRepo.find({
      select: {
        id: true,
        experience_years: true,
        description: true,
        profile_image_url: true,
        CoachLinkSkill: {
          skill_id: true
        }
      },
      where: { id: coach.id },
      relations: {
        CoachLinkSkill: true
      }
    })
    logger.info(`result: ${JSON.stringify(result, null, 1)}`)
    
    res.status(200).json({
      status: 'success',
      data: {
        id: result[0].id,
        experience_years: result[0].experience_years,
        description: result[0].description,
        profile_image_url: result[0].profile_image_url,
        skill_ids: result[0].CoachLinkSkill.map(skill => skill.skill_id)
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}




module.exports = {
    postCourses,
    putCourses,
    postCoaches,
    getCoachRevenue,
    getCoachCourses,
    getCoachCourseDetail,
    putCoachProfile,
    getCoachProfile
}