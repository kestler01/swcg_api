const User = require('../models/user')
const {
	BadParamsError,
	DocumentNotFoundError,
	BadCredentialsError,
} = require('../lib/custom-errors')
const bcrypt = require('bcrypt')
const bcryptSaltRounds = 10
let crypto
try {
	crypto = require('node:crypto')
} catch (err) {
	console.error('crypto support is disabled!')
} 

const routerObj = {} // declare my router pojo

routerObj['signup'] = async (data, io, socketId, next) => {
	console.log('in signup route before user creation', data)
	try {
		if (
			// check redundant with FE JS but i don't see that as a bad thing
			!data ||
			!data.password ||
			!data.profileName ||
			data.password !== data.passwordConfirmation
		) {
			throw new BadParamsError()
		}
        // we have good params
        // hash the password
		const hashPassword = await bcrypt.hash(data.password, bcryptSaltRounds)
        // get the other details
		let { email, profileName } = data
        // build our data object for creation 
		let userData = { email, profileName, hashPassword }
		// userData.email = data.email,
		// userData.hashedPassword = hash
		let user = await User.create(userData)
		// send the new user object back with status 201, but `hashedPassword`
		// won't be send because of the `transform` in the User model
        // removed the email and hash password from the data for sending to client 
		user = await user.toObject()
		io.to(socketId).emit('signupSuccess', user) 
        // add auto sign in functionality here
	} catch (error) {
		next(error, io, socketId) // promisedError, io, socketId
	}
}

routerObj['signin'] = async (data, io, socketId, next) => {
	console.log('in userRouter for signin, the data passed is :', data)
	const pw = data.password
	try {
		const user = await User.findOne({ email: data.email })
		if (!user) {
			throw new BadCredentialsError()
		}
		console.log(user)
		const passwordCorrect = await bcrypt.compare(pw, user.hashPassword)
		if (!passwordCorrect) {
			throw new BadCredentialsError()
		}
		const token = crypto.randomBytes(16).toString('hex')
		user.token = token
		user.socketId = socketId
		await user.save()
		io.to(socketId).emit('signinSuccess', user.toObject())
	} catch (error) {
		next(error, io, socketId)
	}
}

routerObj['changePassword'] = async (data, io, socketId, next, ack) => {
	console.log(
		'in change password route, the data passed is',
		data,
		'from socket id:',
		socketId
	)
	const pw = data.password
	const newPw = data.newPassword
    const token = data.token
    const userId = data._id
	try {
		const user = await User.findById(userId)
		if (!user) {
			throw new DocumentNotFoundError()
		}
        if (!user.token === token){
            throw new BadCredentialsError()
        }
		const passwordCorrect = await bcrypt.compare(pw, user.hashPassword)
		if (!passwordCorrect) {
			throw new BadCredentialsError()
		}
		const hashPassword = await bcrypt.hash(newPw, bcryptSaltRounds)
		user.hashPassword = hashPassword
		await user.save()
		io.to(socketId).emit('changePasswordSuccess')
		ack({status:'ok'})
	} catch (error) {
		next(error, io, socketId)
	}
}

routerObj['signout'] = async (data, io, socketId, next) => {
	console.log('in signout route, data is :', data)
	try {
		const user = await User.findById(data._id)
		if (!user) {
            throw new DocumentNotFoundError()
        }
        // scramble the token
        const token = crypto.randomBytes(16).toString('hex')
        user.token = token
        // clear the socket - no more emits going here
        user.socketId = null
        await user.save()
		io.to(socketId).emit('signoutSuccess')
	} catch (error) {
		next(error, io, socketId)
	}
}

routerObj['changeProfileName'] = async (data, io, socketId, next, ack) => {
	console.log('in changeProfileName route, data is :', data)
	const token = data.token
	try {
		const newProfileName = data.newProfileName
		const token = data.token
		const user = await User.findById(data._id)
		if (!user) {
			throw new DocumentNotFoundError()
		}
        if (!user.token === token || !newProfileName) { // if its not the right user or there is not a new profile name then BadCreds error
					throw new BadCredentialsError()
				}

		//change user profile
		user.profileName = newProfileName
		await user.save()
		io.to(socketId).emit('changeProfileNameSuccess', user)
		ack({status: 'ok'})
	} catch (error) {
		next(error, io, socketId)
	}
}

module.exports = routerObj