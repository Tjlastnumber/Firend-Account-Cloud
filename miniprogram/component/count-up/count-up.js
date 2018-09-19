// component/count-up.js
const cu = require('../../utils/countUp.js')
const util = require('../../utils/util.js')
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    class: String,
    options: {
      type: Object,
      value: {
      useEasing: true, 
      useGrouping: true, 
      separator: ',', 
      decimal: '.', 
      }
    },
    startVal: {
      type: Number,
      value: 0
    },
    endVal: {
      type : Number,
      value: 0,
      observer(newVal, oldVal, changePath) {
        this._countUp(newVal, oldVal)
      }
    },
    decimals: Number,
    duration: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0,
    fontSize: 60
  },

  ready() {
    this._countUp()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _countUp(newVal, oldVal) {
      var newVal = newVal || 0
      var oldVal = oldVal || 0
      var countUp = new cu.CountUp(this, 'count', oldVal, newVal, this.data.decimals, this.data.duration, this.data.options)
      if (!countUp.error) {
        countUp.start(() => {
        })
        app.log(this.data.count)
      } else {
        app.error(countUp.error)
      }
    }
  }
})
