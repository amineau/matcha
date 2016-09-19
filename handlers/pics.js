'use strict';

const ParserDb	 	= require("../models/dbparser");
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

function countPicture(id) {
    const query =
        `MATCH (u: User)-[]->(i :Img)
        WHERE id(u) = {id}
        RETURN count(i);`;
    const params = {'id': id};

    const showSucces = (data) => {
        console.log(data);
        return data;
    };
    const showError = (err) => {
        console.log(err);
        return 0;
    };

    return db.doDatabaseOperation(query, params, parser.getDebug)
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
        `MATCH(i: Img)-[:OWNER]-(u: User)
        WHERE id(u) = {id}
        RETURN i.name;`;
    const params = {'id': id};

    reqDatabase(query, params, parser.getDebug, res);
};

exports.add = (req, res) => {
    const id    = req.session.userId;
    const pic   = req.body.pic;
    var profile = countPicture(id) ? false : true;
    const query =
        `MATCH (u: User)
        WHERE id(u) = {id}
        CREATE(new: Img {name: {pic}})
        CREATE(u)-[p:OWNER {profile: {profile}}]->(new)
        RETURN id(new);`;
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
        `MATCH (u: User)-[f:OWNER]->(l: Img)
        WHERE id(u) = {idUser} AND f.profile = true
        SET f.profile = false
        WITH 1 AS dummy
        MATCH (u:User)-[t:OWNER]->(i: Img)
        WHERE id(u) = {idUser} AND id(i) = {idPic}
        SET t.profile = true
        RETURN t.profile;`;
    const params = {
        'idUser': idUser,
        'idPic': idPic
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.delete = (req, res) => {
    const idUser  = req.session.userId;
    const idPic   = req.params.id;
    const query   =
        `MATCH (u: User)-[r:OWNER]->(i: Img)
        WHERE id(u) = {idUser}
        AND id(i) = {idPic}
        DELETE (r)
        RETURN i, u;`;
    const params = {
        'idUser': idUser,
        'idPic': idPic
    };

    reqDatabase(query, params, parser.getDebug, res);
};