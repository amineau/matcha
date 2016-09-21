'use strict';

const DbParser	 	= require("../models/dbparser");
const UserValidator = require("../models/uservalidator");
const UserQuery     = require("../models/userquery");
const Auth          = require("../models/auth");
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
        .then(Parser.GetData)
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
        .then(Parser.GetData)
        .then(showSuccess)
        .catch(showError);
};

exports.signUp = (req, res) => {
    const validate  = new UserValidator(req.body);
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

    validate.ParseRegister()
        .then(Query.AddUser)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};

exports.signIn = (req, res) => {
    const validate  = new UserValidator(req.body);
    const auth      = new Auth(req.session);

    const ParseAuth = () => {
        return validate.ParseAuth();
    };

    const comparePass = (data) => {
      return new Promise((resolve, reject) => {
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
              let id = data[0].id;
              resolve({id});
          } else {
              reject({
                  status: 403
              });
          }
      });
    };

    const showSuccess = (data) => {
        req.session.userId = data.id;
        res.json(data);
    };

    const showError = (err) => {
        console.log(err);
        if (err.status == 403 || err.status == 404) {
            err.status = 401;
            err.error = "Login et/ou mot de passe incorrect"
        }
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };

    auth.CheckAuth()
        .then(ParseAuth)
        .then(Query.GetPassword)
        .then(Parser.GetData)
        .then(comparePass)
        .then(showSuccess)
        .catch(showError);
};

exports.logout = (req, res) => {
    const auth = new Auth (req.session);

    const sessionDestroy = () => {
        return new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err)
                    reject(err);
                else
                    resolve({success: true});
            });
        });
    };

    const showSuccess = (data) => {
        res.json(data);
    };

    const showError = (err) => {
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };

    auth.CheckNoAuth()
        .then(sessionDestroy)
        .then(showSuccess)
        .catch(showError);
};

exports.setLogin = (req, res) => {
    req.body.id = req.session.userId.toString();
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseLogin = () => {
        return validate.ParseLogin();
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
        .then(ParseLogin)
        .then(Query.SetLogin)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};

exports.setEmail = (req, res) => {
    req.body.id = req.session.userId.toString();
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseEmail = () => {
        return validate.ParseEmail();
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
        .then(ParseEmail)
        .then(Query.SetEmail)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
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
    req.body.id = req.session.userId.toString();
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseFirstName = () => {
        return validate.ParseFirstName();
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
        .then(ParseFirstName)
        .then(Query.SetFirstName)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};

exports.setLastName = (req, res) => {
    req.body.id = req.session.userId.toString();
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseLastName = () => {
        return validate.ParseLastName();
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
        .then(ParseLastName)
        .then(Query.SetLastName)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
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