const cardAbilities = require('./cardAbilities.js')

const allianceShuttle = {
	cardName: 'alliance shuttle',
	faction: 'rebel',
	type: 'unit',
	cost: 0,
	resources: 1,
	attack: 0,
	force: 0,
	keywords: ['transport', 'starter'],
	flavorText:
		'Lightly armored and unarmed, Rebel ships typically require a fighter escort to traverse contested space',
	ability: null,
	onDefeat: null,
	health: null,
	imgPath: '',
}
const rebelTrooper = {
	cardName: 'rebel trooper',
	faction: 'rebel',
	type: 'unit',
	cost: 0,
	resources: 0,
	attack: 2,
	force: 0,
	keywords: ['trooper', 'starter'],
	flavorText:
		'Drawn from various resistance cells, Rebel infantry are well-trained and highly motivated',
	ability: null,
	onDefeat: null,
	health: null,
	imgPath: '',
}
const templeGuardian = {
	cardName: 'temple guardian',
	faction: 'rebel',
	type: 'unit',
	cost: 0,
	resources: 0,
	attack: 0,
	force: 0,
	keywords: ['starter'],
	flavorText:
		"The temple guardian's mask and robes symbolize their devotion to preserving the Jedi's legacy ",
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null,
	health: null,
	imgPath: '',
}
const ywing = {
	cardName: 'y-wing',
	faction: 'rebel',
	type: 'unit',
	cost: 1,
	resources: 0,
	attack: 2,
	force: 0,
	keywords: ['fighter'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const snowspeeder = {
	cardName: 'snowspeeder',
	faction: 'rebel',
	type: 'unit',
	cost: 2,
	resources: 0,
	attack: 2,
	force: 0,
	keywords: ['vehicle'],
	flavorText: '"Watch that crossfire, boys!" - Luke Skywalker',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const durosSpy = {
	cardName: 'duros spy',
	faction: 'rebel',
	type: 'unit',
	cost: 2,
	resources: 2,
	attack: 0,
	force: 0,
	keywords: ['trooper'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const bazeMalbus = {
	cardName: 'baze malbus',
	faction: 'rebel',
	type: 'unit',
	cost: 2,
	resources: 0,
	attack: 2,
	force: 0,
	keywords: ['trooper', 'unique'],
	flavorText: "You don't look happy.",
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const rebelTransport = {
	cardName: 'rebel transport',
	faction: 'rebel',
	type: 'capitalShip',
	cost: 2,
	resources: 0,
	attack: 0,
	force: 0,
	keywords: ['capitalShip'],
	flavorText: 'The first transport is away!',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: 2,
	imgPath: '',
}
const rebelCommando = {
	cardName: 'rebel commando',
	faction: 'rebel',
	type: 'unit',
	cost: 3,
	resources: 0,
	attack: 3,
	force: 0,
	keywords: ['trooper'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const xwing = {
	cardName: 'x-wing',
	faction: 'rebel',
	type: 'unit',
	cost: 3,
	resources: 0,
	attack: 3,
	force: 0,
	keywords: ['fighter'],
	flavorText: '"Lock S-foils in attack position." - Red Leader',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const chirrutImwe = {
	cardName: 'chirrut imwe',
	faction: 'rebel',
	type: 'unit',
	cost: 3,
	resources: 0,
	attack: 3,
	force: 2,
	keywords: ['trooper', 'unique'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const uwing = {
	cardName: 'u-wing',
	faction: 'rebel',
	type: 'unit',
	cost: 4,
	resources: 3,
	attack: 0,
	force: 0,
	keywords: ['transport'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const hammerheadCorvette = {
	cardName: 'hammerhead corvette',
	faction: 'rebel',
	type: 'capitalShip',
	cost: 4,
	resources: 2,
	attack: 0,
	force: 0,
	keywords: ['capitalShip'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: 4,
	imgPath: '',
}
const chewbacca = {
	cardName: 'chewbacca',
	faction: 'rebel',
	type: 'unit',
	cost: 4,
	resources: 0,
	attack: 5,
	force: 0,
	keywords: ['scoundrel'],
	flavorText: 'Rwaarrr!',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const jynErso = {
	cardName: 'jyn erso',
	faction: 'rebel',
	type: 'unit',
	cost: 4,
	resources: 0,
	attack: 4,
	force: 0,
	keywords: ['scoundrel'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const bwing = {
	cardName: 'b-wing',
	faction: 'rebel',
	type: 'unit',
	cost: 5,
	resources: 0,
	attack: 5,
	force: 0,
	keywords: ['fighter'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const hanSolo = {
	cardName: 'han solo',
	faction: 'rebel',
	type: 'unit',
	cost: 5,
	resources: 2,
	attack: 3,
	force: 0,
	keywords: ['scoundrel', 'unique'],
	flavorText: 'You know, sometimes I amaze even myself.',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const cassianAndor = {
	cardName: 'cassian andor',
	faction: 'rebel',
	type: 'unit',
	cost: 5,
	resources: 0,
	attack: 5,
	force: 0,
	keywords: ['trooper', 'unique'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const princessLeia = {
	cardName: 'princess leia',
	faction: 'rebel',
	type: 'unit',
	cost: 6,
	resources: 2,
	attack: 2,
	force: 2,
	keywords: ['officer', 'unique'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const monCalamariCruiser = {
	cardName: 'mon calamari cruiser',
	faction: 'rebel',
	type: 'capitalShip',
	cost: 6,
	resources: 0,
	attack: 3,
	force: 0,
	keywords: ['capitalShip'],
	flavorText:
		'The Mon Calamari cruiser packs an enormous punch and is capable of going head-to-head with an Imperial Star Destroyer',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: 6,
	imgPath: '',
}
const millenniumFalcon = {
	cardName: 'millennium falcon',
	faction: 'rebel',
	type: 'unit',
	cost: 7,
	resources: 2,
	attack: 5,
	force: 0,
	keywords: ['transport'],
	flavorText: '',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}
const lukeSkywalker = {
	cardName: 'luke skywalker',
	faction: 'rebel',
	type: 'unit',
	cost: 8,
	resources: 0,
	attack: 6,
	force: 2,
	keywords: ['jedi'],
	flavorText: 'I am a Jedi, like my father before me.',
	ability: null, // next step to implementation of game logic will be to meditate on how to implement abilities
	onDefeat: null, // see ability
	health: null,
	imgPath: '',
}

const rebelCards = {
	allianceShuttle,
	rebelTrooper,
	templeGuardian,
	ywing,
	snowspeeder,
	durosSpy,
	bazeMalbus,
	rebelTransport,
	rebelCommando,
	xwing,
	chirrutImwe,
	uwing,
	hammerheadCorvette,
	chewbacca,
	jynErso,
	bwing,
	hanSolo,
	cassianAndor,
	princessLeia,
	monCalamariCruiser,
	millenniumFalcon,
	lukeSkywalker,
}

module.exports = rebelCards
