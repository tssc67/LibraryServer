var express = require('express');
var db = require('./db.js').Library("test.sql");
var app = express();
var library = require('./route/library.js');
app.use('/library',library(db));
console.log("Starting library server.");
var sv = app.listen(3000,function(){
    console.log("Server started.");
});
