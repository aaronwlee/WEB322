// routes.js - Main routes module

var express = require('express');
var path = require ('path');
var router = express.Router();

var dataService = require('../data-service');

// Home page route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "../../views/home.html"));
    console.log(dataService.initialize());
});

// About page route
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "../../views/about.html"));
});

// Requests
router.get('/managers', (req, res) => {
    res.send(dataService.getAllEmployees());
});

module.exports = router;