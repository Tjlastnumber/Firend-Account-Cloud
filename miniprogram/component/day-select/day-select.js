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
      value: today.year,
      observer() {
        this._initDay()
      }
    },
    month: {
      type: Number,
      value: today.month,
      observer() {
        this._initDay()
      }
    },
    day: {
      type: String,
      value: 1,
      observer(newVal, oldVal) {
        this.setData({
          selectedDay: newVal
        })
      }
    },
    tags: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedDay: 0,
    everyDay: [],
    today: today
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
          tag: this.data.tags.find(v => v === d),
          year: this.data.year,
          month: this.data.month,
          week: uitls.toWeek(week),
          day: d,
        })
      }
      this.setData({
        everyDay: every_day
      })
    },
    _selectDay(e) {
      app.log(e.target.dataset.item)
      this.setData({
        selectedDay: e.target.dataset.item.day
      })
      this.triggerEvent('selectedDay', e.target.dataset.item, e.option)
    },
    _onscroll(e) {
    }
  }
})
