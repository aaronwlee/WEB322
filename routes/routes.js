// // routes.js - Main routes module

// var express = require('express');
// var path = require ('path');
// var router = express.Router();

// var dataService = require('../data-service');

// // Home page route
// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + "../../views/home.html"));
//     console.log(`INITIALIZE(): ${dataService.initialize()}`);
// });

// // About page route
// router.get('/about', (req, res) => {
//     res.sendFile(path.join(__dirname + "../../views/about.html"));
// });

// // Requests
// router.get('/managers', (req, res) => {
//     res.send(`TODO: get all employers that are managers`);
// });

// router.get('/employees', (req, res) => {
//     res.send(`TODO: return JSON formatted string containing all of the employees within employees.json`);
// });

// router.get('/departments', (req, res) => {
//     res.send(`TODO: return a JSON formatted string containing all of the departments within the departments.json file`);
// });

// router.get('/*', (req, res) => {
//     res.send('Page Not Found');
//     res.sendStatus(404);
// })

// module.exports = router;