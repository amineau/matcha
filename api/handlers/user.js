'use strict'

const DbParser	 	  = require("../models/parser/db")
const UserValidator = require("../models/parser/user")
const UserQuery     = require("../models/shema/user")
const db			      = require("../db")
const bcrypt        = require('bcrypt')
const _             = require('lodash')
const passport      = require('passport')
const jwt           = require('jsonwebtoken')

const Parser = new DbParser()
const Query  = new UserQuery()

exports.getByData = (req, res) => {
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
      res.json({
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

exports.get = (req, res) => {
  const id = req.decoded.id
  const showSuccess = (data) => {
    res.json({
      success: true,
      data
    })
  }
  const showError = (err) => {
    console.log(err)
      res.json({
          success: false,
          err: err.error || err
      })
  }

    Query.Get({id})
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError);
}

exports.get = (req, res) => {
  const id = req.params.id
  const showSuccess = (data) => {
    res.json({
      success: true,
      data
    })
  }
  const showError = (err) => {
    console.log(err)
      res.json({
          success: false,
          err: err.error || err
      })
  }

    Query.GetPrivate({id})
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
        console.log(err)
        res.json({
            success: false,
            err: err.error
        })
    }

    validate.user.Parse([
      {name: 'login'},
      {name: 'email'},
      {name: 'password'},
      {name: 'firstName'},
      {name: 'lastName'}
    ])
      .then(data => {
        return new Promise((resolve, reject) => {
          Promise.all([
            Query.Get({email: data.email}),
            Query.Get({login: data.login}),
          ])
            .then(result => {
              if (!_.isEmpty(result[0].results[0].data[0]))
                return reject({error: 'L\'email existe déjà'})
              else if (!_.isEmpty(result[1].results[0].data[0]))
                return reject({error: 'Le login existe déjà'})
              resolve(data)
            })
          })
      })
        .then(Query.Create)
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError)
}

exports.signIn = (req, res, next) => {
  const nconf = req.app.get('nconf')
  passport.authenticate('local', (err, user, info) => {
    console.log('*****', err, '*****')
    if (err) {
      return res.json({
        success: false,
        err
      })
    }
    if (!user) {
      return res.json({success: false, err: info})
    }
    let payload = {
      login: user.login,
      email: user.email,
      id: user.id,
    }
    return res.json({
      success: true,
      token: jwt.sign(payload, nconf.get('token:secret'), { expiresIn: nconf.get('token:expires') })
    })
  })(req, res, next)
}

exports.set = (req, res) => {
    const id = req.decoded.id
    const validate = {
      user: new UserValidator(req.body)
    }

    const showSuccess = () => {
        res.json({
          success: true
        })
    }
    const showError = (err) => {
      console.log(err)
        res.json({
            success: false,
            err: err.error
        })
    }
    validate.user.Parse([
          {name: 'firstName', noReq: true},
          {name: 'lastName', noReq: true},
          {name: 'login', noReq: true},
          {name: 'prefer', noReq: true},
          {name: 'sex', noReq: true},
          {name: 'bio', noReq: true}
        ])
        .then((data) => Query.Set({id}, data))
        .then(Parser.GetTrue)
        .then(showSuccess)
        .catch(showError)
}

exports.delete = (req, res) => {
  const id = req.decoded
  const showSuccess = () => {
      res.json({
        success: true
      })
  }
  const showError = (err) => {
    console.log(err)
      res.json({
          success: false,
          err: err.error
      })
  }
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

  Query.Delete(id)
    .then(Parser.GetTrue)
    .then(sessionDestroy)
    .then(showSuccess)
    .catch(showError)
}