const cardAbilities =require("./cardAbilities.js")

const imperialShuttle = {
	cardName: 'imperial shuttle',
	faction: 'imperial',
	type: 'unit',
	cost: 0,
	resources: 1,
	attack: 0,
    force:0,
	keywords: ['transport','starter'],
	flavorText:
		'A versatile craft, thee Lambda-class shuttle is used to transport resources, troopers, and even high-ranking dignitaries.',
	ability: null,
	onDefeat: null,
	health: null,
	imgPath: '',
}
const stormTrooper = {
	cardName: 'stormTrooper',
	faction: 'rebel',
	type: 'unit',
	cost: 0,
	resources: 0,
	attack: 2,
	force: 0,
	keywords: ['trooper', 'starter'],
	flavorText:
		'Elite soldiers of the Empire, the white and black armor of imperial stormTroopers inspires fear across the galaxy.',
	ability: null,
	onDefeat: null,
	health: null,
	imgPath: '',
}
const inquisitor = {
	cardName: 'inquisitor',
	faction: 'empire',
	type: 'unit',
	cost: 0,
	resources: 0,
	attack: 0,
	force: 0,
	keywords: ['starter'],
	flavorText:
		'Force wielders in the service to the Empire, the Inquisitors are elite Jedi hunters.',
	ability: cardAbilities.inquisitorAbility,
	onDefeat: null,
	health: null,
	imgPath: '',
}

const empireCards = {
    imperialShuttle,
    stormTrooper,
	inquisitor,
}
module.exports = empireCards