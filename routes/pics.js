"use strict";

const pics = require('../handlers/pics');

module.exports = (app) => {

    // app.get('/pic/:id', pics.getPic);
    // app.get('/pic/user/:idUser', pics.getPicsByUser);
    app.post('/pic', pics.add);
    // app.put('/pic/:id', pics.profile);
    app.delete('/pic/:id', pics.delete);
};