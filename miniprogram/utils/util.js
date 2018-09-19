const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  // const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month].map(formatNumber).join('-')// + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isEmpty = n => {
  return n === null || n === undefined || n === ''
}

const today = () => {
  var date = new Date()
  const year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        week = date.getDay()
  date = null
  return {
    year: year, 
    month: month,
    day: day,
    week: week
  }
}

const weekList = [
  '日',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六'
]
const toWeek = (v) => {
  let i = toNumber(v)
  return weekList[i]
} 

const isObject = (obj) => {
  return obj !== null && typeof obj === 'object'
}

const toNumber = (val) => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

const toMoney = v => {
  return parseFloat(v.toFixed(2)).toLocaleString()
}

const looseEqual = (a, b) => {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

const looseIndexOf = (arr, val) => {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

module.exports = {
  formatTime: formatTime,
  today: today,
  isObject: isObject,
  toNumber: toNumber,
  isEmpty: isEmpty,
  toWeek: toWeek,
  toMoney: toMoney,
  looseEqual: looseEqual,
  looseIndexOf: looseIndexOf
}