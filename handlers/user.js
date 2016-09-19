'use strict';

const DbParser	 	= require("../models/dbparser");
const UserValidator = require("../models/uservalidator");
const UserQuery     = require("../models/userquery");
const db			= require("../db");
const bcrypt        = require('bcrypt');


const Parser = new DbParser();
const Query  = new UserQuery();

exports.getById = (req, res) => {
    const validate = new UserValidator(req.params);
    const showSuccess = (data) => {
        res.json(data);
    };
    const showError = (err) => {
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };

    validate.ParseId()
        .then(Query.GetById)
        .then(Parser.GetData)
        .then(showSuccess)
        .catch(showError);
};

exports.getIdByLogin = (req, res) => {
    const validate = new UserValidator(req.params);
    const showSuccess = (data) => {
        res.json(data);
    };
    const showError = (err) => {
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };

    validate.ParserLogin()
        .then(Query.GetByLogin)
        .then(Parser.GetId)
        .then(showSuccess)
        .catch(showError);
};

exports.getIdByEmail = (req, res) => {
    const validate = new UserValidator(req.params);
    const showSuccess = (data) => {
        res.json(data);
    };
    const showError = (err) => {
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };

    validate.ParserEmail()
        .then(Query.GetByEmail)
        .then(Parser.GetId)
        .then(showSuccess)
        .catch(showError);
};

exports.signUp = (req, res) => {
    const validate  = new UserValidator(req.body);
    const showSuccess = (data) => {
        res.json(data);
    };
    const showError = (err) => {
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };

    validate.ParseRegister()
        .then(Query.AddUser)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};

exports.signIn = (req, res) => {
    const validate  = new UserValidator(req.body);

    const comparePass = (data) => {
      return new Promise((resolve, reject) => {
          if (bcrypt.compareSync(req.body.password, data.results[0].password)) {
              resolve(data.results[0].id);
          } else {
              reject({
                  status: 403
              });
          }
      });
    };
    const showSuccess = (data) => {
        if (req.session.userId){
            res.status(401).json({
                success: false,
                err: "Vous êtes déjà connecté"
            });
        } else {
            req.session.userId = data;
            res.json({
                success: true,
                id: data
            });
        }
    };

    const showError = (err) => {
        if (err.status == 403 || err.status == 404) {
            err.status = 401;
            err.error = "Login et/ou mot de passe incorrect"
        }
        console.log("err: ", err);
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };


    validate.ParseLogin()
        .then(Query.GetPassword)
        .then(Parser.GetData)
        .then(comparePass)
        .then(showSuccess)
        .catch(showError);
};

exports.logout = (req, res) => {
    let promise = new Promise((resolve, reject) => {
        if (req.session.userId) {
            req.session.destroy((err) => {
                if (err)
                    reject(err);
                else
                    resolve({success: true});
            })
        } else {
            reject({
                status: 401,
                error: "Déconnexion impossible, vous n'êtes pas connecté."
            });
        }
    });
    const showSuccess = (data) => {
        res.json(data);
    };
    const showError = (err) => {
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };
    promise()
        .then(showSuccess)
        .catch(showError);
}

exports.setLogin = (req, res) => {
    const id 	= req.session.userId;
    const login	= req.body.login;
    const query	=
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.name = {login}
        RETURN u;`;
    const params	= {
        'id': id,
        'login': login
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setEmail = (req, res) => {
  const id 	  = req.session.userId;
  const email = req.body.email;
  const query =
      `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.email = {email}
        RETURN u;`;
  const params	= {
    'id': req.session.userId,
    'email': email
  };

  reqDatabase(query, params, parser.getDebug, res);
};

exports.setPassword = (req, res) => {
    const sha256 	= crypto.createHash("sha256");
    const id 	= req.session.userId;
    const email = req.body.password;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.password = {password}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'password': sha256.update(password).digest("base64")
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setFirstName = (req, res) => {
    const id 	    = req.session.userId;
    const firstName = req.body.firstName;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.firstName = {firstName}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'firstName': firstName
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setLastName = (req, res) => {
    const id 	    = req.session.userId;
    const lastName = req.body.lastName;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.firstName = {firstName}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'lastName': lastName
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setSex = (req, res) => {
    const id 	= req.session.userId;
    const sex   = req.body.sex;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.sex = {sex}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'sex': sex
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setPrefer = (req, res) => {
    const id 	 = req.session.userId;
    const prefer = req.body.prefer;
    const query  =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.prefer = {prefer}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'prefer': prefer
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setBio = (req, res) => {
    const id 	= req.session.userId;
    const bio   = req.body.bio;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.bio = {bio}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'bio': bio
    };

    reqDatabase(query, params, parser.getDebug, res);
};