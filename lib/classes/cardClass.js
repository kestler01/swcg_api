const CardAbility = require('./cardAbilityClass.js') 
const cardAbilities =require("../cards/cardAbilities.js") 

// there are 3 kinds of cards in the game 'unit's, 'capital ship's, and 'base's ... do they need to have there own classes ?

// while bases are literally cards, they don't have to be of class card in this code implementation. Much more overlap with units and capital ships 

const Card = class Card {
	constructor({
		cardName = '',
		faction = 'neutral',
		type = '',
		cost = 0,
		resources = 0,
		attack = 0,
		force = 0,
		keyword = null,
		flavorText = '',
		ability = null,
        onDefeat = null,
        health = null
	} = {}) { // take in an anonymous object with the above keys to bypass the lack of native named parameters. Values assigned above are defaults
		this.name = cardName
		this.faction = faction
		this.type = type
		this.cost = cost
		this.resources = resources
		this.attack = attack
		this.force = force
		this.keyword = keyword
		this.flavorText = flavorText
		if(ability){
			this.ability = new CardAbility(cardAbilities[`${cardName}Ability`], this)
		}
		this.ability = ability
		this.onDefeat = onDefeat
		this.health = health	
	}
}

module.exports = Card