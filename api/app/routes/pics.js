'use strict'

const pics = require('../handlers/pics')
const restrict = require('../models/restrict')

module.exports = (app) => {

    app.post('/pic', restrict, pics.add)
    app.get('/pic/:id', restrict, pics.get)
    app.get('/pic/profil/:id', restrict, pics.getProfil)
    app.put('/pic/:id', restrict, pics.profile)
    app.delete('/pic/:id', restrict, pics.delete)

}
