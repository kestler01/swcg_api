const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
	host: {},
	players: [],
	empire: {},
	rebels: {},
	isStarted: { 
        type: Boolean, 
        default: false 
    },
	isCompleted: { 
        type: Boolean, 
        default: false 
    },
	data: {}, // type mixed. represented by empty object will hold game data after game start and be removed at end of game (also to be stored in remote temporary storage?)
})

module.exports = mongoose.model('Game', gameSchema)
