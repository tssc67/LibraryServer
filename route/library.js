var express = require('express');
var router = express.Router();
var db;
router.all('/',function(req,res,next){
  res.end("123");
})
module.exports = function(Database){
  db = Database;
  return router;
};
// module.exports = function(Database){
//   db = Database;
//   return router;
// }
