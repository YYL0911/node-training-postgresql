const express = require('express')
const cors = require('cors')
const path = require('path')
const pinoHttp = require('pino-http')

const logger = require('./utils/logger')('App')

const creditPackageRouter = require('./routes/creditPackage')
const skillRouter = require('./routes/skill')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user')
const coachesRouter = require('./routes/coaches')
const coursesRouter = require('./routes/courses')



const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(pinoHttp({
  logger,
  serializers: {
    req (req) {
      return req
    }
  }
}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/healthcheck', (req, res) => {
  res.status(200)
  res.send('OK')
})


app.use('/api/credit-package', creditPackageRouter)
app.use('/api/coaches/skill', skillRouter)
app.use('/api/coaches', coachesRouter)
app.use('/api/admin', adminRouter)
app.use('/api/users', userRouter)
app.use('/api/courses', coursesRouter)



// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  req.log.error(err);
  if (err.status) {
    res.status(err.status).json({
      status: 'failed',
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: '伺服器錯誤',
  });
});

module.exports = app
