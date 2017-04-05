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

socket.on('newLocationMessage', function(message) {
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My Current Location</a>');
	li.text(message.from + ": ");

	// setting the attribute of our anchor to the url the users geolocation provided to us
	a.attr('href', message.url);
	li.append(a);
	jQuery('#messages').append(li);
});

// preventing page reload
jQuery('#message-form').on('submit', function(event) {
	event.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		// setting the user given text equal to the text
		text: jQuery('[name=message]').val()
	}, function() {

	});
});

var locationButton = jQuery('#send-location');
// click listener on the button
locationButton.on('click', function() {
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.')
	}
	// takes 2 functions, success and fail
	navigator.geolocation.getCurrentPosition(function(position) {
		// console.log(position);
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function() {
		alert('Unable to fetch location');
	});
});