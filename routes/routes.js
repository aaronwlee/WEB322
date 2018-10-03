
const fs = require('fs');
const express = require('express');
var multer = require('multer');
var path = require('path');
const router = express.Router();
var dataService = require('../data-service');

var storage =  multer.diskStorage({
    destination: '../public/images/uploaded',
    filename: (req, file, cb) => {
        cb (null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

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

/**
 * Employee Routes
 */
router.get('/employees', (req, res)  => {
    dataService.getAllEmployees()
    .then(data => res.json(data))
    .catch(err => res.json({ message: err}))
});

router.get('/employees/add', (req, res) => {
    res.sendFile(path.join(__dirname + "../../views/addEmployee.html"));
});

router.get('/departments', (req, res) => {
    dataService.getDepartments()
    .then(data => res.json(data))
    .catch(err => res.json({ message: err}))
});

/**
 * Adding Images
 */
router.get('/images/add', (req, res) => {
    res.sendFile(path.join(__dirname + "../../views/addImage.html"));
});

router.post('/images/add', upload.single('imageFile'), (req, res, next) => {
    res.redirect('/images');   
});

router.get('/images', (req, res) => {
    fs.readdir('../public/images/uploaded', (err, files) => {
        res.json({
            images: files
        });
    });
});

router.get('*', (req, res) => {
    res.send(`The page does not exist`, 404);
});

module.exports = router;