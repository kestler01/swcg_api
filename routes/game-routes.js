const Game = require('../models/game')
const User = require('../models/user')
const {
	BadParamsError,
	DocumentNotFoundError,
	BadCredentialsError,
} = require('../lib/custom-errors')

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
            players:[user._id]
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
    try{
        const userId = data.user._id
        const gameId = data.gameId
        const user = await User.findById(userId)
        if (!user || !(user.token === data.token)) {
            throw new BadCredentialsError()
        }
        const game = await Game.findById(gameId).populate('players')
        if (!game){
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
        ack({status:'ok', games: games})
    } catch (err) {
        next(err, io, socket)
    }
}

routerObj['joinGame'] = async (data, io, socket, next, ack) => {
    console.log('in join game', data)
    try{
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
        if (game.players.length >= 2 || game.isStarted){
            ack({status:'full'})
            throw new BadCredentialsError()
        }
        if (!game.players.includes(user._id)){
            game.players.push(user._id)
			await game.save()
        }
        await game.populate({path:'players'})

        // socket.to(socket.id).emit('joinGameSuccess', game)
        socket.join(game._id)
        socket.to(game._id).emit('gameDetailsUpdate', game)
        io.to('gameHub').emit('gameListUpdate')
        ack({status:'ok', message:'joined game', game: game})
    }catch (err) {
        next(err, io, socket)
    }
}

routerObj['leaveGame'] = async (data, io, socket, next, ack) => {
    console.log('in leaveGame', data)
    try{
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
        if (game.host.equals(user._id) ) { // if the host is leaving
            if (game.players.length > 1) { // if there are more than one players
                game.host = game.players[1] // other player becomes the host
                game.players = game.players.slice(1)// remove the leaving player form the array and have it so the player array only contains the current host at index 0. 
            } else { // else, delete the game
                return routerObj.deleteGame(data, io, socket, next, ack)
            }
        }
        game.players.splice(1, 1) // remove the other player from the array
        if (game.empire?.equals(user._id) ){ // if it was the empire player, clear it
            game.empire = null
        }
        if (game.rebels?.equals(user._id) ){ // if it was the rebels player, clear it
            game.rebels = null
        }
        await game.save()
        await game.populate('players')
        ack({status:'ok'})
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
        const game = await Game.findById(gameId)  //returns a query 
        console.log('find by id return query : ', game)
        if(user._id.equals(game.host)){
            const delReturn = await game.deleteOne() // can use query deleteOne method here
            console.log('delete one returned promise resolved to : ', delReturn)
        }
        
        // if (game === undefined) {
        //     throw new DocumentNotFoundError()
        // }
        ack({status:'ok'})
        socket.leave(game.id)
        io.to('gameHub').emit('gameListUpdate')
    } catch (err) {
        next(err, io, socket)
    }
}

routerObj['selectFaction'] = async (data, io, socket, next, ack) => {
    console.log('in game selectFaction', data)
    try{
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
        if( data.faction === 'empire' && !game.empire){
            game.empire = user._id
            await game.save()
        } else if ( data.faction === 'rebels' && !game.rebels){
            game.rebels = user._id
            await game.save()
        }
        await game.populate('players')
        ack({status:'ok', game: game})
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
        // do 'is players Ready' check in V2 here
        // if (game.rebels && game.empire) {

        // }
        if(!game.empire){
            game.empire = game.players[0]?._id // we've populated the player array 
        }
        if(!game.rebels){
            game.rebels = game.players[1]?._id
        }
        game.isStarted = true
        game.data = {gameState: 'gameStateGoesHere'} // placeholder
        await game.save()
        console.log('just saved, this is game', game)
        ack({status:'ok',data: game})
        io.to(game._id).emit('startGameSuccess', game)
        
        io.to('gameHub').emit('gameListUpdate')
    } catch (err) {
        next(err, io, socket)
    }
}

routerObj['endGame'] = async (data, io, socket, next, ack) => {
    console.log('in start game ', data)
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
module.exports = routerObj