'use strict'

const connexion = require('../handlers/connexion')

module.exports = (app) => {

    app.post('/like/:id', connexion.like)
    app.post('/block/:id', connexion.block)
    app.post('/report/:id', connexion.report)

    app.get('/likeby', connexion.likedBy)
    app.get('/like', connexion.liked)
    // app.get('/connected', connexion.connected)

    app.delete('/like/:id', connexion.unlike)
    app.delete('/block/:id', connexion.unblock)

}
