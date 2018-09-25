const fs = require('fs');
var exports = module.exports = {};

// Files
let employee_file = 'data/employees.json';
let department_file = 'data/departments.json';

var employeesArr = [];
var departmentsArr = [];

// Read contents of the "./data/employees.json"
let readFiles = new Promise((resolve, reject) => {
    fs.readFile(employee_file, (err, data) => {
        if (err) reject('Unable to read file');
        employeesArr = JSON.parse(data);
        fs.readFile(department_file, (err, data) => {
            if (err) reject('Unable to read file');
            departmentsArr = JSON.parse(data);
            resolve('Read files succesfully!');
        });
    });
});

exports.initialize = () => {
    return readFiles;
}

exports.getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        if (employeesArr.length == 0) reject('No results returned');
        resolve(employeesArr);
    });
}

exports.getManagers = () => {
    return new Promise((resolve, reject) => {
        let managers = employeesArr.filter(employee => employee.isManager == true);
        if (managers == 0) reject('No results returned')
        resolve(managers);
    });
}

exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        if (departmentsArr.length == 0) reject('No results returned');
        resolve(departmentsArr);
    });
}