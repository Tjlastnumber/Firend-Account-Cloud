// pages/account-input/account-input.js
const modules = require('../../modules/index.js')
const util = require('../../utils/util.js')
const service = require('../../service/index.js')

const app = getApp()
const accountService = service.account

Page({

  /**
   * 页面的初始数据
   */
  data: {
    someDay: {},
    amount: 0,
    isincome: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = util.today()
    const someDay = options.year ? {
      year: util.toNumber(options.year),
      month: util.toNumber(options.month),
      day: util.toNumber(options.day)
    } : today

    this.setData({
      someDay: someDay,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onSwiperChange(e) {
    this.setData({
      isincome: e.detail.current !== 0
    })
  },
  save() {
    let someDay = this.data.someDay
    let symbol = this.data.isincome? '+' : '-'
    let account = app.globalData.accountCollection.get(someDay)
    account = account || new modules.Account()
    account.add('', symbol + this.data.amount)
    app.globalData.accountCollection.addOrUpdate(account, someDay)
    wx.setStorageSync('Account', app.globalData.accountCollection.get())
    this.saveToCloud(res => {
      console.log(res)
      let _id = res.data.length > 0 ? res.data[0]._id : undefined
      if (_id) {
        accountService.setById({
          id: _id,
          data: {
            accountCollection: app.globalData.accountCollection.get(),
          },
          success: cloudSuccess,
          fail: cloudFail
        })
      } else {
        accountService.add({
          data: {
            accountCollection: app.globalData.accountCollection.get(),
          },
          success: cloudSuccess,
          fail: cloudFail
        })
      }
    })
    wx.navigateBack({
      delta: 1
    })
  },

  queryAccount() {
    service.account.select({
      query: {
        _openid: app.globalData.openid,
        success: res => {
          console.log(res)
        },
        fail: err => {
          console.error(err)
        }
      }
    })
  },

  // 保存到微信云
  saveToCloud(callback) {
    accountService.select({
      query: {
        _openid: app.globalData.openid,
      },
      success: callback
    })
    // const db = wx.cloud.database() 
    // db.collection('account').add({
    //   data: {
    //     accountCollection: app.globalData.accountCollection.get()
    //   },
    //   success: res => {
    //     wx.showToast({
    //       title: '保存成功',
    //     }) 
    //     console.log('[cloud save] success, _id: ', res._id)
    //   }, 
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '保存失败'
    //     })
    //     console.error('[cloud save] fail: ', err)
    //   }
    // }) 
  },
  _amountChanged(v) {
    this.setData({
      amount: util.toNumber(v.detail.value)
    })
  }
})

function cloudSuccess(res) {
  wx.showToast({
    title: '保存成功',
  })
  console.log('[cloud save] success, _id: ', res._id)
}

function cloudFail(err) {
  wx.showToast({
    icon: 'none',
    title: '保存失败'
  })
  console.error('[cloud save] fail: ', err)
}