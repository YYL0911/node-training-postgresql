//檢查是否有必要輸入
function isUndefined (value) {
  return value === undefined
}

//檢查字串輸入
function isNotValidSting (value) {
  return typeof value !== 'string' || value.trim().length === 0 || value === ''
}

//檢查數字輸入
function isNotValidInteger (value) {
  return typeof value !== 'number' || value < 0 || value % 1 !== 0
}



// 將函式導出
module.exports = {
  isUndefined,
  isNotValidSting,
  isNotValidInteger
};
