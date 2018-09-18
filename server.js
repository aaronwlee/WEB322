/*********************************************************************************
* WEB322: Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Lean Junio Student ID: 019-1091523 Date: September 4, 2018
*
* Online (Heroku) URL: https://stark-meadow-12652.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var path = require('path');
var app = express();

var dataService = require('./data-service');

// PORT Config
var HTTP_PORT = process.env.PORT || 8080;

// Configure the public folder
app.use(express.static('public'));
app.set('views', path.join(__dirname, '/views'));

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
    res.send(dataService.initialize());
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"))
});

// Requests
app.get('/managers', (req, res) => {
    res.send(dataService.getAllEmployees());
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, ()=> console.log(`Express http server listening on ${HTTP_PORT}`));