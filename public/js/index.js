var socket = io();

function scrollToBottom() {
	// selectors
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');

	// heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	// prev goes to the previous child, so its 2nd last child of newMessage
	var lastMessageHeight = newMessage.prev().innerHeight();


	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		// jquery messages
		messages.scrollTop(scrollHeight);
	}
}

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
	
	// templating for mustache
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);

	// console.log('New message', message);
	// var formattedTime = moment(message.createdAt).format('h:mm a');
	// var li = jQuery('<li></li>');
	// li.text(message.from + " " + formattedTime + ": " + message.text);

	// jQuery('#messages').append(li);
	scrollToBottom();
});

// socket.emit('createMessage', { 
// 	from: 'Frank',
// 	text: 'hi'
// }, function(data) {
// 	console.log('Got it', data);
// });

socket.on('newLocationMessage', function(message) {
	// mustache!
	var formattedTime = moment(message.createdAt).format('h:mm a');
	// the .html call gets all the html that is inside of that id
	var template = jQuery('#location-message-template').html();
	// store the return value. Render takes 2 arguments, the template you want to render, and the data you want to render into the template
	var html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);


	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target="_blank">My Current Location</a>');
	// var formattedTime = moment(message.createdAt).format('h:mm a');
	// li.text(message.from + " " + formattedTime + ": ");

	// // setting the attribute of our anchor to the url the users geolocation provided to us
	// a.attr('href', message.url);
	// li.append(a);
	// jQuery('#messages').append(li);
	scrollToBottom();
});

// preventing page reload
// setting up for when a user submits a message 
jQuery('#message-form').on('submit', function(event) {
	event.preventDefault();

	var messageTextbox = jQuery('[name=message]');

	socket.emit('createMessage', {
		from: 'User',
		// setting the user given text equal to the text
		text: messageTextbox.val()
	}, function() {
		messageTextbox.val('');
	});
});

var locationButton = jQuery('#send-location');
// click listener on the button
locationButton.on('click', function() {
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	}

	locationButton.attr('disabled', 'disabled').text('sending location...');

	// takes 2 functions, success and fail
	navigator.geolocation.getCurrentPosition(function(position) {
		// console.log(position);
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function() {
		alert('Unable to fetch location');
		locationButton.removeAttr('disabled').text('Send location');
	});
});