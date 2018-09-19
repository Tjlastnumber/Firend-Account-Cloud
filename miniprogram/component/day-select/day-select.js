// component/day-select/day-select.js
const uitls = require('../../utils/util.js')
const today = uitls.today()
const app = getApp()


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    year: {
      type: Number,
      value: 1,
      observer() {
        this._initDay()
      }
    },
    month: {
      type: Number,
      value: 1,
      observer() {
        this._initDay()
      }
    },
    day: {
      type: String,
      value: 1,
      observer(newVal, oldVal) {
        this.setData({
          istoday: today.year == this.data.year && today.month == this.data.month && today.day == newVal
        })
      }
    },
    tags: {
      type: Array,
      value: [],
      observer() {
        this._initDay()
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    everyDay: []
  },

  ready() {
    app.log("day-select ready start")
    this._initDay()
    app.log('day-select ready end')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _initDay() {
      app.log('init day');
      var day_number = new Date(this.data.year, this.data.month, 0).getDate()
      var every_day = []
      for (var d = 1; d <= day_number; d++) {
        var week = new Date(this.data.year, this.data.month - 1, d).getDay()

        every_day.push({
          id: 'd-' + d,
          tag: this.data.tags.some(v => v === d),
          year: this.data.year,
          month: this.data.month,
          week: uitls.toWeek(week),
          istoday: this.data.year == today.year && this.data.month == today.month && d == today.day,
          day: d,
        })
      }
      this.setData({
        everyDay: every_day
      })
    },
    _selectDay(e) {
      this.setData({
        day: e.target.dataset.item.day
      })
      this.triggerEvent('selectedDay', e.target.dataset.item, e.option)
    },
    _onscroll(e) {
    }
  }
})
