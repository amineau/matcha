'use strict'

const passport      = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserQuery     = require("./models/shema/user")
const DbParser	 	  = require("./models/parser/db")
const bcrypt        = require('bcrypt')

const Parser = new DbParser()
const Query  = new UserQuery()

passport.use(new LocalStrategy({
  usernameField: 'login'
}, (login, password, done) => {
  Query.Get({login})
    .then(Parser.GetData)
    .then(user => {
      user = user[0]
      console.log('%%%%%%%%%%', password, '==========',user)
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

module.exports = passport
