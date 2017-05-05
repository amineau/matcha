'use strict'

const chat = require('../handlers/chat')
const restrict = require('../models/restrict')

module.exports = (app) => {

    app.post('/chat/:id', restrict, chat.add)
    app.get('/chat/:id', restrict, chat.get)

}
