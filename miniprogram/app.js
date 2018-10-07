const modules = require('./modules/index.js')
//app.js
App({
  onLaunch(options) {
    console.log(options)

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      console.log('wx cloud init')
      wx.cloud.init({
        traceUser: true,
      })
      console.log('wx cloud init end')
    }


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    if (options.scene === 1044) {
      this.getShareInfo(options.shareTicket)
        .then(res => this.getOpenGId(res))
        .catch(err => this.err(err))
    }

  },

  globalData: {
    debug: true,
    userInfo: null,
    accountCollection: new modules.AccountCollection(),
  },

  log(text) {
    if (this.globalData.debug) console.log(text)
  },

  error(text) {
    if (this.globalData.debug) console.error(text)
  },

  getShareInfo(shareTicket) {
    return new Promise((resolve, reject) => {
      wx.getShareInfo({
        shareTicket: shareTicket,
        success: res => resolve(res),
        fail: err => reject(err)
      })
    })
  },

  getOpenGId(res) {
    let { encryptedData, iv } = res

    // 登录
    wx.login({
      success: res => {
        let code = res.code
        wx.cloud.callFunction({
          name: 'getOpengid',
          data: {
            encryptedData,
            iv,
            code
          }
        }).then(res => {
          if(this.getShareInfoCallback) {
            this.getShareInfoCallback(res)
          }
        })
          .catch(err => this.error(err))
      }
    })
  }
})