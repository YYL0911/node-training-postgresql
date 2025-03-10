/*
  驗證教練身分
*/

const FORBIDDEN_MESSAGE = '使用者尚未成為教練'
const PERMISSION_DENIED_STATUS_CODE = 401

function generateError (status = PERMISSION_DENIED_STATUS_CODE, message = FORBIDDEN_MESSAGE) {
  const error = new Error(message)
  error.status = status
  error.message = message
  return error
}

module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'COACH') {
    next(generateError())
    return
  }
  next()
}