'use strict';

const ParserDb	 	= require("../models/parser");
const db			= require("../db");
const crypto 		= require("crypto");

const parser = new ParserDb();

function reqDatabase(query, params, parser, res) {
    const showSucces = (data) => {
        // console.log(data);
        res.json(data);
    };
    const showError = (err) => {
        res.json(err);
    };

    return db.doDatabaseOperation(query, params, parser)
        .then(showSucces)
        .catch(showError);
}

exports.getPic = (req, res) => {
    const id 	= req.params.id;
    const query =
        `MATCH(i: Img)
        WHERE id(i) = {id}
        RETURN i.name;`;
    const params = {'id': id};

    reqDatabase(query, params, parser.getDebug, res);
};

exports.getPicsByUser = (req, res) => {
    const id 	= req.params.idUser;
    const query =
        `MATCH(i: Img)-[:OWN]-(u: User)
        WHERE id(u) = {id}
        RETURN i.name;`;
    const params = {'id': id};

    reqDatabase(query, params, parser.getDebug, res);
};

exports.add = (req, res) => {
    const id    = req.session.userId;
    const pic   = req.body.photo;
    const profile = req.body.profile;
    const query =
        `MATCH (u: User)
        WHERE id(u) = {id}
        CREATE(i: Img {name: {pic}})
        CREATE(u)-[:OWNER {profile: {profile}}]->(i)
        RETURN i;`;
    const params = {
        'id': id,
        'pic': pic,
        'profile': profile
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.profile = (req, res) => {
    const idUser  = req.session.userId;
    const idPic   = req.params.id;
    const query =
        `MATCH (u: User)-[r:OWNER]->(p: Img)
        WHERE id(u) = {idUser}
        AND r.profile = false
        AND id(p) = {idPic}
        SET r.profile = true
        RETURN i;`;
    const params = {
        'idUser': idUser,
        'idPic': idPic
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.delete = (req, res) => {
    const idUser  = req.session.userId;
    const idPic   = req.params.id;
    const query =
        `MATCH (u: User)-[:OWNER]->(i: Img)
        `;
    const params = {
        'idUser': idUser,
        'idPic': idPic
    };

    reqDatabase(query, params, parser.getDebug, res);
};