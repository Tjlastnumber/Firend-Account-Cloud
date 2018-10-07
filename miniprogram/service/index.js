const accountService = require('./account-service.js')
const shareAccountService = require('./share-account-service.js')

module.exports = {
    account: accountService,
    shareAccount: shareAccountService
}
