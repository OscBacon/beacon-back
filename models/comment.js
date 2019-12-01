const mongoose = require('mongoose');

const Comment = mongoose.model('Comment', {
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},
	author: { 
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	text: {
		type: String,
		required: true,
		minlength: 1,
	},
	timestamp: {
		type: Number,
		required: true
	},
});

module.exports = { Comment }
