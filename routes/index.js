var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/locked', function(req, res, next) {
  res.render('locked', { title: 'Express' });
});

router.get('/vault', function(req, res, next) {
  res.render('vault', { title: 'Express' });
});

router.get('/swap', function(req, res, next) {
  res.render('swap', { title: 'Express' });
});


module.exports = router;
