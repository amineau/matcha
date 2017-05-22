'use strict'

const passport      = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const UserQuery     = require("./models/shema/user")
const DbParser	 	  = require("./models/parser/db")
const bcrypt        = require('bcrypt')
const conf          = require('./config/conf.json')

const Parser = new DbParser()
const Query  = new UserQuery()

passport.use(new LocalStrategy({
  usernameField: 'login'
}, (login, password, done) => {
  Query.GetPrivate({login})
    .then(Parser.GetData)
    .then(user => {
      user = user[0]
      if (!user) {
        done(null, false, {error: 'Utilisateur inconnu'})
      } else if (!bcrypt.compareSync(password, user.password)) {
        done(null, false, {error: 'Mot de passe invalide'})
      } else if (user.validation) {
        done(null, false, {error: 'Compte non validé'})
      } else {
        done(null, user)
      }
    })
    .catch(err => done(err))
}))

passport.use(new GoogleStrategy({
    clientID: conf.google.CLIENT_ID,
    clientSecret: conf.google.CLIENT_SECRET,
    callbackURL: "http://localhost:4242/oauth2callback"
  }, (accessToken, refreshToken, profile, cb) => {
    console.log('profile', profile)
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('cb', cb)

  })
)

module.exports = passport
