'use strict';

const DbParser	 	= require("../models/parser/db");
const PicValidator  = require("../models/parser/pic");
const PicQuery      = require("../models/shema/pic");
const Auth          = require("../models/auth");

const db			= require("../db");

const Parser = new DbParser();
const Query  = new PicQuery();

/*function reqDatabase(query, params, parser, res) {
    const showSuccess = (data) => {
      res.json({
        success: true,
        data
      });
    };
    const showError = (err) => {
      res.json(err);
    };

    return db.doDatabaseOperation(query, params, parser)
        .then(showSuccess)
        .catch(showError);
}

function countPicture(id) {
    const query =
        `MATCH (u: User)-[]->(i :Img)
        WHERE id(u) = {id}
        RETURN count(i);`;
    const params = {'id': id};

    const showSuccess = (data) => {
        console.log(data);
        return data;
    };
    const showError = (err) => {
        console.log(err);
        return 0;
    };

    return db.doDatabaseOperation(query, params, parser.getDebug)
        .then(showSuccess)
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
};*/

function PositionPicture(ret) {
    const showSuccess = (data) => {
        ret.index = data[0].count;
        return ret;
    };
    const showError = (err) => {
        return err;
    };
    return Query.Count(ret)
        .then(Parser.GetData)
        .then(showSuccess)
        .catch(showError);
}

exports.add = (req, res) => {
    const validate = new PicValidator(req.body);
    const auth = new Auth (req.session);

    const ParsePic = (data) => {
        return validate.ParsePic(data);
    };

    const showSuccess = () => {
        res.json({
            success: true
        });
    };
    const showError = (err) => {
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };
    auth.CheckNoAuth()
        .then(ParsePic)
        .then(PositionPicture)
        .then(Query.Add)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
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

    reqDatabase(query, params, Parser.getDebug, res);
};

exports.delete = (req, res) => {
    const auth = new Auth (req.session);

    const ParseIdPic = (data) => {
        return validate.ParseIdPic(data);
    };

    const showSuccess = () => {
        res.json({
            success: true
        });
    };
    const showError = (err) => {
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };

    auth.CheckNoAuth()
        .then(ParseIdPic) //Change index
        .then(Query.Delete)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};
