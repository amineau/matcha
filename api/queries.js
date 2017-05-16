'use strict'

const assert = require('assert')
const {host, port, table} = require('./config/conf').mongo
const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')
const colors = require('colors')

module.exports = class Queries {

  constructor () {
    this._txUrl = `mongodb://${host}:${port}/${table}`
    this.Connect().then(collec => this._collection = collec)
    this._db = null
  }

  Connect () {
    return new Promise ((resolve) => {
      MongoClient.connect(this._txUrl, (err, db) => {
        assert.equal(null, err)
        this._db = db
        resolve(this._db.collection('chat'))
      })
    })
  }

  Close () {
    return new Promise ((resolve) => {
      this._db.close()
      this._db = null
      resolve()
    })
  }

  Create (users) {
    // Insert some documents
    return new Promise ((resolve, reject) => {
      if (typeof users !== 'object' || users.length !== 2)
        return reject({error: 'Parameters incompatible'})
      users.sort((a,b) => a - b)
      this._collection.updateOne({users}, {
        $set: {
          users,
          visible: true
        },
      }, {upsert: true}, (err, result) => {
        if (err) return reject({error: err})
        resolve(result)
      })
    })
  }

  FindComments (users) {
    // Find some documents
    return new Promise ((resolve, reject) => {
      users.sort((a,b) => a - b)
      this._collection.findOne({users}, (err, docs) => {
        if (err) return reject({error: err})
        if (!docs || !docs.chat) return reject({error: 'No resources found'})
        docs.chat.sort((a, b) => a.timestamp - b.timestamp)
        resolve(docs.chat)
      })
    })
  }

  AddComment (users, message) {
    const comment = message.comment
    return new Promise ((resolve, reject) => {
      if (typeof users !== 'object' || users.length !== 2 || !comment)
        return reject({error: 'Parameters incompatible'})
      users.sort((a,b) => a - b)
      this._collection.update({users}, {
        $push: {
          chat: {
            timestamp: Date.now(),
            sender: users[0],
            comment
          }
        }
      }, (err, result) => {
        if (err) return reject({error: err})
        resolve(result)
      })
    })
  }

  Delete (users) {
    // Get the documents collection
    return new Promise ((resolve, reject) => {
      users.sort((a,b) => a - b)
      this._collection.update({users: [users[0], users[1]]}, {
        $set: { visible: false }
      }, (err, result) => {
        if (err) return reject({error: err})
        if (result.result.n !== 1) return reject({error: 'Opération impossible'})
        resolve(result)
      })
    })
  }

  FindAll () {
    // Find some documents
    return new Promise ((resolve, reject) => {
      this._collection.find({}).toArray((err, docs) => {
        if (err) return reject(console.log(err))
        resolve(docs[0].visible)
      })
    })
  }

  DeleteAll () {
    return new Promise ((resolve, reject) => {
      this._collection.deleteMany({}, (err, result) => {
        if (err) return reject({error: err})
        resolve('Ok')
      })
    })
  }
}
