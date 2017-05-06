'use strict'

const DbParser	 	  = require("../models/parser/db")
const GenerateQuery = require("../models/shema/generate")
const TagQuery      = require("../models/shema/tags")
const UserQuery     = require("../models/shema/user")
const PicQuery      = require("../models/shema/pic")
const ConnexionQuery = require("../models/shema/connexion")
const db			      = require("../db")
const fs            = require("fs")
const path          = require("path")
const _             = require('lodash')
const generator     = require('../../generator')
const bcrypt        = require('bcrypt')
const saltRounds    = 10

function hash(password) {
    return bcrypt.hashSync(password, saltRounds)
}

const Parser = new DbParser()
const Query  = {
  generate: new GenerateQuery(),
  user: new UserQuery(),
  tag: new TagQuery(),
  pic: new PicQuery(),
  connexion: new ConnexionQuery()
}

exports.generate = (req, res) => {
  const nb = req.params.nb
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
  const sexOp = (sex) => sex === 'M' ? 'W' : 'M'
  let user = []
  for(let i=0; i<nb; i++) {
    const index = Math.round((generator.firstName.length - 1) * Math.random())

    const login = generator.login[Math.round((generator.login.length - 1) * Math.random())].login
    const firstName = generator.firstName[index].firstName
    const lastName = generator.lastName[Math.round((generator.lastName.length -1) * Math.random())].lastName
    const sex = generator.firstName[index].sex
    const email = `${firstName.slice(0, 1)}${lastName.replace(' ', '').toLowerCase()}@${generator.email[Math.round((generator.email.length - 1) * Math.random())].email}`
    const prefer = 'MWB'.concat(sexOp(sex).repeat(7)).charAt(Math.round(9 * Math.random()))
    const bio = generator.bio[Math.round((generator.bio.length - 1) * Math.random())].bio
    const score = Math.round(500 * Math.random())
    user.push({login, firstName, lastName, email, sex, prefer, bio, score, password: hash('Youhou55')})
  }
  user.push({login: 'Toto', firstName:'Thomas', lastName:'Durand', email:'tdurand@hotmail.fr', sex:'M', prefer:'W', bio:'', score:10000, password: hash('Youhou55')})

  Query.generate.DeleteAll()
    .then(() => Query.generate.Generate({user}))
    .then((data) => {
      console.log(data.results[0].data)
      let i = 0
      const begin = data.results[0].data[0].row[0]
      const finish = data.results[0].data[0].row[0] + data.results[0].stats.nodes_created
      for (let id=begin; id <finish; id++) {
        Query.pic.Add({id, pic: `generator/photo/${data.results[0].data[i++].row[1]}/${Math.round(782*Math.random())}.jpg`, head:true})
        for (let t=0; t<3+12*Math.random(); t++) {
          Query.tag.Add({id, tag: generator.tag[Math.round((generator.tag.length - 1) * Math.random())].tag})
        }
        for (let t=0; t<nb/10; t++) {
          const liked = begin + Math.round(Math.random() * (finish-begin))
          if (liked !== id) {
            Query.connexion.Visite({userId: id, id: liked})
            Query.connexion.Like({userId: id, id: liked})
          }
        }
        for (let t=0; t<nb/20; t++) {
          const liked = begin + Math.round(Math.random() * (finish-begin))
          if (liked !== id) {
            Query.connexion.Visite({userId: id, id: liked})
          }
        }
      }
    })
    // .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError);
}
