
const fs = require('fs');
const express = require('express');
var multer = require('multer');
var path = require('path');
const router = express.Router();
var dataService = require('../data-service');

var storage =  multer.diskStorage({
    destination: 'public/images/uploaded',
    filename: (req, file, cb) => {
        cb (null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/about', (req, res) => {
    res.render('about');
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

    if (req.query.status)
        dataService.getEmployeesByStatus(req.query.status)
        .then(employees => res.render('employees', { data: employees }))
        .catch(err => res.render({ message: err }));
    else if (req.query.department)
        dataService.getEmployeesByDepartment(req.query.department)
        .then(employees => res.render('employees', { data: employees }))
        .catch(err => res.render({ message: err }));
    else if (req.query.manager)
        dataService.getEmployeesByManager(req.query.manager)
        .then(employees => res.render('employees', { data: employees }))
        .catch(err => res.render({ message: err }));
    else 
        dataService.getAllEmployees()
        .then(data => res.render('employees', { data: data }))
        .catch(err => res.render({ message: err}))
});

router.get('/employees/add', (req, res) => {
    res.render('addEmployee');
});

router.post('/employees/add', (req, res) => {
    let employeeToAdd = req.body;
    dataService.addEmployee(employeeToAdd)
        .then(() => res.redirect('/employees'));
});

router.post('/employee/update', (req, res) => {
    console.log(req.body);
    res.redirect('/employees');
})

router.get('/employee/:value', (req, res) => {
    dataService.getEmployeesByNum(req.params.value)
    .then(data => res.render('employee', { employee: data }))
    .catch(err => res.render({ message: err}))
});

router.get('/departments', (req, res) => {
    dataService.getDepartments()
    .then(data => res.render('departments', { data: data }))
    .catch(err => res.render({ message: err}))
});

/**
 * Adding Images
 */
router.get('/images/add', (req, res) => {
    res.render('addImage');
});

router.post('/images/add', upload.single('imageFile'), (req, res, next) => {
    res.redirect('/images');   
});

router.get('/images', (req, res) => {
    fs.readdir('public/images/uploaded', (err, files) => {
        if (err)
            throw err;
        else {
            res.render('images', { data: files });
        }
    });
});

router.get('*', (req, res) => {
    res.status(`The page does not exist`);
    res.sendStatus(404);
});

module.exports = router;