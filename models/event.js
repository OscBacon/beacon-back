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
	date: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	comments: [ {
        user_name: String,
        comment: String,
        timeStamp: Number
	}],
	image: {
		data: Buffer,
		contentType: String
	}
});

module.exports = { Event }
