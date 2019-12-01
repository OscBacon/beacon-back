/* Student mongoose model */
const mongoose = require('mongoose')

const Attending = mongoose.model('Attending', {
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true
	}
})

module.exports = { Attending }
