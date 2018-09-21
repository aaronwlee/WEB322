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

var routes = require('./routes/routes');

// PORT Config
var HTTP_PORT = process.env.PORT || 8080;

// Configure the public folder
app.use(express.static('public'));
app.set('views', path.join(__dirname, '/views'));

var dataService = require('./data-service');

// Home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

// About page route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

// Requests
app.get('/managers', (req, res) => {
    res.send(`TODO: get all employers that are managers`);
});

app.get('/employees', (req, res) => {
    res.send(`TODO: return JSON formatted string containing all of the employees within employees.json`);
});

app.get('/departments', (req, res) => {
    res.send(`TODO: return a JSON formatted string containing all of the departments within the departments.json file`);
});

app.get('/*', (req, res) => {
    res.send('Page Not Found');
    res.sendStatus(404);
})

dataService.initialize();

