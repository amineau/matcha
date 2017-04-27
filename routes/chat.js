'use strict'

const chat = require('../handlers/chat')

module.exports = (app) => {

    app.post('/chat/:id', chat.add)
    app.get('/chat/:id', chat.get)

}
