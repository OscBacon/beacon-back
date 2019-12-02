const mongoose = require('mongoose');

const Event = mongoose.model('Event', {
	title: {
		type: String,
		required: true,
		minlength: 4,
	},
	location: {
		type: String,
		required: true
	},
	coordinates: {
		type: [Number]
	},
	date: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	created_by: {
		type: mongoose.Schema.Types.ObjectId
	},
	image: {
		type: String,
	}
});

module.exports = { Event }
