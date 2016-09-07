var express = require('express');
var router = express.Router();
var fs = require('fs');
var todoPath = './app/todo.json'

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
  // do validation on name here
  console.log('doing id validations on ' + id);
  // once validation is done save the new item in the req
  req.param.id = id;
  // go to the next thing
  next();
});

// route middleware to validate :id
router.param('newPosition', function(req, res, next, newPosition) {
  // do validation on name here
  console.log('doing newPosition validations on ' + newPosition);
  // once validation is done save the new item in the req
  req.param.newPosition = newPosition;
  // go to the next thing
  next();
});

// more routes for our API will happen here
router.route('/')
  .get(function(req, res){
    fs.readFile(todoPath, 'utf8', function (err, data) {
      if (err) { throw err; }
      res.set({"Access-Control-Allow-Origin": "*"});
      res.setHeader('Content-Type', 'application/json');
      res.end(data);
    });
  })
   //create a todo item
  .post(function(req, res){
    var listConstructor ={
      "todoList": []
    };

    var reqTodo ={
      stat : req.body.stat,
      text : req.body.text
    };
    fs.readFile(todoPath, function (err, data) {
      if (err) throw err;
      var i;
      var todoHistory = JSON.parse(data);
      listConstructor.todoList.push(reqTodo);
      for(i=0; i<todoHistory.todoList.length; i+=1)
        listConstructor.todoList.push(todoHistory.todoList[i]);
      var updatedTodo = JSON.stringify(listConstructor);

      fs.writeFile(todoPath,  updatedTodo, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
        res.set({"Access-Control-Allow-Origin": "*"});
        res.end();
      });
    });
  });

router.route('/:id')
  .put(function(req, res) {
    var listConstructor ={
      "todoList": []
    }
    var done ={
      stat : 'is-done',
      text : req.param.id
    }
    fs.readFile(todoPath, function (err, data) {
      if (err) throw err;
      var i;
      var todoHistory = JSON.parse(data);
      for(i=0; i<todoHistory.todoList.length; i+=1){
        if(todoHistory.todoList[i].text !== req.param.id)
          listConstructor.todoList.push(todoHistory.todoList[i]);
      };
      listConstructor.todoList.push(done);

      var updatedTodo = JSON.stringify(listConstructor);
      fs.writeFile(todoPath,  updatedTodo, function (err) {
        if (err) throw err;
        console.log('It\'s deleted!');
        res.set({"Access-Control-Allow-Origin": "*"});
        res.end();
      });
    });
  })
  .delete(function(req, res) {
    var listConstructor ={
      "todoList": []
    };
    fs.readFile(todoPath, function (err, data) {
      if (err) throw err;
      var i;
      var todoHistory = JSON.parse(data);
      for(i=0; i<todoHistory.todoList.length; i+=1){
        if(todoHistory.todoList[i].text !== req.param.id)
          listConstructor.todoList.push(todoHistory.todoList[i]);
      };
      var updatedTodo = JSON.stringify(listConstructor);

      fs.writeFile(todoPath,  updatedTodo, function (err) {
        if (err) throw err;
        console.log('It\'s deleted!');
        res.set({"Access-Control-Allow-Origin": "*"});
        res.end();
      });
    });
  });
  

router.route('/:id/reposition/:newPosition')
  .put(function(req, res) {
    var tmpStat;
    var listPosit
    var posit =  parseInt(req.param.newPosition);
    var listConstructor ={
      "todoList": []
    };

    var reposit = {
      stat : 'is-todo',
      text : req.param.id
   };

    fs.readFile(todoPath, function (err, data) {
      if (err) throw err;
      var i;
      var todoHistory = JSON.parse(data);
      for(i=0, listPosit=0; i < todoHistory.todoList.length ||  listPosit < todoHistory.todoList.length ; i+=1){

        if(listPosit===posit){
          listConstructor.todoList.push(reposit);
          listPosit+=1;
        }
        if( i < todoHistory.todoList.length && todoHistory.todoList[i].text !== req.param.id){
          listConstructor.todoList.push(todoHistory.todoList[i]);
          listPosit+=1;
        }
        if( i < todoHistory.todoList.length && todoHistory.todoList[i].text === req.param.id)
          tmpStat = todoHistory.todoList[i].stat;
      }
      listConstructor.todoList[posit].stat = tmpStat;
      var updatedTodo = JSON.stringify(listConstructor);

      fs.writeFile(todoPath,  updatedTodo, function (err) {
        if (err) throw err;
        console.log('It\'s reposition!');
        res.set({"Access-Control-Allow-Origin": "*"});
        res.end();
      });
    });
  });


module.exports = router;

