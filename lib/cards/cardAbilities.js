// const {
// 	player1,
// 	player2,
// 	theForce,
// 	galaxyDeck,
// 	pilotsDeck,
// 	galaxyRow,
// 	isPlayer1Turn,
// } = gameGlobals

const inquisitorAbility = {
	text: 'When you play Inquisitor, choose: They gain 1 "attack", 1 "resources", or 1 "force"',
	keywords: ['trigger', 'choose'], // choose, triggered, passive, activated
	when: 'on-play',
	theDo: async (card, gameGlobals) => { // choose functions must be async to wait for player input 
		console.log("i'm in the theDo")
		const {// destructure out necessary globals 
			player1, //empire player
			theForce,
		} = gameGlobals
		// let choice = await playerChoose(player1, card, ["1 attack", "1 resources", "1 force"] ) // future promising player choose function will take in player to prompt, the card generating the effect, and the choices as an array
		let choice = "1 force" // temp default till playerChoose function implemented 
		choice = choice.split(' ')
		const chosenAttribute = choice[1]
		const chosenValue = parseInt(choice[0])
		card[chosenAttribute] += chosenValue
	},
}// theDo falls off

const cardAbilities = {
	inquisitorAbility,
}

module.exports = cardAbilities
