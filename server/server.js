// this is actually a waste because we go into server and back out... well use join!
// console.log(__dirname + '/../public');

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

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

	socket.on('disconnect', function() {
		console.log('User was disconnected from server');
	});
});




server.listen(port, function() {
    console.log("server has started on " + port);
});