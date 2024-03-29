/* Student mongoose model */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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
		minlength: 4,
		required: true
	},
	avatar: {
		data: Buffer,
		contentType: String
	}
});

// An example of Mongoose middleware.
// This function will run immediately prior to saving the document
// in the database.
UserSchema.pre('save', function(next) {
	const user = this; // binds this to User document instance

	// checks to ensure we don't hash password more than once
	if (user.isModified('password')) {
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next()
			})
		})
	} else {
		next()
	}
});

// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this; // binds this to the User model
	console.log("finding if user exists");

	// First find the user by their username
	return User.findOne({ user_name: username }).then((user) => {
		if (!user) {
			console.log("username not found");
			return Promise.reject(new Error("username not found"))  // a rejected promise
		}
		// if the user exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					console.log("incorrect password");
					reject(new Error("incorrect password"))
				}
			})
		})
	})
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
