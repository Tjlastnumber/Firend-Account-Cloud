// 数据库名称
const _SHARE_ACCOUNT = 'share_account'

const db = wx.cloud.database()

const select = ({ query }) => {
    return new Promise((resolve, reject) => {
        db.collection(_SHARE_ACCOUNT)
        .where(query)
        .get({
            success: res => resolve(res),
            fail: err => reject(err)
        })
    }) 
}