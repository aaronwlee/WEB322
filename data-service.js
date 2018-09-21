const fs = require('fs');
var exports = module.exports = {};

let employee_file = 'data/employees.json';
let department_file = 'data/departments.json';

var employees = [];
var departments = [];

exports.initialize = () => {
    p_filesHaveBeenRead.then((data) => {
        console.log(`INSIDE PROMISE: exports.initialize: employees ${employees.length}`)
        console.log(`INSIDE PROMISE: exports.initialize: departments ${departments.length}`)
    })
    
    console.log(`OUTSIDE PROMISE: exports.initialize: employees ${employees.length}`)
    console.log(`OUTSIDE PROMISE: exports.initialize: departments ${departments.length}`)
}

// Promises
let p_filesHaveBeenRead = new Promise((resolve, reject) => {
    fs.readFile(employee_file, (err, data) => {
        if (err) reject(`ERROR: Cannot read ${employee_file}`);
        else {
            employees = JSON.parse(data);
            console.log(`employees.length: ${employees.length}`);
            fs.readFile(department_file, (err, data) => {
                if (err) reject(`ERROR: Cannot read ${department_file}`);
                else {
                    departments = JSON.parse(data);
                    console.log(`departents.length: ${departments.length}`);
                    resolve(`READ`);
                }
            })
        }
    });
});
