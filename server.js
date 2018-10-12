/*********************************************************************************
* WEB322: Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Lean Junio Student ID: 019-1091523 Date: October 08, 2018
*
* Online (Heroku) URL: https://intense-shore-93459.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8080;
var app = express();

// Routes and data-service
var routes = require('./routes/routes');
var dataService = require('./data-service');

// Configure the public folder
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));

app.use('/', routes);

dataService.initialize()
    .then(() => app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`)))
    .catch(err => res.json({ message: err}))

