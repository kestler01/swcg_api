
// what my card abilities look like so far
// const inquisitorAbility = {
// 	text: 'When you play Inquisitor, choose: They gain 1 "attack", 1 "resources", or 1 "force"',
// 	keywords: ['trigger', 'choose'], // choose, triggered, passive, activated - could i dynamically create the do function from the keywords and other object values ?
// 	when: 'on-play',
// 	do: (choice) => {
// 		return { [choice]: 1 } // yikes
// 	},
// }
//maybe make a map for the types of action functions im going to need
// choose -> prompt target player, wait for a response, then perform the associated chosen action.

// trigger -> something else happens that caused me to happen, should check when

// passive ->

const CardAbility = class CardAbility {
	constructor({ text, keywords, when, theDo } = {}, card) {
		// destructuring out the kvps instead of relying on positional parameters
		this.text = text,
        this.keywords = keywords // ['trigger', 'choose']  // choose, triggered, passive, activated
		this.when = when
		this.abilityFunc = theDo
		this.cardRef = card

	}
	// theDo = theDo//(cardRef) // do is a keyWord! 
}

module.exports = CardAbility
