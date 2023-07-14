const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
// express basics above

//db connection in between
require('dotenv').config()
require('./config/database')

// socket goodness below
const { Server } = require('socket.io')
// create a new socket.io instance by passing the express server to the sockets Server constructor function,
const io = new Server(server)

io.on('connection', (socket) => {
	console.log('a user connected with socket:', socket.id)
    
    socket.on('disconnect', () => {
        console.log('user disconnected with socket:', socket.id)
    })
})

server.listen(3000, () => {
	console.log(" I'm listening on *:3000")
})