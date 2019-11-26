/* Student mongoose model */
const mongoose = require('mongoose')

const Attending = mongoose.model('Attending', {
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	event_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
})

module.exports = { Attending }
