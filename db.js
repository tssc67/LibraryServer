var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var async = require('async');
var errTxt = "DB_ERROR";

function isNum(val){//Expensive
  return /^[0-9]+$/.test(val);
}
function isValidNumInput(txt){
  if(txt==""||!txt)return true;

  return isNum(txt);
}
function getNum(txt){
  var matched = txt.match(/[0-9]/g)
  return matched?matched.join(""):"";
}
function Library(Database){
  var db = Database;
  function checkLibrary(callback){
    async.parallel(
      [
        function(callback){
          db.run(cmd("createBooksTable.sql"),callback);
        }
        ,
        function(callback){
          db.run(cmd("createBorrowListTable.sql"),callback);
        }
      ],function(err){
          if(err)return callback(new Error(errTxt));
          callback();
        }
    )
  }
  function isBookAvailable(id,callback){

    try{
      var stmt = db.prepare(cmd("getBookLeft.sql"));
      stmt.all(id,function(err,rows){
        if(err)
          return callback(new Error(errTxt));
        if(rows.length==0)
          return callback(new Error("NOT_EXIST"));
      });
    }catch(err){
      return callback(new Error(errTxt));
    }
  }
  function addBook(bookInfo,callback){
    if(!isValidNumInput(bookInfo.publishedYear))
      return callback(new Error("WRONG_INT"));

    db.run(cmd("addBook.sql"),[
      bookInfo.bookName,
      bookInfo.bookSubname,
      bookInfo.author,
      bookInfo.subAuthor,
      bookInfo.translator,
      bookInfo.edition,
      bookInfo.publisher,
      bookInfo.publishedYear,
      bookInfo.ISBN,
      bookInfo.category
    ]);
  }
  function increaseMaximumBook(id,amount,callback){
    db.run(cmd("increaseMaximumBook.sql"),[id,amount],function(err){
      if(err)return callback(new Error(errTxt));
      callback();
    });
  }
  function listBook(callback){
    db.all("SELECT * FROM books;",function(err,rows){
      if(err)return callback(new Error(errTxt));
      callback(null,rows);
    });
  }
  function isBorrowing(id,borrower,callback){

  }
  this.borrow = function(id,borrower,callback){
    isBookAvailable(id,function(err){
      if(err)return callback(err);
      db.run(cmd("borrow.sql"),[id,borrower],function(err){

      });
    });
  }
  this.isBookAvailable = isBookAvailable;

  checkLibrary(function(){
    increaseMaximumBook(1,3,function(err){
      listBook(function(err,dat){
        console.log(dat);
      });
    });
  });

}


function cmd(sqlFileName){
  return fs.readFileSync("./sql/" + sqlFileName).toString();
}
exports.Library = function(fileName){
  return new Library(new sqlite3.Database(fileName))
}
