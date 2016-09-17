"use strict";

const pics = require('../handlers/pics');

module.exports = (app) => {

    app.get('/pic/:id', pics.getPic);
    app.get('/pic/user/:idUser', pics.getPicsByUser);
    app.post('/pic/add', pics.add);
    app.put('/pic/:id/profile', pics.profile);
    app.delete('/pic/:id/delete/', pics.delete);
};