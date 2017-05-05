'use strict'

const connexion = require('../handlers/connexion')
const restrict = require('../models/restrict')

module.exports = (app) => {

    app.post('/like/:id', restrict, connexion.like)
    app.post('/block/:id', restrict, connexion.block)
    app.post('/report/:id', restrict, connexion.report)
    app.post('/visite/:id', restrict, connexion.visite)

    app.get('/likeby', restrict, connexion.likedBy)
    app.get('/like', restrict, connexion.liked)
    app.get('/block', restrict, connexion.blocked)
    // app.get('/connected', connexion.connected)

    app.delete('/like/:id', restrict, connexion.unlike)
    app.delete('/block/:id', restrict, connexion.unblock)

}
