'use strict'

const connexion = require('../handlers/notif')

module.exports = (app) => {

    app.get('/notif', connexion.notif)

}
