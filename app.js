var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//For log in
//var passport = require('passport');
//var LocalStrategy = require('passport-strategy').Strategy;
//for Config
var config = require('config');
var dbURI = config.get('Mongo.URI');

//For routes
var index = require('./routes/index');
var users = require('./routes/users');
var MyQs = require('./routes/MyQs');
var GiveAnswers = require('./routes/GiveAnswers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);    //call for home page
app.use('/users', users);
app.use('/MyQs', MyQs);
app.use('/GiveAnswers', GiveAnswers);

//for log in
/*app.post('/users',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: true })
);*/

app.post('/postQs', function(req, res){           //update values in db
 // input value from search
  var question = req.body.search;
  var askedby = req.body.user;
  var askedon = req.body.tTime;
  console.log(question);
  
  var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect(dbURI, function (err, db) {
        db.collection('QAcollection', function (err, collection) {
            collection.insertOne({
                askedby: askedby, 
                question: question,
                askedon: askedon,
                answeredby: null,
                answer: null,
                answeredon: null,
                tags: null,
                likes: 0, 
                comments: [	
                  {
                      user:null,
                      message: null,
                      dateCreated: null,
                      like: 0 
                  }
                ]
            })
        });
    });
    
    res.set(200);
    res.send();
});

app.get('/getQ', function(req, res){                // for main page. Questions with answers
    var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect(dbURI, function (err, db) {
        
        db.collection('QAcollection', function (err, collection) {
            if(err) throw err;
            collection.find({answer:{$ne:null}}).sort( { _id: -1 } ).toArray(function(err, items) {
                if(err) throw err;  
                res.send(items);
            }); 
        });
    });
});

app.get('/getMyQs', function(req, res){     // for MyQs page
    var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect(dbURI, function (err, db) {
        
        db.collection('QAcollection', function (err, collection) {
            
            collection.find({ askedby: 'dummy' }).sort( { _id: -1 } ).toArray(function(err, items) {      //filter for particlar user. code will be changed after LDAP added.
                if(err) throw err;  
                res.send(items);
            }); 
        });
    });
});

app.get('/getQwithoutA', function(req, res){     // only questions for Give Answer page
    var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect(dbURI, function (err, db) {
        
        db.collection('QAcollection', function (err, collection) {
            
            collection.find({ answer : null }).sort( { _id: -1 } ).toArray(function(err, items) {
                if(err) throw err;  
                res.send(items);
            }); 
        });
    });
});

app.get('/postAns', function(req, res){     // post answers from Give Answer page
   var AnsVal = req.query.AnsVal;
   var tTime = req.query.tTime;
   var user = req.query.user;
   var idDoc = req.query.idDoc;
   
   var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect(dbURI, function (err, db) {
        
        db.collection('QAcollection', function (err, collection) {
            
            collection.updateMany(
                { question : req.query.question },
                { $set: { "answer" : AnsVal } }
            );
            collection.updateMany(
                { question : req.query.question },
                { $set: { "answeredby" : user } }
            );
            collection.updateMany(
                { question : req.query.question },
                { $set: { "answeredon" : tTime } }
            );
        });
    });
    res.set(200);
    res.send();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;