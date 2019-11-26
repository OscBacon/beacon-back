var express = require('express');
var router = express.Router();

/* GET  a particular user's data */
router.get('/:id', function(req, res, next) {
    res.send('event data');
});

/* POST a new event */
router.post('/', function(req, res, next) {
    res.send('posted data');
});

router.get('/', (req, res) => {
    res.send({events: [
    {
        title: "CSC309 Meeting", date: 1571503233, description: "We are going to meet today to work on our project", _id: 1000000, coordinates: [
            -79.39390182495117,
            43.66501558572499
        ]
    },
    {
        title: "Movie Night", date: 1571503233, description: "Joker watch party!", _id: 11,
        coordinates: [
            -79.39956665039062,
            43.66414633393803
        ]
    }
    ]});
})

module.exports = router;
