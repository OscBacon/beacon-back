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
	comments: [ {
        user_id: mongoose.Schema.Types.ObjectId,
        comment: String,
        timeStamp: Number
	}],
	created_by: {
		type: mongoose.Schema.Types.ObjectId
	},
	image: {
		data: Buffer,
		contentType: String
	}
});

module.exports = { Event }
