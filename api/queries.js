'use strict'

const assert = require('assert')
const {host, port, table} = require('./config/conf').mongo
const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')

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
        console.log("Connected correctly to server")
        resolve(this._db.collection('chat'))
      })
    })
  }

  Close () {
    return new Promise ((resolve) => {
      this._db.close()
      this._db = null
      console.log("Close server successfull")
      resolve()
    })
  }

  Create (users) {
    // Insert some documents
    return new Promise ((resolve, reject) => {
      if (typeof users !== 'object' || users.length !== 2)
        return reject({error: 'Parameters incompatible'})
      this._collection.updateOne({users: {"$in": users}, users: {"$size": users.length}}, {
        $set: {
          users,
          visible: true
        },
      }, {upsert: true}, (err, result) => {
        if (err) return reject({error: err})
        console.log(`Inserted ${users} into the chat collection`)
        console.log('*****', result, '*************')
        resolve(result)
      })
    })
  }

  FindComments (users) {
    // Find some documents
    return new Promise ((resolve, reject) => {
      this._collection.findOne({users: {"$in": users}, users: {"$size": users.length}}, (err, docs) => {
        if (err) return reject({error: err})
        if (!docs) return reject({error: 'No resources found'})
        console.log(`Found the following records where users is ${users}`)
        docs.chat.sort((a, b) => b.timestamp - a.timestamp)
        resolve(docs.chat)
      })
    })
  }

  AddComment (users, message) {
    const comment = message.comment
    return new Promise ((resolve, reject) => {
      if (typeof users !== 'object' || users.length !== 2 || !comment)
        return reject({error: 'Parameters incompatible'})
      this._collection.update({users: {"$in": users}, users: {"$size": users.length}}, {
        $push: {
          chat: {
            timestamp: Date.now(),
            sender: users[0],
            comment
          }
        }
      }, (err, result) => {
        if (err) return reject({error: err})
        console.log("Updating the following records")
        resolve(result)
      })
    })
  }

  Delete (users) {
    // Get the documents collection
    return new Promise ((resolve, reject) => {
      this._collection.update({
        users: {
          "$in": users
        },
        users: {
          "$size": users.length
        }
      }, {
        $set: {
          visible: false
        }
      }, (err, result) => {
        if (err) return reject({error: err})
        if (result.result.n !== 1) return reject({error: 'Opération impossible'})
        console.log("Removed the chat")
        resolve(result)
      })
    })
  }

  FindAll () {
    // Find some documents
    return new Promise ((resolve, reject) => {
      this._collection.find().toArray((err, docs) => {
        if (err) return reject({error: err})
        console.log(`Found the following records :`)
        console.log(docs)
        resolve(docs)
      })
    })
  }

  DeleteAll () {
    return new Promise ((resolve, reject) => {
      this._collection.deleteMany({}, (err, result) => {
        if (err) return reject({error: err})
        console.log('Removing Ok')
        resolve('Ok')
      })
    })
  }
}
