/* Student mongoose model */
const mongoose = require('mongoose')

const Attending = mongoose.model('Attending', {
	user_id: {
		type: Number,
		required: true
	},
	event_id: {
		type: Number,
		require: true
	}
})

module.exports = { Attending }