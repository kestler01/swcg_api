module.exports = async (promisedError, io, socket) => {
	const error = await promisedError
	console.log('hit error handler function!')
	console.log('error before clean up for client: ', error)
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
	} else {
		error.name = 'omitted internal error'
		error.status = 500
		error.message = 'something went wrong'
		error.type = 'InternalServerError'
	}
	console.log('emitting error to user', {error:error})
	io.to(socket?._Id).emit('error', { status: error.status, type: error.type, name: error.name, message: error.message})
}
