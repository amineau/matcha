'use strict'

const DbParser	 	  = require("../models/parser/db");
const UserValidator = require("../models/parser/user");
const UserQuery     = require("../models/shema/user");
const Auth          = require("../models/auth");
const db			      = require("../db");
const bcrypt        = require('bcrypt');

const Parser = new DbParser();
const Query  = new UserQuery();

exports.get = (req, res) => {
  const {by, data} = req.params
  const validate = {
    user: new UserValidator({[by]: data})
  }
  const showSuccess = (data) => {
    res.json({
      success: true,
      data
    })
  }
  const showError = (err) => {
    console.log(err)
      res.status(err.status || 500).json({
          success: false,
          err: err.error || err
      })
  }

  validate.user.Parse([{ name: by }])
      .then(Query.Get)
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError);
}

exports.signUp = (req, res) => {
    const validate  = {user: new UserValidator(req.body)}
    const showSuccess = () => {
        res.json({
            success: true
        })
    }
    const showError = (err) => {
        console.log(err);
        res.status(err.status).json({
            success: false,
            err: err.error
        });
    };

    validate.user.Parse([
      {name: 'login'},
      {name: 'email'},
      {name: 'password'},
      {name: 'firstName'},
      {name: 'lastName'}
    ])
        .then(Query.Create)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError);
};

exports.signIn = (req, res) => {
    const validate  = {user: new UserValidator(req.body)}
    const auth      = new Auth(req.session)

    const comparePass = (data) => {
      return new Promise((resolve, reject) => {
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
              let id = data[0].id;
              resolve({id})
          } else {
              reject({
                  status: 403
              })
          }
      })
    }

    const showSuccess = (data) => {
        req.session.userId = data.id;
        console.log(req.session);
        res.json({
          success: true,
          data
        })
    }

    const showError = (err) => {
        console.log(err);
        if (err.status == 403 || err.status == 404) {
            err.status = 401;
            err.error = "Login et/ou mot de passe incorrect"
        }
        res.status(err.status).json({
            success: false,
            err: err.error
        })
    }

    auth.CheckAuth()
        .then(() => validate.user.Parse([
          {name: 'login'}
        ]))
        .then(Query.Get)
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
      res.json({
        success: true,
        data
      });
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

exports.set = (req, res) => {
    const id = req.session.userId
    const validate = {
      user: new UserValidator(req.body)
    }
    const auth = new Auth (req.session);

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
    auth.CheckNoAuth()
        .then(() => validate.user.Parse([
          {name: 'firstName', noReq: true},
          {name: 'lastName', noReq: true},
          {name: 'login', noReq: true},
          {name: 'prefer', noReq: true},
          {name: 'sex', noReq: true},
          {name: 'bio', noReq: true}
        ]))
        .then((data) => Query.Set({id}, data))
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError)
}
