// miniprogram/pages/firend-account/firend-account.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareBtnUrl: 'https://lg-75hzsoiq-1256913426.cos.ap-shanghai.myqcloud.com/add.png',
    userInfo: {},
    avatarUrls: [
      'https://lg-75hzsoiq-1256913426.cos.ap-shanghai.myqcloud.com/user-unlogin.png',
      'https://lg-75hzsoiq-1256913426.cos.ap-shanghai.myqcloud.com/user-unlogin.png',
      'https://lg-75hzsoiq-1256913426.cos.ap-shanghai.myqcloud.com/user-unlogin.png',
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getShareInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getShareInfo() {
    app.getShareInfoCallback = res => {
      console.log(res)
      this.setData({
        openGId: res.result.openGId
      })
    } 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.form === 'button') {
      console.log(res.target)
    }
    return {
      title: '友账',
      desc: '分享给好友或群中一起算账',
      path: '/pages/firend-account/firend-account?id=1123'
    }
  },
})