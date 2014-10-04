var express = require('express');
var router = express.Router();

/* GET ho.e page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'showerNote' });
});

module.exports = router;
