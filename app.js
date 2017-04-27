"use strict"

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const conf = require('./config/conf')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const Queries = require('./queries')


var insertDocuments = (db, callback) => {
  // Get the documents collection
  var collection = db.collection('documents')
  // Insert some documents
  collection.insertMany([
    {id : 1, message: "gg", timestamp: 144584545}
  ], (err, result) => {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    assert.equal(1, result.ops.length)
    console.log("Inserted 3 documents into the document collection")
    callback(result)
  })
}

var findDocuments = (db, callback) => {
  // Get the documents collection
  var collection = db.collection('documents')
  // Find some documents
  collection.find().toArray((err, docs) => {
    assert.equal(err, null)
    // assert.equal(2, docs.length)
    console.log("Found the following records")
    callback(docs)
  })
}

var updateDocuments = (db, callback) => {
  // Get the documents collection
  var collection = db.collection('documents')
  // Find some documents
  collection.update({id: 1}, {
    $push: {
      message: {
        timestamp: 15656,
        sender: 5,
        comment: 'hcco'
      },
    }
  }, (err, result) => {
    assert.equal(err, null)
    // assert.equal(2, docs.length)
    console.log("Updating the following records")
    callback(result)
  })
}

let query = new Queries()
  // .then(() => query.Create({chat: 'kjkkjkj'}))
  // .then(() => query.Find({}))

var deleteDocument = (db, callback) => {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.deleteOne({ id : 1 }, (err, result) => {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log("Removed the document with the field a equal to 3")
    callback(result)
  })
}



let app = express()

app.use(morgan('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended: false}))

	.use(session({
		secret: conf.session.secret,
		resave: "true",
		saveUninitialized: "true",
		cookie: {}
	}))
	.use(express.static(__dirname + '/public'))


//Routes
require('./routes/user')(app)
require('./routes/tags')(app)
require('./routes/pics')(app)
require('./routes/connexion')(app)
require('./routes/notif')(app)
// require('./routes/chat')(app)

// (:User)--------	<= Dernier message lu
// 	 			        \
//	 		(:Chat)->(:Chat)->(:Chat)
//	 												/
// (:User) ----------------

// OU

// (:User1)
// 	 		\ <= notif = true lorsque User2 écrit
//	 		(:Chat)->(:Chat)->(:Chat)
//	 		/
// (:User2)

app.listen(conf.server.port)
console.log(`Server starting in ${conf.server.host} ${conf.server.port}`)
