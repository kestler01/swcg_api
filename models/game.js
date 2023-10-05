const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	host: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	players: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	empire: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	rebels: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	isStarted: {
		type: Boolean,
		default: false,
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
	data: {}, // type mixed. represented by empty object will hold game data after game start and be removed at end of game (also to be moved/stored in remote temporary storage?)
	
},{
	timestamps: true,
})

module.exports = mongoose.model('Game', gameSchema)
