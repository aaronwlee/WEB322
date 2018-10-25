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
        if (err) reject('Unable to read file')
            employeesArr = JSON.parse(data);
        fs.readFile(department_file, (err, data) => {
            if (err) reject('Unable to read file')
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

exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        if (!employeeData.isManager)
            employeeData.isManager = false;
        else
            employeeData.isManager = true;

        employeeData.employeeNum = employeesArr.length + 1;
        employeesArr.push(employeeData);

        resolve('Added new employee');
    });
}

exports.updateEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        let emp = employeesArr.filter(employee => {
            let data = JSON.parse(employeeData)
            console.log(data.employeeNum)
        });
        if (emp.length > 0) resolve('Updated');
        else reject('no matches found');        
    })
}

exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        console.log(`getEmployeesByStatus: ${status}`);
        let emp = employeesArr.filter(employee => {
            if (status.localeCompare(employee.status) == 0)
                return employee;
        });
    
        if (emp.length > 0) resolve(emp);
        else reject('no results returned');
    });
}

exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        console.log(`getEmployeesByDepartment: ${department}`);
        let emp = employeesArr.filter(employee => {
            if (department.localeCompare(employee.department) == 0)
                return employee;
        });
        if (emp.length > 0) resolve(emp);
        else reject('no results returned');
    })
}

exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {
        console.log(`getEmployeesByManager: ${manager}`);
        
        let emp = employeesArr.filter(employee => {
            if (manager.localeCompare(employee.employeeManagerNum) == 0)
                return employee;
        });

        if (emp.length > 0) resolve(emp);
        else reject('no results returned');
    })
}

exports.getEmployeesByNum = (num) => {
    return new Promise((resolve, reject) => {
        console.log(`getEmployeesByNum: ${num}`);
        let emp = employeesArr.filter(employee => employee.employeeNum == num);
        if (emp.length > 0) resolve(emp[0]);
        else reject('no results returned');
    })
}