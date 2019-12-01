const express = require('express');
const router = express.Router();

const { Event } = require('../models/event')
const { ObjectID } = require('mongodb')

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

router.post('/', function (req, res) {
	console.log(req.body)

	const user_id  = req.session.user;
	
    const event = new Event({
        title: req.body.title,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
		coordinates: req.body.coordinates,
		created_by: req.session.user 
    })

    // Save Event to the database
    event.save().then((result) => {
        res.send(result)
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })
})

// a GET route to get all events
router.get('/', function (req, res) {
    Event.find().then((events) => {
        res.send({ events }) // can wrap in object if want to add more properties
    }, (error) => {
        res.status(500).send(error) // server error
    })
})

/// a GET route to get an event by their id.
router.get('/:id', (req, res) => {
	/// req.params has the wildcard parameters in the url, in this case, id.
	// log(req.params.id)
	const id = req.params.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
	}

	// Otherwise, findById
	Event.findById(id).then((event) => {
		if (!event) {
			res.status(404).send({error: "event not found"})  // could not find this student
		} else {
			/// sometimes we wrap returned object in another object:
			//res.send({student})   
			res.send(event)
		}
	}).catch((error) => {
		res.status(500).send()  // server error
	})

})

/// a DELETE route to remove an event by their id.
router.delete('/:id', (req, res) => {
	const id = req.params.id

	// Validate id
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	// Delete a student by their id
	Event.findByIdAndRemove(id).then((event) => {
		if (!event) {
			res.status(404).send({error: "event not found"})
		} else {
			res.send(event)
		}
	}).catch((error) => {
		res.status(500).send() // server error, could not delete.
	})
})

// a PATCH route for changing properties of a resource.
router.patch('/:id', (req, res) => {
	const id = req.params.id

	// get the updated name and year only from the request body.
	const { title, location, description, date, comments, coordinates } = req.body
	const body = { title, location, description, date, comments, coordinates }

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	// Update the student by their id.
	Event.findByIdAndUpdate(id, {$set: body}, {new: true}).then((event) => {
		if (!event) {
			res.status(404).send({error: "event not found"})
		} else {   
			res.send(event)
		}
	}).catch((error) => {
        console.log(error);
		res.status(400).send() // bad request for changing the student.
	})
})

module.exports = router;
