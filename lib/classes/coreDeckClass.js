// basic deck class to be extended for the other various decks in the game ( 3 decks, 2 player decks and 1 galaxy deck )

const CoreDeck = class Deck {
	constructor(initialArray) {
		this.cards=initialArray
	}
	//Fisher–Yates unbiased shuffle 
	shuffle = function () {
		const deckCards = this.cards
		let currentIndex = deckCards.length
		let	randomIndex

		// While there remain elements to shuffle.
		while (currentIndex != 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex--

			// And swap it with the current element.
			[deckCards[currentIndex], deckCards[randomIndex]] = [
				deckCards[randomIndex],
				deckCards[currentIndex],
			]
		}
		return this.cards = deckCards
	}
	draw = function () { // myDeck.draw() return the 'top' card
		return this.cards.pop()
	}
	addTop = function (card) { // takes in new card to add to top of deck
		return this.cards.push(card) // will return length on cards array in deck after adding the new card
	}
	revealTopN = function (n) {// where n is the number of cards to reveal 
		return this.cards.slice(this.cards.length - n, this.cards.length) // return new array of n cards from top of the deck without mutating the original deck. From here other functions such as draw or remove can be called based on user feedback 
	}
	// remove 1 card from the deck
	remove = function (n) { // where n is the number of cards from the top to the target cards ( expected 0 or 1 input for Coruscant, any n < this.cards.length for discard retrieval etc exile  )
		const targetCard = this.cards[this.cards.length - (n - 1)] // cache target target card ( should i Memoize the 'tail' / top card of the deck for this ?)
		// remove the target card by mutating the array in place
		this.cards.splice(this.cards.length - (n - 1), 1) // the start index will be the length -1 or the length -2, removing 1 card.
		return targetCard// return the target card after it has been removed from the deck so it can be place elsewhere in game 
	}
}
module.exports = CoreDeck