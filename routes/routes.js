const express = require('express');
var path = require('path');
const router = express.Router();
var dataService = require('../data-service');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "../../views/home.html"));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "../../views/about.html"));
});

router.get('/managers', (req, res) => {
    dataService.getManagers()
    .then(data => res.json(data))
    .catch(err => res.json({ message: err}))
});

router.get('/employees', (req, res)  => {
    dataService.getAllEmployees()
    .then(data => res.json(data))
    .catch(err => res.json({ message: err}))
});

router.get('/departments', (req, res) => {
    dataService.getDepartments()
    .then(data => res.json(data))
    .catch(err => res.json({ message: err}))
});

router.get('*', (req, res) => {
    res.send(`The page does not exist`, 404);
});

module.exports = router;