const fs = require('fs');

let employee_file = 'data/employees.json';
let department_file = 'data/departments.json';

var employees = [];
var departments = [];

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        console.log('Reading files');
        fs.readFile(employee_file, (err, data) => {
            if (err) reject ('Could not read employees.json');
            else employees = JSON.parse(data)
            console.log(employees.length);
        });
        fs.readFile(department_file, (err, data) => {
            if (err) reject ('Could not read departments.json');
            else departments = JSON.parse(data)
            console.log(employees.length); // does not have access to employees array
        });

        if (employees.length > 0 && departments.length > 0) 
            resolve('Succesfully read files!');
    });
}
