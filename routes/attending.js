const express = require('express');
const router = express.Router();

const { Attending } = require('../models/attending')
const { ObjectID } = require('mongodb')

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

router.post('/', function (req, res) {
    console.log(req.body)

    // Create a new user using the Student mongoose model
    const attending = new Attending({
      user: req.body.user,
      event: req.body.event
    })

    // Save user to the database
    attending.save().then((result) => {
        res.send(result)
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })
})

// a GET route to get all attendings
router.get('/', function (req, res) {
    Attending.find().then((user) => {
        res.send({ user }) // can wrap in object if want to add more properties
    }, (error) => {
        res.status(500).send(error) // server error
    })
})

/// a GET route to get all attending for a user.
router.get('/users/:id', (req, res) => {
	const id = req.params.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
	}

	// Otherwise, findById
	Attending.find({ user: id }).populate("event").then((attending) => {
		const events = attending ? attending : [];
		res.send(events);
	}).catch((error) => {
		res.status(500).send(error.message)  // server error
	})
})

/// a GET route to get all attending for an event.
router.get('/events/:id', (req, res) => {
	const id = req.params.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send({error: "cannot find specified id"})  // if invalid id, definitely can't find resource, 404.
	}

	// Otherwise, findById
	Attending.find({ event: id }).populate("user").then((attending) => {
		/// sometimes we wrap returned object in another object:
		const attendees = attending ? attending : [];
		res.send(attendees);
	}).catch((error) => {
		res.status(500).send(error.message)  // server error
	})
})

/// a DELETE route to remove a user by their id.
router.delete('/', (req, res) => {
	const user = req.body.user;
	const event = req.body.event;

	console.log(typeof(user), user);
	console.log(typeof(event), event);
	console.log(req.body);

	// Delete an attending by their id
	Attending.findOneAndRemove({user, event}).then((attending) => {
		if (!attending) {
			res.status(404).send()
		} else {
			res.send(attending)
		}
	}).catch((error) => {
		res.status(500).send() // server error, could not delete.
	})
})

// a PATCH route for changing properties of a resource.
router.patch('/:id', (req, res) => {
	const id = req.params.id

	// get the updated name and year only from the request body.
	const { user, event } = req.body
	const body = { user, event }

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	// Update the student by their id.
	User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((attending) => {
		if (!attending) {
			res.status(404).send()
		} else {   
			res.send(attending)
		}
	}).catch((error) => {
		res.status(400).send() // bad request for changing the student.
	})
})

module.exports = router;
