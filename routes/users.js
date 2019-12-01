const express = require('express');
const router = express.Router();

const { User } = require('../models/user')
const { ObjectID } = require('mongodb')

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

router.post('/', function (req, res) {
    console.log(req.body)

    // Create a new user using the Student mongoose model
    const user = new User({
      user_name: req.body.user_name,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password
    })

    // Save user to the database
    user.save().then((result) => {
        res.send(result)
    }, (error) => {
        res.status(400).send(error) // 400 for bad request
    })
})

// a GET route to get all event
router.get('/', function (req, res) {
    User.find().then((user) => {
        res.send({ user }) // can wrap in object if want to add more properties
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
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()  // could not find this student
		} else {
			/// sometimes we wrap returned object in another object:
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send()  // server error
	})

})

/// a DELETE route to remove a user by their id.
router.delete('/:id', (req, res) => {
	const id = req.params.id

	// Validate id
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	// Delete a student by their id
	User.findByIdAndRemove(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send() // server error, could not delete.
	})
})

// a PATCH route for changing properties of a resource.
router.patch('/:id', (req, res) => {
	const id = req.params.id

	// get the updated name and year only from the request body.
	const { user_name, first_name, last_name, email, password, avatar } = req.body
	const body = { user_name, first_name, last_name, email, password, avatar }
	

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	// Update the student by their id.
	User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {   
			res.send(user)
		}
	}).catch((error) => {
		res.status(400).send() // bad request for changing the student.
	})
})

module.exports = router;
