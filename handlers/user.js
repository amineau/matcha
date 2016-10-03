'use strict';

const DbParser	 	= require("../models/parser/db");
const UserValidator = require("../models/parser/user");
const UserQuery     = require("../models/shema/user");
const Auth          = require("../models/auth");
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
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseLogin = (data) => {
        return validate.ParseLogin(data);
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
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseEmail = (data) => {
        return validate.ParseEmail(data);
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
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParsePassword = (data) => {
        return validate.ParsePassword(data);
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
        .then(ParsePassword)
        .then(Query.SetPassword)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};

exports.setFirstName = (req, res) => {
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseFirstName = (data) => {
        return validate.ParseFirstName(data);
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
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseLastName = (data) => {
        return validate.ParseLastName(data);
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
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseSex = (data) => {
        return validate.ParseSex(data);
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
        .then(ParseSex)
        .then(Query.SetSex)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};

exports.setPrefer = (req, res) => {
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParsePrefer = (data) => {
        return validate.ParsePrefer(data);
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
        .then(ParsePrefer)
        .then(Query.SetPrefer)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};

exports.setBio = (req, res) => {
    const validate = new UserValidator(req.body);
    const auth = new Auth (req.session);

    const ParseBio = (data) => {
        return validate.ParseBio(data);
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
        .then(ParseBio)
        .then(Query.SetBio)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};