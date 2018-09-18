const fs = require('fs');
var exports = module.exports = {};

// Files
let employee_file = 'data/employees.json';
let department_file = 'data/departments.json';

var employees = [];
var departments = [];

// Read contents of the "./data/employees.json"
exports.initialize = () => {
    filesHaveBeenRead.then()
}

// Promise for reading files
var filesHaveBeenRead = new Promise((resolve, reject) => {
    fs.readFile(employee_file, (err, data) => {
        if (err) reject(`Error encountered: ${err}`);
        else {
            employees = JSON.parse(data);
            fs.readFile(department_file, (err, data) => {
                if (err) reject(`Error encountered: ${err}`);
                departments = JSON.parse(data);
                resolve('Files read successfully!');
            });
        }
    });
});