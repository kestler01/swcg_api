const Game = require('../models/game')
const User = require('../models/user')
const {
	BadParamsError,
	DocumentNotFoundError,
	BadCredentialsError,
} = require('../lib/errors/custom-errors')
const initializeDefaultGame = require('../lib/game/initialize-default-game')
const CardAbility = require('../lib/classes/cardAbilityClass')


const routerObj = {}

routerObj['createGame'] = async (data, io, socket, next) => {
	console.log('in createGame', data)
	try {
		const userId = data._id
		const user = await User.findById(userId)
		if (!user || !(user.token === data.token)) {
			throw new BadCredentialsError()
		}
		let gameData = {
			name: data.name,
			host: user._id,
			empire: user._id,
			players: [user._id],
		}
		let game = await Game.create(gameData)
		await game.populate('players')
		socket.join(game._id)
		io.to('gameHub').emit('gameListUpdate')
		io.to(socket.id).emit('createGameSuccess', game)
	} catch (err) {
		next(err, io, socket)
	}
}

routerObj['getGame'] = async (data, io, socket, next, ack) => {
	console.log('in get game', data)
	try {
		const userId = data.user._id
		const gameId = data.gameId
		const user = await User.findById(userId)
		if (!user || !(user.token === data.token)) {
			throw new BadCredentialsError()
		}
		const game = await Game.findById(gameId).populate('players')
		if (!game) {
			throw new DocumentNotFoundError()
		}
		ack({ status: 'ok', game: game })
	} catch (err) {
		next(err, io, socket)
	}
}

routerObj['getOpenGames'] = async (data, io, socket, next, ack) => {
	console.log('in get index of open games', data)
	try {
		const userId = data.user._id
		const user = await User.findById(userId)
		if (!user || !(user.token === data.user.token)) {
			throw new BadCredentialsError()
		}
		const games = await Game.find({ isStarted: false })
		ack({ status: 'ok', games: games })
	} catch (err) {
		next(err, io, socket)
	}
}

routerObj['joinGame'] = async (data, io, socket, next, ack) => {
	console.log('in join game', data)
	try {
		const userId = data.user._id
		const gameId = data.game._id
		const user = await User.findById(userId)
		if (!user || !(user.token === data.user.token)) {
			throw new BadCredentialsError()
		}
		const game = await Game.findById(gameId)
		if (!game) {
			throw new DocumentNotFoundError()
		}
		// is game full ?
		if (game.players.length >= 2 || game.isStarted) {
			ack({ status: 'full' })
			throw new BadCredentialsError()
		}
		if (!game.players.includes(user._id)) {
			game.players.push(user._id)
			await game.save()
		}
		await game.populate({ path: 'players' })

		// socket.to(socket.id).emit('joinGameSuccess', game)
		socket.join(game._id)
		socket.to(game._id).emit('gameDetailsUpdate', game)
		io.to('gameHub').emit('gameListUpdate')
		ack({ status: 'ok', message: 'joined game', game: game })
	} catch (err) {
		next(err, io, socket)
	}
}

routerObj['leaveGame'] = async (data, io, socket, next, ack) => {
	console.log('in leaveGame', data)
	try {
		const userId = data.user._id
		const gameId = data.game._id
		const user = await User.findById(userId)
		if (!user || !(user.token === data.user.token)) {
			throw new BadCredentialsError()
		}
		const game = await Game.findById(gameId)
		if (!game) {
			throw new DocumentNotFoundError()
		}
		// 2 possibilities when a player leaves : the host or the other player
        // we have an issue with a player leaving when a game starts because the trigger happens on unmount of the component. 
        console.log('leavingGame, new date is', new Date())
        const timeDiff = Date.now() - game.updatedAt.getTime()
        console.log('diff in times', Date.now()-game.updatedAt.getTime())
        if(timeDiff < 1000){ // less than 1 second difference
            console.log('too soon since update to leaveGame/deleteIt')
            ack({status:'busy'})
            return null
        }
        console.log('leaveGame', game)
		if (game.host.equals(user._id)) {
			// if the host is leaving
			if (game.players.length > 1) {
				// if there are more than one players
				game.host = game.players[1] // other player becomes the host
				game.players = game.players.slice(1) // remove the leaving player form the array and have it so the player array only contains the current host at index 0.
			} else {
				// else, delete the game
				return routerObj.deleteGame(data, io, socket, next, ack)
			}
		}
		game.players.splice(1, 1) // remove the other player from the array
		if (game.empire?.equals(user._id)) {
			// if it was the empire player, clear it
			game.empire = null
		}
		if (game.rebels?.equals(user._id)) {
			// if it was the rebels player, clear it
			game.rebels = null
		}
		await game.save()
		await game.populate('players')
		ack({ status: 'ok' })
		socket.leave(game.id)
		io.to(game._id).emit('gameDetailsUpdate', game)
		io.to('gameHub').emit('gameListUpdate')
	} catch (err) {
		next(err, io, socket)
	}
}

