module.exports = async (promisedError, io, socketId) => {
	const error = await promisedError
	console.log('hit error handler function!')
	console.log(error)
	if (
		error.name.match(/Valid/) ||
		error.name === 'MongoError' ||
		error.name === 'MongoServerError'
	) {
		const message = 'The received params failed a Mongoose validation'
		error.status = 422
		error.message = message
	} else if (error.name === 'DocumentNotFoundError') {
		error.status = 404
	} else if (error.name === 'CastError' || error.name === 'BadParamsError') {
		error.status = 422
	} else if (error.name === 'BadCredentialsError') {
		error.status = 401
	}
	console.log('emitting error to user', error)
	io.to(socketId).emit('error', error)
}
