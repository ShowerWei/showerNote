var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'showerNote' });
});

// more routes for our API will happen here
router.route('/items')
  .get(function(req, res){
    fs.readFile('./todo.json', 'utf8', function (err, data) {
      if (err) { throw err; }
      res.set({"Access-Control-Allow-Origin": "*"});
      res.setHeader('Content-Type', 'application/json');
      res.end(data);
    });
  })
   //create a todo item
  .post(function(req, res){
    var parseTodo;
    var todo ={
      stat : req.body.stat,
      text : req.body.text
    };

    fs.readFile('./todo.json', function (err, data) {
      if (err) throw err;
      parseTodo = JSON.parse(data);
      parseTodo.todoList.push(todo);
      console.log(parseTodo);
    });     

    var json = JSON.stringify(parseTodo);
    fs.writeFile('./todo.json',  json, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
//todo.save(function(err){
    //  if(err)
    //    res.send(err);
    res.json({"message": "todo created"});
    //});
  });



module.exports = router;
