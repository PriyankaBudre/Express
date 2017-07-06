var express = require('express');
var router = express.Router();

/*
var completedb;
// For db
var MongoClient = require('mongodb').MongoClient;
// Connect to the db
MongoClient.connect("mongodb://localhost:27017/QueAns", function (err, db) {
    
    db.collection('QAcollection', function (err, collection) {
        
        collection.find({ answer : { $ne : null }}).sort( { _id: -1 } ).toArray(function(err, items) {
            if(err) throw err;    
            //console.log(items[0].question);   
            completedb= items;
        }); 
    });
}); */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;