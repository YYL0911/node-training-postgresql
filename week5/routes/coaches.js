const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Skill')

const AppDataSource = require("../db/data-source")


function isUndefined (value) {
    return value === undefined
}

function isNotValidSting (value) {
    return typeof value !== "string" || value.trim().length === 0 || value === ""
}

function isNotValidInteger (value) {
    return typeof value !== "number" || value < 0 || value % 1 !== 0
}


router.get('/skill', async (req, res, next) => {
    try {
        const Skills = await AppDataSource.getRepository("Skill").find({
            select: ["id", "name"]
        })
        res.status(200).json({
            status: "success",
            data: Skills
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "伺服器錯誤"
        })
    }

})

router.post('/skill', async (req, res, next) => {

    try {
        const data = JSON.parse(req.body)
        if (isUndefined(data.name) || isNotValidSting(data.name) ) {
            res.status(400).json({
                status: "failed",
                message: "欄位未填寫正確"
            })
            return
        }
        const SkillRepo = await AppDataSource.getRepository("Skill")
        const existSkill = await SkillRepo.find({
            where: {
                name: data.name
            }
        })
        if (existSkill.length > 0) {
            res.status(409).json({
                status: "failed",
                message: "資料重複"
            })
            return
        }
        const newSkill = await SkillRepo.create({
          name: data.name,
        })
        const result = await SkillRepo.save(newSkill)
        res.status(200).json({
            status: "success",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "伺服器錯誤"
        })
    }
    
})

router.delete('/skill/:skillId', async (req, res, next) => {
    try {
        
        const skillId = req.params.skillId
        if (isUndefined(skillId) || isNotValidSting(skillId)) {
            res.status(400).json({
                status: "failed",
                message: "ID錯誤"
            })
            return
        }
        const result = await AppDataSource.getRepository("Skill").delete(skillId)
        if (result.affected === 0) {
            res.status(400).json({
                status: "failed",
                message: "ID錯誤"
            })
            return
        }

        res.status(200).json({
            status: "success"
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "伺服器錯誤"
        })
    }
})



module.exports = router
