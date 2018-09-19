//index.js
import * as echarts from '../../component/ec-canvas/echarts';
const util = require('../../utils/util.js')
const modules = require('../../modules/index.js')
//获取应用实例
const app = getApp()
const today = util.today()
let _selected_year

function createIncomeData() {
    var categories = [];
    var data = [];
    for (var i = 0; i < 12; i++) {
        categories.push((i + 1) + '月');
        data.push(app.globalData.accountCollection.getMonthIncome(_selected_year, i + 1));
    }
    return {
        categories: categories,
        data: data
    }
}

function createExpensesData() {
    var categories = [];
    var data = [];
    for (var i = 0; i < 12; i++) {
        categories.push((i + 1) + '月');
        data.push(app.globalData.accountCollection.getMonthExpenses(_selected_year, i + 1));
    }
    return {
        categories: categories,
        data: data
    }
}

function setOption(chart) {
    let incomeData = createIncomeData()
    let expensesData = createExpensesData()

    var option = {
        color: ["#11b719", "#fa4a4d"],
        grid: {
            containLabel: true,
            top: '16px',
            bottom: '8px',
            left: '8px',
            right: '8px'
        },
        tooltip: {
            trigger: 'axis',
            // confine: true,
            position: function(pos, params, dom, rect, size) {
                var contentSize = size.contentSize
                var lr = pos[0] < size.viewSize[0] / 2
                var tb = pos[1] < size.viewSize[1] / 2
                var obj = [(lr ? pos[0] : pos[0] - contentSize[0]), (tb ? pos[1] : pos[1] - contentSize[1])]
                return obj;
            },
            formatter: `{b0}
{a0}: {c0}
{a1}: {c1}`
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: incomeData.categories,
            axisLine: {
                lineStyle: {
                    type: 'solid'
                }
            }
        },
        yAxis: {
            x: 'center',
            type: 'value'
        },
        series: [{
            name: '收入',
            type: 'line',
            data: incomeData.data
        }, {
            name: '支出',
            type: 'line',
            data: expensesData.data
        }]
    };

    chart.setOption(option);
    return chart;
}

Page({
    data: {
        selectedYear: today.year,
        selectedMonth: today.month,
        currentDay: 0,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        checked: true,
        date: util.formatTime(new Date()),
        income: 0,
        expenses: 0,
        details: [],
        bodyHeight: 0,
        chartHeight: 150,
        scrollTop: 0,
        hasAccount: [],
        ec: { lazyLoad: true }
    },
    initChart() {
        this.monthChart.init((canvas, width, height) => {
            const chart = echarts.init(canvas, null, { width: width, height: height })
            setOption(chart)
            this.chart = chart
            return chart
        })
    },
    bindDateChange(e) {
        var date = e.detail.value
        var year = util.toNumber(date.split('-')[0])
        var month = util.toNumber(date.split('-')[1])
        var currentDay = (year === today.year &&
            month === today.month) ?
            today.day : 1
        this.setData({
            date: date,
            selectedYear: year,
            selectedMonth: month
        })

        this._selectedDay({
            detail: {
                year: year,
                month: month,
                day: currentDay
            }
        })
    },
    onLoad: function() {
        app.log('onLoad')

        /**
       *    if (app.globalData.userInfo) {
       *   this.setData({
       *     userInfo: app.globalData.userInfo,
       *     hasUserInfo: true
       *   })
       * } else if (this.data.canIUse) {
       *   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
       *   // 所以此处加入 callback 以防止这种情况
       *   app.userInfoReadyCallback = res => {
       *     this.setData({
       *       userInfo: res.userInfo,
       *       hasUserInfo: true
       *     })
       *   }
       * } else {
       *   // 在没有 open-type=getUserInfo 版本的兼容处理
       *   wx.getUserInfo({
       *     success: res => {
       *       app.globalData.userInfo = res.userInfo
       *       this.setData({
       *         userInfo: res.userInfo,
       *         hasUserInfo: true
       *       })
       *     }
       *   })
        } */
    },
    onShow() {
        app.log('onShow')
        app.globalData.accountCollection = new modules.AccountCollection(wx.getStorageSync('Account'))
        _selected_year = this.data.selectedYear
        if (this.chart) {
            this.initChart()
        }
        if (this.isReady) {
            let someDay = {
                year: this.data.selectedYear,
                month: this.data.selectedMonth,
                day: this.data.currentDay === 0 ? today.day : this.data.currentDay
            }
            this._selectedDay({
                detail: someDay,
            })
        }
    },
    onReady() {
        app.log('index onReady')
        let someDay = {
            year: this.data.selectedYear,
            month: this.data.selectedMonth,
            day: this.data.currentDay === 0 ? today.day : this.data.currentDay
        }
        this.isReady = this._selectedDay({
            detail: someDay,
        })
        wx.createSelectorQuery()
            .in(this)
            .select('#header')
            .boundingClientRect(res => {
                this.setData({
                    bodyHeight: res.height
                })
            }).exec()
        this.monthChart = this.selectComponent('#month-chart')
        this.initChart()
    },
    onPageScroll(e) {
        var maxH = 150
        var height = e.scrollTop > 20 ? 0 : maxH
        this.setData({
            chartHeight: height
        })
    },
    onReachBottom() {
        this.setData({
            chartHeight: 0
        })
    },
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    _selectedDay(e) {
        let year = e.detail.year
        let month = e.detail.month
        let day = e.detail.day
        let account = app.globalData.accountCollection.get({
            year: year,
            month: month,
            day: day
        }) || new modules.Account()
        let details = Object.keys(account.details)
            .map(key => ({ key, val: account.details[key] }))
        this.setData({
            currentDay: day,
            income: account.income(),
            expenses: account.expenses(),
            details: details,
            hasAccount: app.globalData.accountCollection.getHasDay({
                year: year,
                month: month
            })
        })

        return true
    },
    navToAccountInput() {
        let query = 'year=' + this.data.selectedYear + '&month=' + this.data.selectedMonth + '&day=' + this.data.currentDay
        wx.navigateTo({
            url: '../account-input/account-input?' + query,
            success: function(res) {
            },
            fail: function() {
            },
            complete: function() {
            }
        })
    }
})