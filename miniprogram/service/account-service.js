function success(res) { }

function fail(err) { console.error(err) }

function defaultOptions(options) {
    options['success'] || (options['success'] = success)
    options['fail'] || (options['fail'] = fail)
    return options;
}

const select = (options) => {

    options = defaultOptions(options)

    const db = wx.cloud.database()
    db.collection('account')
        .where(options.query)
        .get({
            success: options.success,
            fail: options.fail
        })
}

const updateById = options => {
    if (!options.id) {
        throw '[cloud db] {options.id} is undefined'
    }
    options = defaultOptions(options)
    options.data = options.data || {}
    const db = wx.cloud.database()
    db.collection('account')
        .doc(options.id)
        .update({
            data: options.data,
            success: options.success,
            fail: options.fail
        })
}

const setById = options => {
    if (!options.id) {
        throw '[cloud db] {options.id} is undefined'
    }
    options = defaultOptions(options)
    options.data = options.data || {}
    const db = wx.cloud.database()
    db.collection('account')
        .doc(options.id)
        .set({
            data: options.data,
            success: options.success,
            fail: options.fail
        })
}

const add = options => {
    options = defaultOptions(options)
    options.data = options.data || {}
    const db = wx.cloud.database()
    db.collection('account')
        .add({
            data: options.data,
            success: options.success,
            fail: options.fail
        })
}

const removeById = options => {
    if (!options.id) {
        throw '[cloud db] {options.id} is undefined'
    }
    options = defaultOptions(options)
    options.data = options.data || {}
    const db = wx.cloud.database()
    db.collection('account')
        .doc(options.id)
        .remove({
            success: options.success,
            fail: options.fail
        })
}

module.exports = {
    select: select,
    update: updateById,
    add: add,
    remove: removeById,
    setById: setById
}