routerObj['deleteGame'] = async (data, io, socket, next, ack) => {
	console.log('in delete game', data)
	try {
		const userId = data.user._id
		const gameId = data.game._id
		const user = await User.findById(userId)
		if (!user || !(user.token === data.user.token)) {
			throw new BadCredentialsError()
		}
		const game = await Game.findById(gameId) //returns a query
		if (user._id.equals(game.host)) {
			const delReturn = await game.deleteOne() // can use query deleteOne method here
		}

		// if (game === undefined) {
		//     throw new DocumentNotFoundError()
		// }
		ack({ status: 'ok' })
		socket.leave(game.id)
		io.to('gameHub').emit('gameListUpdate')
	} catch (err) {
		next(err, io, socket)
	}
}

routerObj['selectFaction'] = async (data, io, socket, next, ack) => {
	console.log('in game selectFaction', data)
	try {
		const userId = data.user._id
		const gameId = data.game._id
		const user = await User.findById(userId)
		if (!user || !(user.token === data.user.token)) {
			throw new BadCredentialsError()
		}
		const game = await Game.findById(gameId).populate('players')
		if (!game) {
			throw new DocumentNotFoundError()
		}
		if (data.faction === 'empire' && !game.empire) {
			game.empire = user._id
			await game.save()
		} else if (data.faction === 'rebels' && !game.rebels) {
			game.rebels = user._id
			await game.save()
		}
		await game.populate('players')
		ack({ status: 'ok', game: game })
		io.to(game._id).emit('gameDetailsUpdate', game)
		io.to('gameHub').emit('gameListUpdate')
	} catch (err) {
		next(err, io, socket)
	}
}

routerObj['startGame'] = async (data, io, socket, next, ack) => {
	console.log('in start game ', data)
	try {
		const gameId = data.game._id
		const game = await Game.findById(gameId).populate('players')
		if (!game) {
			throw new DocumentNotFoundError()
		}

        if(game.isStarted) {
            console.log('game already started')
            throw new BadCredentialsError
        }
		// do 'is players Ready' check in V2 here
		// if (game.rebels && game.empire) {

		// }
		if (!game.empire) {
			game.empire = game.players[0]?._id // we've populated the player array
		}
		if (!game.rebels) {
			game.rebels = game.players[1]?._id
		}
		game.isStarted = true;
		game.data = await initializeDefaultGame();
        // console.log('game after initialization', game.data)
		await game.save()
		// console.log('just saved, this is game', game)
		ack({ status: 'ok', data: game })
		io.to(game._id).emit('startGameSuccess', game)

		io.to('gameHub').emit('gameListUpdate')
	} catch (err) {
		next(err, io, socket)
	}
}

routerObj['endGame'] = async (data, io, socket, next, ack) => {
	try {
		const gameId = data.game._id
		const game = await Game.findById(gameId).populate('players')
		if (!game) {
			throw new DocumentNotFoundError()
		}
		game.isCompleted = true
		game.data = null
		game.save()

		socket.to(game._id).emit('gameEnded')
	} catch (err) {
		next(err, io, socket)
	}
}

 // probs need new error handling approach here vai ack
routerObj['playCard'] = async (data, io, socket, next, ack) => {
    // console.log('in play card route', data)

    try {
        const { user, card } = data
        const gameId = data.game._id
        // console.log(gameId)
        const game = await Game.findById(gameId)
        if (!game) {
            // console.log(game)
            throw new DocumentNotFoundError()
        }

        const gameData = data.game.data
        // console.log('fetched game data', gameData)
        let faction = null
        // who is playing the card, is it their turn ? 
        if (user._id.equals(game.empire)) {
            faction = 'empire'
        } else if (user._id.equals(game.rebels)) {
            faction = 'rebels'
        }
        if(!faction){
            console.log( ' play not assigned a faction ?', data)
            throw new BadCredentialsError
        }
        if((gameData.isEmpireTurn && faction === 'rebels')|| (!gameData.isEmpireTurn && faction === 'empire')){
            console.log('not players turn, isEmpiresTurn is',gameData.isEmpireTurn )
            throw new BadCredentialsError
        }
        // okay, it is the players turn, lets play this card
        console.log('card', card)
        gameData[faction].hand.splice(card.index, 1)//remove card from hand
        gameData[faction].inPlay.push(card)// add card to play area
        // does card have ability or resources or force ?
        if(card.force > 0 ){
            if(faction === 'rebels'){ 
                gameData.theForce += card.force
                if(gameData.theForce > 6){
                    gameData.theForce = 6
                }
            }else{
                gameData.theForce -= card.force
                if(gameData.theForce < 0){
                    gameData.theForce = 0
                }
            }
        }
        if(card.resources > 0){
            gameData[faction].resources += card.resources
        }
        if(card.ability){
            console.log('this card has an ability! ', card.ability)
        }
        // game.data = gameData
        // console.log('does mutating the game data object effect the original game object ? ',game) nope
        // await game.save() // game.save is not a function
        // console.log('saved game object after playCard ',game)
        // console.log('emitting gameDataUpdate with data:', gameData)
        io.to(game._id).to(socket.id).emit('gameDataUpdate', gameData)
    } catch (err) {
        next(err, io, socket)
    }
}
module.exports = routerObj
