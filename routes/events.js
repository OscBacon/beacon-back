let express = require('express');
let router = express.Router();

/* GET  a particular user's data */
router.get('/:id', function(req, res, next) {
    res.send('event data');
});

/* POST a new event */
router.post('/', function(req, res, next) {
    res.send('posted data');
});

module.exports = router;
