const _ACCOUNT = 'account'
 
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
    db.collection(_ACCOUNT)
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
    db.collection(_ACCOUNT)
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
    db.collection(_ACCOUNT)
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
    db.collection(_ACCOUNT)
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
    db.collection(_ACCOUNT)
        .doc(options.id)
        .remove({
            success: options.success,
            fail: options.fail
        })
}

module.exports = {
    select: select,
    updateById: updateById,
    add: add,
    remove: removeById,
    setById: setById
}
