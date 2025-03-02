const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')

const logger = require('../utils/logger')('Skill')

const skill = require('../controllers/skill')

router.get('/', skill.getSkill)

router.post('/', skill.postSkill)

router.delete('/:skillId', skill.deleteSkill)


module.exports = router
