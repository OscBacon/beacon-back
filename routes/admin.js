const express = require('express');
const router = express.Router();

const { Event } = require('../models/event');
const { User } = require('../models/user');
const { Comment } = require('../models/comment');
const { Attending } = require('../models/attending');
const { ObjectID } = require('mongodb');

/// a GET route to search for either a user or an event
router.get('/search/:type/:query', (req, res) => {
    const type = req.params.type;
    const query = req.params.query;
    let regexp = new RegExp("^"+ query);

    if(type === "user"){
        // Otherwise, findById
        User.find({ user_name: regexp }).then((users) => {
            /// sometimes we wrap returned object in another object:
            const result = users ? users : [];
            res.send(result);
        }).catch((error) => {
            res.status(500).send({error: error.message})  // server error
        })
    }
    else if(type === "event"){
        Event.find({ title: regexp }).populate("created_by").then((events) => {
            /// sometimes we wrap returned object in another object:
            console.log("yee")
            const result = events ? events : [];
            res.send(result);
        }).catch((error) => {
            console.log("haw", error.message);
            res.status(500).send({error: error.message})  // server error
        })
    }
    else{
        res.status(400).send({error: "invalid search type"})
    }
})


router.get('/analytics', async (req, res) => {
    try{
        const users = await User.countDocuments();
        const events = await Event.countDocuments();
        const attendings = await Attending.countDocuments();
        const comments = await Comment.countDocuments();

        res.send(
        {
            data : [
                {name: "users", value: users},
                {name: "events", value: events},
                {name: "attendings", value: attendings},
                {name: "comments", value: comments},
            ]
        })

    }
    catch(error){
        res.status(500).send({error: error.message})
    }
});

module.exports = router;
