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

function convertRad(input){
  return (Math.PI * input)/180
}

function Distance(pos_a, pos_b){

    const R = 6378 //Rayon de la terre en mètre

    if (!pos_b.latitude || !pos_b.longitude || !pos_a.latitude || !pos_b.longitude
        || (pos_b.latitude === pos_a.latitude && pos_b.longitude === pos_a.longitude)) return 0

    const lat_a = convertRad(pos_a.latitude)
    const lon_a = convertRad(pos_a.longitude)
    const lat_b = convertRad(pos_b.latitude)
    const lon_b = convertRad(pos_b.longitude)

    const d = R * (Math.PI/2 - Math.asin( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))
    return Math.round(d)
}

exports.getByData = (req, res) => {
  const {by, data} = req.params
  const userId = req.decoded.id
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
      .then(data => Query.Get(data, {userId}))
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError);
}

exports.getAll = (req, res) => {
  const id = req.decoded.id
  const query = req.query
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

  Promise.all([
    Query.GetAll(_.merge({id}, query))
      .then(Parser.GetData),
    Query.GetPrivate({id})
      .then(Parser.GetData)
  ])
    .then(data => {
      return new Promise((resolve) => {
        console.log(data[1][0])
        const myPosition = {
          latitude: data[1][0].latitude,
          longitude: data[1][0].longitude
        }
        data[0].forEach(e => e.distance = Distance(myPosition, e))
        if (query.sort && query.meaning) {
          data[0].sort((a,b) => Number(query.meaning)*(query.sort === 'birthday' ? -1 : 1)*(a[query.sort] - b[query.sort]))
        }
        resolve(data[0].filter(e => e.distance <= query.distance))
      })
    })
    .then(showSuccess)
    .catch(showError)
}

exports.getLiked = (req, res) => {
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

    Query.GetLiked({id})
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError);
}

exports.getLike = (req, res) => {
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

    Query.GetLike({id})
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError);
}

exports.getVisited = (req, res) => {
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

    Query.GetVisited({id})
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError);
}

exports.getVisite = (req, res) => {
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

    Query.GetVisite({id})
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
      {name: 'lastName'},
      {name: 'sex'},
      {name: 'birthday'},
      {name: 'latitude'},
      {name: 'longitude'}
    ])
      .then(data => {
        return new Promise((resolve, reject) => {
          Promise.all([
            Query.GetPrivate({email: data.email}),
            Query.GetPrivate({login: data.login}),
          ])
            .then(result => {
              if (!_.isEmpty(result[0].results[0].data[0]))
                return reject({
                  error: {
                    email: {message: 'L\'email existe déjà'}
                  }
                })
              else if (!_.isEmpty(result[1].results[0].data[0]))
                return reject({
                  error: {
                    login : {message: 'Le login existe déjà'}
                  }
                })
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
      id: user.id,
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
      res.json({
          success: false,
          err: err.error
      })
    }

    validate.user.Parse([
          {name: 'firstName', noReq: true},
          {name: 'lastName', noReq: true},
          {name: 'birthday', noReq: true},
          {name: 'email', noReq: true},
          {name: 'login', noReq: true},
          {name: 'prefer', noReq: true},
          {name: 'sex', noReq: true},
          {name: 'bio', noReq: true},
          {name: 'latitude', noReq: true},
          {name: 'longitude', noReq: true}
        ]).then(data => {
          return new Promise((resolve, reject) => {
            let promises = []
            const intersection = _.intersection(Object.keys(data), ['login', 'email'])
            intersection.forEach(e => {
              promises.push(Query.GetForSet({
                id,
                [e]: data[e]
              }))
            })
            return Promise.all(promises)
              .then(res => {
                res.every((e, k) => {
                  console.log(e)
                  if (!_.isEmpty(e.results[0].data[0])) {
                    return reject({
                      error: {
                        [intersection[k]]: {message: `${intersection[k]} déjà existant`}
                      }
                    })
                  }
                })
              })
              .then(() => resolve(data))
              .catch(err => reject(err))
          })
        }).then(data => Query.Set({id}, data))
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
