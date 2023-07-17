const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
// express basics above

// other imports
const {
	signup,
	signin,
	signout,
	changePassword,
} = require('./routes/userRoutes')
const errorHandler = require('./lib/errorHandler')

//db connection in between
require('dotenv').config()
require('./config/database')

// socket goodness below
const { Server } = require('socket.io')
// create a new socket.io instance by passing the express server to the sockets Server constructor function,
const io = new Server(server,{
    cors: {
        origin: 'http://localhost:5173'
    }
})



io.on('connection', (socket) => {
	console.log('a user connected with socket:', socket.id)
    
    socket.on('signup', (data) => {
			console.log(' a user signed up ')
			console.log(data)
			signup(data, io, socket.id, errorHandler)
    })
    socket.on('signin', (data) => {
        console.log(' a user signed in ')
        console.log(data)
        signin(data, io, socket.id, errorHandler)
    })
    // should write a is logged in middleware to protect auth required routes
    socket.on('changePassword', (data) => {
        console.log('received change pw request')
        changePassword(data, io, socket.id, errorHandler)
	})

	socket.on('signout', (data) => {
		signout(data, io, socket.id, errorHandler)
		// console.log(socket.rooms)// interesting being able to get the socket rooms left on disconnect even tho cleanup is automated - will be great for trigger appropriate emits to those rooms 
		console.log(' a user signed out')
    })
    
    socket.on('disconnect', () => {
        console.log('user disconnected with socket:', socket.id)
    })
})

server.listen(3000, () => {
	console.log(` I'm listening on *:3000`)
})