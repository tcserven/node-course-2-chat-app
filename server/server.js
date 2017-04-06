// this is actually a waste because we go into server and back out... well use join!
// console.log(__dirname + '/../public');

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message')
const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


// serve up the public folder
app.use(express.static(publicPath));

// registers for an event listener, in this case its connection. when a new user connects to the server. 
io.on('connection', function(socket) {
	console.log('New user connected');

	// emit events. Similar to listener, except we are creating an event. 
	// socket.emit('newEmail', {
	// 	from: 'mike@example.com',
	// 	text: 'hey, whats up?',
	// 	createdAt: 123
	// });

	// socket.emit('newMessage', {
	// 	from: 'Mike',
	// 	text: 'when do you want to meet?',
	// 	createdAt: 456
	// });

	// socket.on('createEmail', function(newEmail) {
	// 	console.log('createEmail: ', newEmail);
	// });

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', function(message, callback) {
		console.log('createMessage: ', message);
		
		// broadcasting to all connected users
		io.emit('newMessage', generateMessage(message.from, message.text)
			// from: message.from,
			// text: message.text,
			// createdAt: new Date().getTime()
		);
		callback();

		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	// listener
	socket.on('createLocationMessage', function(coords) {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', function() {
		console.log('User was disconnected from server');
	});
});




server.listen(port, function() {
	console.log("server has started on " + port);
});