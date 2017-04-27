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

  Create (ids) {
    // Insert some documents
    return new Promise ((resolve, reject) => {
      if (typeof ids !== 'object' || ids.length !== 2)
        return reject({status: 401, error: 'Parameters incompatible'})
      this._collection.updateOne({ids}, {
        ids,
        visible: true,
      }, {upsert: true}, (err, result) => {
        if (err) return reject({status: 403, error: err})
        console.log(`Inserted ${ids} into the chat collection`)
        resolve(result)
      })
    })
  }

  FindComments (ids) {
    // Find some documents
    return new Promise ((resolve, reject) => {
      this._collection.findOne({ids: {"$in": ids}, ids: {"$size": ids.length}}, (err, docs) => {
        if (err) return reject({status: 403, error: err})
        if (!docs) return reject({status: 401, error: 'No resources found'})
        console.log(`Found the following records where ids is ${ids}`)
        resolve(docs.comment)
      })
    })
  }

  AddComment (ids, comment) {
    return new Promise ((resolve, reject) => {
      if (typeof ids !== 'object' || ids.length !== 2 || !comment)
        return reject({status: 401, error: 'Parameters incompatible'})
      this._collection.update({ids: {"$in": ids}, ids: {"$size": ids.length}}, {
        $push: {
          comment: {
            timestamp: Date.now(),
            sender: ids[0],
            comment
          }
        }
      }, (err, result) => {
        if (err) return reject({status: 403, error: err})
        console.log("Updating the following records")
        resolve(result)
      })
    })
  }

  Delete (ids) {
    // Get the documents collection
    return new Promise ((resolve, reject) => {
      this._collection.deleteMany({ids}, (err, result) => {
        if (err) return reject({status: 403, error: err})
        if (result.result.n !== 1) return reject({status: 400, error: 'Opération impossible'})
        console.log("Removed the chat")
        resolve(result)
      })
    })
  }
}
