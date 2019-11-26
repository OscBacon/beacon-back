let express = require('express');
let router = express.Router();

/* GET  a particular user's data */
router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
