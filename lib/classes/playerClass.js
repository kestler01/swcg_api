const PlayerDeck = require('./playerDeckClass.js')

const starterBase = {
	empire : {
		name: 'Lothal',
		maxHealth:10,
		text:'this is your starting base'
	},
	rebel : {
		name: 'Dantooine',
		maxHealth: 10,
		text:'this is your staring base'
	}
}

const Player = class Player {
	constructor(faction) { // 'rebel' or 'empire' 
        this.faction = faction
		this.deck = new PlayerDeck(faction)
		this.hand = []
		this.inPlay = []
		this.capitalShipsInPlay = []
		this.base = starterBase[faction]
		this.resources = 0
	}
}

module.exports = Player
