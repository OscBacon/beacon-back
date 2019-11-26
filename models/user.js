/* Student mongoose model */
const mongoose = require('mongoose')

const User = mongoose.model('User', {
	user_name: {
		type: String,
		unique: true,
		required: true,
		minlength: 4,
		trim: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		minlength: 8,
		required: true
	},
	avatar: {
		data: Buffer,
		contentType: String
	}
})

module.exports = { User }
