var express = require('express');
var router = express.Router();

/* GET a list of events that the specified user is attending*/
router.get('/user/:id', function(req, res, next) {
    res.send('respond with a resource');
});

/* GET a list of users that are attending the specified event */
router.get('/event/:id', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/', function(req, res, next){

});

module.exports = router;
