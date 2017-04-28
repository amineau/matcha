'use strict'

const pics = require('../handlers/pics')

module.exports = (app) => {

    app.post('/pic', pics.add)
    app.get('/pic/:id', pics.get)
    app.get('/pic/profil/:id', pics.getProfil)
    app.put('/pic/:id', pics.profile)
    app.delete('/pic/:id', pics.delete)

}
