const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		profileName: {
			type: String,
			required: true,
			unique: true,
		},
		hashPassword: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			default: null,
		},
		socketId: {
			type: String,
			default: null,
		}, // do not use SocketId for strict auth -> can be lost and over-ridden with intermittent disconnection / re-connections as per socket.io docs
	},
	{
		timestamps: true,
		toObject: {
			virtuals: true,
			transform: (_doc, user) => {
				delete user.hashPassword
				delete user.email
				return user
			},
		},
		toJson: {
			virtuals: true,
			transform: (_doc, user) => {
				delete user.hashPassword
				delete user.email
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)