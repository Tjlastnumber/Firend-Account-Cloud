const util = require('../utils/util.js')

var __accounts = []
const AccountCollection = class {

    constructor(data) {
        __accounts = data || []
    }

    get(date) {
        if (!date || !util.isObject(date)) return __accounts
        var ac = __accounts.find(e => {
            return e.year === date.year &&
                e.month === date.month &&
                e.day === date.day
        })
        return ac ? new Account(ac.account) : undefined
    }

    getMonthIncome(year, month) {
        const today = util.today()
        year = year || today.year
        month = month || today.month
        let account = __accounts.filter(e => e.year === year && e.month === month)
        let am = account.map(p => new Account(p.account).income())

        return am.length === 0 ? 0 : am.reduce((p, c) => {
            return p + c
        }, 0)
    }

    getMonthExpenses(year, month) {
        const today = util.today()
        year = year || today.year
        month = month || today.month
        let account = __accounts.filter(e => e.year === year && e.month === month)
        let am = account.map(p => new Account(p.account).expenses())

        return am.length === 0 ? 0 : am.reduce((p, c) => {
            return p + c
        }, 0)
    }

    getHasDay(date) {
        return __accounts.filter(e => e.year === date.year && e.month === date.month).map(e => e.day)
    }

    isHave = date => __accounts.some(e =>
        e.year === date.year &&
        e.month === date.month &&
        e.day === date.day)

    /**
     * Add or Update Account
     * @param {Object} date 
     * @param {Account} account 
     */
    addOrUpdate(account, date) {
        var date = date || util.today()
        var haveAccount = this.get(date)
        var ac = {
            year: date.year,
            month: date.month,
            day: date.day,
            account: account
        }
        if (haveAccount) {
            __accounts.splice(this.indexOf(date), 1, ac)
        } else {
            __accounts.push(ac)
        }
        return this
    }

    indexOf(date) {
        for (let i = 0; i < __accounts.length; i++) {
            if (__accounts[i].year === date.year &&
                __accounts[i].month === date.month &&
                __accounts[i].day === date.day) return i
        }
        return -1
    }

    /**
     * Remove Account
     * @param {Account} oneDayAccount 
     */
    remove(oneDayAccount) {
        if (this.get(oneDayAccount)) {
            return __accounts.splice(__accounts.indexOf(oneDayAccount), 1)
        } else {
            return undefined
        }
    }

    isEmpty() {
        return this.get().length <= 0
    }
}

const Account = class {
    constructor(data) {
        this.details = data ? data.details : Object.create(null)
    }

    income() {
        var v = Object.keys(this.details).map(key => {
            let detail = this.details[key]
            return detail.type > 0 ? detail.amount : 0
        })

        return v.reduce((p, c) => { return p + c }, 0)
    }

    expenses() {
        var v = Object.keys(this.details).map(key => {
            let detail = this.details[key]
            return detail.type < 0 ? detail.amount : 0
        })

        return v.reduce((p, c) => { return p + c }, 0)
    }

    get(key) {
        return this.details[key]
    }

    add(name, amount) {
        if (util.toNumber(amount) === 0) return
        const date = new Date()
        const key = date.toISOString()
        _setDetials(this.details, key, name, amount, date)
    }

    update(key, name, amount) {
        if (util.toNumber(amount) === 0) return
        const date = new Date()
        _setDetials(this.details, key, name, amount, date)
    }

    delete(key) {
        delete this.details[key]
    }
}

function _setDetials(details, key, name, amount, date) {
    let n = util.toNumber(amount)
    details[key] = {
        amount: Math.abs(amount),
        name: name,
        type: n > 0 ? 1 : n < 0 ? -1 : 0,
        date: date
    }
}

module.exports = {
    AccountCollection: AccountCollection,
    Account: Account
}
