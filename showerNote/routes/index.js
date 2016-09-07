var express = require('express');
var router = express.Router();
var passport = require('passport');
var redis = require('redis');

var router = express.Router();

/* redis */
var host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.01';
var port = process.env.REDIS_PORT_6379_TCP_PORT || 6379;
var client = redis.createClient(port, host);


/* GET home page. */
router.get('/', function(req, res) {
  client.incr('counter', function(err, result) {
    if (err) {
      return next(err);
    }  

    res.render('index', { title: 'Welcome to showerNote', counter: result });
  });
});

router.get('/note', isLoggedIn, function(req, res) {
  res.render('layout', { title: 'showerNote' });
});


router.route('/login')
  .get(function(req, res) {
    res.render('login', { title: 'login to showerNote', message: req.flash('loginMessage') });
  })

  .post(passport.authenticate('local-login', { 
    successRedirect: '/note',
    failureRedirect: '/login',
    failureFlash : true  }),
    function(req, res) {
      res.redirect('/login');
  });

// LOGOUT ==============================
router.route('/logout')
  .get(function(req, res) {
    req.logout();
    res.redirect('/');
  });

// SIGNUP =================================
// show the signup form

router.route('/signup')
  .get(function(req, res) {
    res.render('signup', {  title: 'sighup for showerNote', message: req.flash('signupMessage') });
  })

// process the signup form
  .post(passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

// facebook -------------------------------
// send to facebook to do the authentication
router.route('/auth/facebook')
  .get(passport.authenticate('facebook', { scope : 'email' }));
// handle the callback after facebook has authenticated the user
router.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
    successRedirect : '/note',
    failureRedirect : '/'
  }));

// twitter --------------------------------
// send to twitter to do the authentication
router.route('/auth/twitter')
  .get(passport.authenticate('twitter', { scope : 'email' }));
// handle the callback after twitter has authenticated the user
router.route('/auth/twitter/callback')
  .get(passport.authenticate('twitter', {
    successRedirect : '/note',
    failureRedirect : '/'
}));

// google ---------------------------------
// send to google to do the authentication
router.route('/auth/google')
  .get(passport.authenticate('google', { scope : ['profile', 'email'] }));
// the callback after google has authenticated the user
router.route('/auth/google/callback')
  .get(passport.authenticate('google', {
    successRedirect : '/note',
    failureRedirect : '/'
}));


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();

  res.redirect('/');
}

module.exports = router;
