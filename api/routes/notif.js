'use strict'

const connexion = require('../handlers/notif')
const restrict = require('../models/restrict')

module.exports = (app) => {

    app.get('/notif', restrict, connexion.notif)
    app.put('/notif', restrict, connexion.toFalse)

}
