var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'showerNote' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
  // do validation on name here
  // blah blah validation
  // log something so we know its working
  console.log('doing id validations on ' + id);
  
  // once validation is done save the new item in the req
  req.param.id = id;
  // go to the next thing
  next();	
});

// route middleware to validate :id
router.param('newPosition', function(req, res, next, newPosition) {
  // do validation on name here
  // blah blah validation
  // log something so we know its working
  console.log('doing newPosition validations on ' + newPosition);

  // once validation is done save the new item in the req
  req.param.newPosition = newPosition;
  // go to the next thing
  next();
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
    var todo ={
      stat : req.body.stat,
      text : req.body.text
    };

    fs.readFile('./todo.json', function (err, data) {
      if (err) throw err;
      var parseTodo = JSON.parse(data);
      parseTodo.todoList.push(todo);
      console.log(parseTodo);
      parseTodo = JSON.stringify(parseTodo);
      fs.writeFile('./todo.json',  parseTodo, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    });     
  });

router.route('/items/:id')
  .put(function(req, res) {
    res.send('put id:' + req.param.id + '!');
  })
  .delete(function(req, res) {
    res.send('delete id:' + req.param.id + '!');
  });

router.route('/items/:id/reposition/:newPosition')
  .put(function(req, res) {
    res.send('put id :' + req.param.id +". into: " + req.param.newPosition);
  });


module.exports = router;
