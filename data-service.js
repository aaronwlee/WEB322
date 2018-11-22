const Sequelize = require("sequelize");
const fs = require("fs");
var exports = (module.exports = {});

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
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

// Promises
let sqlPromise = new Promise((resolve, reject) => {
  sequelize
    .sync()
    .then(Employee => resolve("Employee model synced"))
    .then(Department => resolve("Department model synced"))
    .catch(err => reject(`Unable to sync database: ${err}`));
});

let getAllEmployees = () => {
  return Employee.findAll()
    .then(data => resolve(data))
    .catch(err => reject(err));
};
let getDepartments = () => {
  return Department.findAll()
    .then(data => resolve(data))
    .catch(err => reject(err));
};
let getManagers = () => {
  return Employee.findAll({
    isManager: true
  })
    .then(data => resolve(data))
    .catch(err => reject(`no results returned:`));
};

// generic promise function
let getEmployeesByOption = option => {
  return Employee.findAll({
    where: {
      [option]: option
    }
  })
    .then(data => resolve(data))
    .catch(err => reject(`no results returned`));
};

let getDepartmentByOption = option => {
  return Department.findAll({
    where: {
      [option]: option
    }
  })
    .then(data => resolve(data[0]))
    .catch(err => reject(`no results returned`));
}

let deleteDepartmentById = departmentId => {
  return Department.destroy({ where: { departmentId: departmentId }})
    .then(data => resolve('Deleted'))
    .catch(err => reject(err));
}

let addEmployee = employeeData => {
  employeeData.isManager = employeeData.isManager ? true : false;
  for (let i in employeeData) {
    if (employeeData[i] == "") {
      employeeData[i] = null;
    }
  }
  return Employee.create(employeeData, {
    where: {
      employeeNum: employeeData.employeeNum
    }
  })
    .then(employee => resolve(`creation success: ${employee}`))
    .catch(err => reject(`unable to create employee: ${err}`));
};

let updateEmployee = employeeData => {
  employeeData.isManager = employeeData.isManager ? true : false;
  for (let i in employeeData) {
    if (employeeData[i] == "") {
      employeeData[i] = null;
    }
  }
  return Employee.update(employeeData, {
    where: {
      employeeNum: employeeData.employeeNum
    }
  })
    .then(data => resolve(`update success: ${data}`))
    .catch(err => resolve(`update failed: ${err}`));
};

let updateDepartment = departmentData => {
  for (let i in departmentData) {
    if (departmentData[i] == "") {
      departmentData[i] = null;
    }
  }
  return Department.update(
    {
      departmentName: departmentData.departmentName
    },
    { 
      where: { departmentId: departmentData.departmentId } 
    }
  )
    .then(data => resolve(`Update succes: ${data}`))
    .catch(err => resolve(`Update failed: ${err}`))
};

let addDepartment = departmentData => {
  for (let i in departmentData) {
    if (departmentData[i] == "") {
      departmentData[i] = null;
    }
  }
  return Department.create(departmentData)
    .then(department => resolve(`Creation success: ${department}`))
    .catch(err => reject(`Unable to create department`));
};

exports.initialize = () => {
  return sqlPromise;
};
exports.getAllEmployees = () => {
  return getAllEmployees();
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
exports.addDepartment = departmentData => {
  return addDepartment(departmentData);
};
exports.updateDepartment = departmentData => {
  return updateDepartment(departmentData);
}
exports.getDepartmentById = departmentId => {
  return getDepartmentByOption(departmentId);
}
exports.deleteDepartmentById = departmentId => {
  return deleteDepartmentById(departmentId);
}