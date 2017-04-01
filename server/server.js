// this is actually a waste because we go into server and back out... well use join!
// console.log(__dirname + '/../public');

const path = require('path');
const express = require('express');
var app = express();

const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 3000;

// serve up the public folder
app.use(express.static(publicPath));







app.listen(port, function() {
    console.log("server has started on " + port);
});