'use strict';

const DbParser	 	= require("../models/parser/db")
const PicValidator  = require("../models/parser/pic")
const PicQuery      = require("../models/shema/pic")
const Auth          = require("../models/auth")
const _             = require('lodash')

const db			= require("../db")

const Parser = new DbParser()
const Query  = new PicQuery()

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



exports.add = (req, res) => {
  const validate = {pic: new PicValidator(req.body)}
  const auth = new Auth (req.session)
  const id = req.session.userId

  const showSuccess = () => {
    res.json({
      success: true
    })
  }
  const showError = (err) => {
    console.log(err)
    res.status(err.status || 500).json({
      success: false,
      err: err.error
    })
  }
  const isHead = (data) => {
    if (data.head)
      return Query.Clear({id})
        .then(() => Promise.resolve(data))
        .catch(err => Promise.reject(err))
    data.head = 0
    return Promise.resolve(data)
  }

  auth.CheckNoAuth()
    .then(() => {
      return Promise.all([
        validate.pic.Parse([
          {name: 'pic'},
          {name: 'head', noReq: true}
        ]),
        Query.Count({id})
          .then(Parser.GetData)
      ])
    })
    .then(data => {
      if (data[1][0].count >= 5) {
        return Promise.reject({
          status: 400,
          error: "Vous ne pouvez pas charger plus de 5 photos"
        })
      } else if (data[1][0].count === 0) {
        data[0].head = 1
      }
      return Promise.resolve(data[0])
    })
    .then(data => isHead(data))
    .then(data => Query.Add(_.merge(data, {id})))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.profile = (req, res) => {
  const auth = new Auth (req.session)
  const userId  = req.session.userId;
  const picId   = req.params.id;

  const showSuccess = () => {
      res.json({
          success: true
      })
  }
  const showError = (err) => {
      res.status(err.status).json({
          success: false,
          err: err.error
      })
  }

  auth.CheckNoAuth()
      .then(() => Query.Profile({userId, picId}))
      .then(Parser.GetTrue)
      .then(showSuccess)
      .catch(showError);
};

exports.delete = (req, res) => {
    const auth = new Auth (req.session)

    const ParseIdPic = (data) => {
        return validate.ParseIdPic(data);
    }

    const showSuccess = () => {
        res.json({
            success: true
        })
    }
    const showError = (err) => {
        res.status(err.status).json({
            success: false,
            err: err.error
        })
    }

    auth.CheckNoAuth()
        .then(ParseIdPic) //Change index
        .then(Query.Delete)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};
