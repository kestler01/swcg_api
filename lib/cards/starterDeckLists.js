const rebelCards = require('./rebelCards.js') 
const empireCards = require('./empireCards.js') 
const neutralCards = require('./neutralCards.js') 

const { allianceShuttle, rebelTrooper, templeGuardian } = rebelCards
const { imperialShuttle, stormTrooper, inquisitor } = empireCards
const { outerRimPilot } = neutralCards

const rebel = [
	allianceShuttle,
	allianceShuttle,
	allianceShuttle,
	allianceShuttle,
	allianceShuttle,
	allianceShuttle,
	allianceShuttle,
	rebelTrooper,
	rebelTrooper,
	templeGuardian,
]
const empire = [
	imperialShuttle,
	imperialShuttle,
	imperialShuttle,
	imperialShuttle,
	imperialShuttle,
	imperialShuttle,
	imperialShuttle,
	stormTrooper,
	stormTrooper,
	inquisitor,
]

const outerRimPilots = [
	outerRimPilot,
	outerRimPilot,
	outerRimPilot,
	outerRimPilot,
	outerRimPilot,
	outerRimPilot,
	outerRimPilot,
	outerRimPilot,
	outerRimPilot,
	outerRimPilot,
]
const starterDeckLists = {
	rebel,
	empire,
	outerRimPilots,
}

module.exports = starterDeckLists