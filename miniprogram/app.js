//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      development: true 
    }

    this.log = text => {
      if (this.globalData.development) console.log(text)
    }

    this.error = text => {
      if (this.globalData.development) console.error(text)
    }
  }
})
