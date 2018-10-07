// 云函数入口文件
const cloud = require('wx-server-sdk')
const https = require('https')
const wxcrypt = require('./wxcrypte')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = (event, context) => {
  return new Promise((resolve, reject) => {
    const { encryptedData, iv, code, userInfo } = event
    const _SESSION_KEY = `https://api.weixin.qq.com/sns/jscode2session?appid=${userInfo.appId}&secret=7bd8e01bfffda639e1358ee81c6b5614&js_code=${code}&grant_type=`

    let httpRequest = () => {
      return new Promise((resolve, reject) => {
        https.get(_SESSION_KEY, (res) => {
          let sessionKey = ''
          res.on('data', data => {
            sessionKey += data
          })
          res.on('end', () => {
            resolve(JSON.parse(sessionKey))
          })
        }).on('error', err => reject(err))
      })
    }

    httpRequest()
      .then(res => {
        let data = new wxcrypt(userInfo.appId, res.session_key).decryptData(encryptedData, iv)
        resolve(data)
      })
      .catch(err => reject(err))
  })
}