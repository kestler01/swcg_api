const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
// express basics above

// import routes
const errorHandler = require('./lib/error-handler')
const {
	signup,
	signin,
	signout,
	changePassword,
    changeProfileName,
} = require('./routes/user-routes')
const {
	createGame,
	getOpenGames,
	joinGame,
	leaveGame,
	deleteGame,
	startGame,
} = require('./routes/game-routes')

// load our process.env variables into the app
require('dotenv').config()
// connect to the database
require('./config/database')

// socket goodness below
const { Server } = require('socket.io')
// create a new socket.io instance by passing the express server to the sockets Server constructor function,
const io = new Server(server,{
    cors: {
        origin:'http://127.0.0.1:5173' // cannot use localhost here
    }
})
// consider writing a general ACK function for the socket.io instance to send responses automatically to the user socket

// io instance for prescribing to the game hub and updates


// register our socket.io routes with the socket instance 
io.on('connection', (socket) => {
	console.log('a user connected with socket:', socket.id, socket.handshake)

	// unauthenticated routes
	socket.on('signup', (data) => {
		console.log(' a user signed up ')
		console.log(data)
		signup(data, io, socket.id, errorHandler)
	})
	socket.on('signin', (data) => {
		console.log(' a user signed in ')
		console.log(data)
		signin(data, io, socket, errorHandler)
	})
	socket.on('disconnect', () => {
		console.log('user disconnected with socket:', socket.id)
        // if we want to do any manual clean up on disconnect, see the disconnecting event 
	})

	// everything here on is needs user authentication
	// should write a is logged in middleware to protect auth required routes / yes
	socket.on('changePassword', (data, ack) => {
		console.log('received change pw request')
		changePassword(data, io, socket.id, errorHandler, ack)
	})

	socket.on('signout', (data) => {
		signout(data, io, socket, errorHandler, ack)
		// console.log(socket.rooms)// interesting being able to get the socket rooms left on disconnect even tho cleanup is automated - will be great for trigger appropriate emits to those rooms
		console.log(' a user signed out')
	})

	socket.on('changeProfileName', (data, ack) => {
		changeProfileName(data, io, socket.id, errorHandler, ack)
	})

    // gameHub could be it's own io instance, but for now we will jut have it be a room users join. 
	socket.on('subscribeToGameHub', (data, ack) => {
        console.log('joining gameHub')
		socket.join('gameHub')
		// ack(data, ack)
	})
	socket.on('unsubscribeToGameHub', (data, ack) => {
        console.log('leaving gameHub')
		socket.leave('gameHub')
		// ack(data, ack)
	})

	socket.on('createGame', (data, ack) => {
		createGame(data, io, socket, errorHandler, ack)
	})
	socket.on('getOpenGames', (data, ack) => {
        getOpenGames(data, io, socket, errorHandler, ack)
    })
	
    socket.on('joinGame', (data, ack) => {
        joinGame(data, io, socket, errorHandler, ack)
    })
    socket.on('leaveGame', (data, ack) => {
        console.log('leaving game', data)
        leaveGame(data, io, socket, errorHandler, ack)
    })
    socket.on('deleteGame', (data, ack) => {
        deleteGame(data, io, socket, errorHandler, ack)
    })
	socket.on('startGame', (data, ack) => {
		startGame(data, io, socket, errorHandler, ack)
	})

})

server.listen(3000, () => {
	console.log(` I'm listening on *:3000`)
})