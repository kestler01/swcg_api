const CoreDeck =require("../classes/coreDeckClass") 
const Player =require("../classes/playerClass") 
const galaxyDeckList =require("../cards/galaxyDeckList") 
const starterDeckLists = require('../cards/starterDeckLists') 

const initializeDefaultGame = function () {
    
    console.log( 'running initializeGame function')

    const data = {
        empire:new Player('empire'),
        rebels:new Player('rebel'),
        theForce:6,
        galaxyDeck:new CoreDeck(galaxyDeckList),
        pilotsDeck: starterDeckLists.outerRimPilots,
        galaxyRow:[],
        isEmpireTurn:null,
        abilityTriggers:[],
    }

    data.empire.deck.shuffle()
    data.rebels.deck.shuffle()
    data.empire.hand = data.empire.deck.drawFive()
    data.rebels.hand = data.rebels.deck.drawFive()
    data.isEmpireTurn = true
    while (data.galaxyRow.length < 6) {
        // galaxy row starts with and should have 6 cards
        data.galaxyRow.push(data.galaxyDeck.draw()) // draw those cards form the galaxy deck.
    }
    // console.log('initialization complete',data)
    return data
}

module.exports = initializeDefaultGame