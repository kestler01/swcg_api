const CoreDeck = require('./coreDeckClass.js')
const starterDeckLists = require('../cards/starterDeckLists.js')


const PlayerDeckClass = class PlayerDeckClass extends CoreDeck {
	constructor(faction) { // expects 'rebel' or 'empire'
		super(starterDeckLists[faction])
		this.discard = []
	}

	shuffleInDiscard = function () {
		this.cards= this.cards.concat(this.discard) // combine both piles ( this.cards should be empty but this function is agnostic to edge cases with existing cards in the deck )
		return this.shuffle()
	}

    playerDraw = function() { // convenience method for auto triggering shuffles if no card in the deck when you go to draw
        if( this.cards.length <= 0){ // if no cards left in the player deck
            this.shuffleInDiscard() // rules say we shuffle the discarded cards back in to refresh the deck and draw 
        }
        return this.cards.pop()
    }

    drawFive = function () { // convenience method for drawing a hand - which should be 5 cards to start. 
        const tempCards = []
        for(let i=0; i<5; i++){ // do it 5 times
            tempCards.push(this.playerDraw()) // push the popped card from the playerDraw to the tempCards array
        }
        return tempCards
        
    }

}

module.exports = PlayerDeckClass