const Sequelize = require("sequelize");
var exports = (module.exports = {});

/**
 * Sequelize Model setup
 * - Employee
 * - Department
 */
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: true
    }
  }
);

const Employee = sequelize.define("employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  hireDate: Sequelize.STRING
});

const Department = sequelize.define("department", {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});

Department.hasMany(Employee, { foreignKey: "department" });

let sqlPromise = new Promise((resolve, reject) => {
  sequelize
    .sync()
    .then(Employee => resolve("Employee model synced"))
    .then(Department => resolve("Department model synced"))
    .catch(err => reject(`Unable to sync database: ${err}`));
});

/**
 * Employee Promise methods
 */

let getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    Employee.findAll()
    .then(data => resolve(data)) 
    .catch(err => reject(err));
  })
};

let getEmployeesByOption = option => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        [option]: option
      }
    })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
};

let addEmployee = employeeData => {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }
    Employee.create(employeeData, {
      where: {
        employeeNum: employeeData.employeeNum
      }
    })
      .then(employee => {
        console.log(employee.firstName)
        resolve(`creation success: ${employee}`)
      })
      .catch(err => reject(err));
  });
}

let updateEmployee = employeeData => {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }
    Employee.update(employeeData, {
      where: {
        employeeNum: employeeData.employeeNum
      }
    })
      .then(data => resolve(`update success: ${data}`))
      .catch(err => resolve(`update failed: ${err}`));
  })
};

let deleteEmployeeByNum = employeeNum => {
  return new Promise((resolve, reject) => {
    Employee.destroy({ where: { employeeNum: employeeNum } })
      .then(data => resolve("Deleted"))
      .catch(err => reject(err));
  });
};

let getManagers = () => {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      isManager: true
    })
      .then(data => resolve(data))
      .catch(err => reject(`no results returned:`));
  });
};

/**
 * Department Methods
 */

let getDepartments = () => {
  return new Promise((resolve, reject) => {
    Department.findAll()
      .then(data => {
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

let getDepartmentByOption = option => {
  return new Promise((resolve, reject) => {
    Department.findAll({
      where: {
        [option]: option
      }
    })
      .then(data => resolve(data[0]))
      .catch(err => reject(`no results returned`));
  });
};

let deleteDepartmentById = departmentId => {
  return new Promise((resolve, reject) => { 
    Department.destroy({ where: { departmentId: departmentId } })
    .then(data => resolve('Deleted'))
    .catch(err => reject(err));
  });
};

let updateDepartment = departmentData => {
  for (let i in departmentData) {
    if (departmentData[i] == "") {
      departmentData[i] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Department.update({ departmentName: departmentData.departmentName },{ where: { departmentId: departmentData.departmentId }})
      .then(data => resolve(`Update succes: ${data}`))
      .catch(err => resolve(`Update failed: ${err}`));
  });
};

let addDepartment = departmentData => {
  return new Promise((resolve, reject) => {
    for (let i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }
    Department.create(departmentData, {
      where: {
        departmentId: departmentData.departmentId
      }
    })
      .then(department => {
        resolve(department)
      })
      .catch(err => reject(`Unable to create department`));
  })
};

/**
 * Functions that are responsible for calling their respective promises
 */
exports.initialize = () => {
  return sqlPromise;
};
exports.getAllEmployees = () => {
  return getAllEmployees()
};
exports.getDepartments = () => {
  return getDepartments();
};
exports.getManagers = () => {
  return getManagers();
};
exports.getEmployeesByStatus = status => {
  return getEmployeesByOption(status);
};
exports.getEmployeesByDepartment = department => {
  return getEmployeesByOption(department);
};
exports.getEmployeesByManager = employeeManagerNum => {
  return getEmployeesByOption(employeeManagerNum);
};
exports.getEmployeesByNum = employeeNum => {
  return getEmployeesByOption(employeeNum);
};
exports.addEmployee = employeeData => {
  return addEmployee(employeeData);
};
exports.updateEmployee = employeeData => {
  return updateEmployee(employeeData);
};
exports.deleteEmployeeByNum = employeeNum => {
  return deleteEmployeeByNum(employeeNum);
};
exports.addDepartment = departmentData => {
  return addDepartment(departmentData);
};
exports.updateDepartment = departmentData => {
  return updateDepartment(departmentData);
};
exports.getDepartmentById = departmentId => {
  return getDepartmentByOption(departmentId);
};
exports.deleteDepartmentById = departmentId => {
  return deleteDepartmentById(departmentId);
};