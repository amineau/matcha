'use strict'

const assert = require('assert')
const {host, port, table} = require('./config/conf').mongo
const MongoClient = require('mongodb').MongoClient

module.exports = class Queries {

  constructor () {
    this._result = null
    this._errors = null
    this._txtUrl = `mongodb://${host}:${port}/${table}`
    return new Promise ((resolve) => {
      MongoClient.connect(this._txtUrl, (err, db) => {
        assert.equal(null, err)
        this._db = db
        console.log("Connected correctly to server")
        this._collection = this._db.collection('chat')
        resolve()
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

  Create (data, callback) {
    // Insert some documents
    this._collection.insert(data, (err, result) => {
      assert.equal(err, null)
      // assert.equal(1, result.result.n)
      // assert.equal(1, result.ops.length)
      console.log(`Inserted ${data} into the chat collection`)
      callback(result)
    })
  }

  Find (where, callback) {
    // Find some documents
    this._collection.find(where).toArray((err, docs) => {
      assert.equal(err, null)
      // assert.equal(2, docs.length)
      console.log(`Found the following records where ${where}`)
      callback(docs)
    })
  }
}
