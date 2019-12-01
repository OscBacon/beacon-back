const express = require('express');
const router = express.Router();

const { Comment } = require('../models/comment')
const { ObjectID } = require('mongodb')

/// a GET route to get all comments for an event.
router.get('/:id', (req, res) => {
	/// req.params has the wildcard parameters in the url, in this case, id.
	// log(req.params.id)
	const id = req.params.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
	}

	// Otherwise, findById
	Comment.find({event: id}).populate('author').then((comments) => {
		const result = comments ? comments : [];
		res.send(result);
	}).catch((error) => {
		res.status(500).send()  // server error
	})

})

router.post('/:id', (req, res) => {

	const user_id  = req.session.user;
	const id = req.params.id

    const comment = new Comment({
        event: id,
        author: user_id,
        text: req.body.text,
        timestamp: Date.now()
    })

    // Save Event to the database
    comment.save().then((result) => {
        res.send(result)
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })
});

module.exports = router;
