var socket = io();

socket.on('connect', function() {
	console.log('Connected to server');

	// socket.emit('createEmail', {
	// 	to: 'jen@example.com',
	// 	text: 'Hey this is thomas'		
	// });

	// socket.emit('createMessage', {
	// 	from: 'jen@example.com',
	// 	text: 'this is create message!'		
	// });
});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

// custom event
// socket.on('newEmail', function(email) {
// 	console.log('New email', email);
// });

socket.on('newMessage', function(message) {
	console.log('New message', message);
	var li = jQuery('<li></li>');
	li.text(message.from + ": " + message.text);

	jQuery('#messages').append(li);
});

// socket.emit('createMessage', { 
// 	from: 'Frank',
// 	text: 'hi'
// }, function(data) {
// 	console.log('Got it', data);
// });

// preventing page reload
jQuery('#message-form').on('submit', function(event) {
	event.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: jQuery('[name=message]').val()
	}, function() {

	});
});