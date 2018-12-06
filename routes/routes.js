const fs = require("fs");
const express = require("express");
var multer = require("multer");
var path = require("path");
const router = express.Router();
var dataService = require("../data-service");
var dataServiceAuth = require('../data-service-auth');

const clientSessions = require('client-sessions');

const app = require('../server');

const ensureLogin = (req, res, next) => {
  if (!req.session.user)
    res.redirect('/login');
  else
    next();
}

// setup client sessions
app.use(clientSessions({
  cookieName: 'session',
  secret: 'web322assignment6',
  duration: 5 * 60 * 1000,
  activeDuration: 5 * 1000 * 60
}));

app.use((req, res, next) => { 
  res.locals.session = req.session;
  next();
});

var storage = multer.diskStorage({
  destination: "public/images/uploaded",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/managers", ensureLogin, (req, res) => {
  dataService
    .getManagers()
    .then(data => res.json(data))
    .catch(err => res.json({ message: err }));
}); 

/**
 * Employee Routes
 */
router.get("/employees", ensureLogin, (req, res) => {
  if (req.query.status)
    dataService
      .getEmployeesByStatus(req.query.status)
      .then(employees => res.render("employees", { data: employees }))
      .catch(err => res.render({ message: err }));
  else if (req.query.department)
    dataService
      .getEmployeesByDepartment(req.query.department)
      .then(employees => res.render("employees", { data: employees }))
      .catch(err => res.render({ message: err }));
  else if (req.query.manager)
    dataService
      .getEmployeesByManager(req.query.manager)
      .then(employees => res.render("employees", { data: employees }))
      .catch(err => res.render({ message: err }));
  else
    dataService
      .getAllEmployees()
      .then(data =>
        data.length > 0
          ? res.render("employees", { data: data })
          : res.render("employees", { message: "no results" })
      )
      .catch(err => res.render("employees", { message: "no results" }));
});

router.get("/employees/add", ensureLogin, (req, res) => {
  dataService
    .getDepartments()
      .then(data => res.render("addEmployee", { departments: data }))
      .catch(err => res.render("addEmployee", { departments: [] }));
});

router.post("/employees/add", ensureLogin, (req, res) => {
  dataService.addEmployee(req.body)
  .then(() => res.redirect("/employees"))
  .catch(err => res.status(500).send(`Error: ${err}`))
});

router.post("/employee/update", ensureLogin, (req, res) => {
  dataService
    .updateEmployee(req.body)
    .then(() => res.redirect("/employees"))
    .catch(err => console.log(err));
});

router.get("/employee/:empNum", ensureLogin, (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  dataService
    .getEmployeeByNum(req.params.empNum)
    .then(data => {
      if (data) {
        viewData.employee = data; //store employee data in the "viewData" object as "employee"
      } else {
        viewData.employee = null; // set employee to null if none were returned
      }
    })
    .catch(() => {
      viewData.employee = null; // set employee to null if there was an error
    })
    .then(dataService.getDepartments)
    .then(data => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"
      // loop through viewData.departments and once we have found the departmentId that matches
      // the employee's "department" value, add a "selected" property to the matching
      // viewData.departments object
      for (let i = 0; i < viewData.departments.length; i++) {
        if (
          viewData.departments[i].departmentId == viewData.employee.department
        ) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    })
    .then(() => {
      if (viewData.employee == null) {
        // if no employee - return an error
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", { viewData: viewData }); // render the "employee" view
      }
    });
});

router.get('/employees/delete/:empNum', ensureLogin, (req, res) => {
  dataService.deleteEmployeeByNum(req.params.empNum)
    .then(data => res.redirect('/employees'))
    .catch(err =>  res.status(500).send('Unable to Remove Employee / Employee not found'))
})

/**
 * Departments
 */
router.get("/departments", ensureLogin, (req, res) => {
  dataService.getDepartments()
    .then(data => {
      if (data.length > 0)
        res.render("departments", { departments: data })
      else
        res.render("departments", { message: "no results" })
    })
    .catch(err => res.render('departments', { message: 'no results' }));
});

router.get("/departments/add", ensureLogin, (req, res) => {
  res.render("addDepartment");
});

router.post("/departments/add", ensureLogin, (req, res) => {
  dataService
    .addDepartment(req.body)
    .then(data => res.redirect("/departments"))
    .catch(err => res.status(500).send('Unable to add department'))
});

router.post("/department/update", ensureLogin, (req, res) => {
  dataService
    .updateDepartment(req.params)
    .then(data => res.redirect("/departments"))
    .catch(err => res.status(500).send('Unable to update department'))

});

router.get("/department/:id", ensureLogin, (req, res) => {
  dataService
    .updateDepartment(req.params.id)
    .then(data => res.render("department", { department: data }))
    .catch(err => res.status(400).send("Department not found"));
});

router.get("/departments/delete/:departmentId", ensureLogin, (req, res) => {
  dataService.deleteDepartmentById(req.params.departmentId)
    .then(data => res.redirect("/departments"))
    .catch(err => res.status(500).send("Unable to Remove Department / Department not found"));
});

/**
 * Adding Images
 */

router.post("/images/add", upload.single("imageFile"), ensureLogin, (req, res, next) => {
  res.redirect("/images");
});

router.get("/images", ensureLogin, (req, res) => {
  fs.readdir("public/images/uploaded", (err, files) => {
    if (err) throw err;
    else {
      res.render("images", { data: files });
    }
  });
});

/**
 * Sessions
 */
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  dataServiceAuth.registerUser(req.body)
    .then(() => res.render('register', { successMessage: 'User created' }))
    .catch(err => res.render('register', { errorMessage: err, userName: req.body.userName }));
});

router.post('/login', (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  dataServiceAuth.checkUser(req.body)
    .then(user => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      }
      res.redirect('/employees');
    })
    .catch(err => {
      res.render('login', { errorMessage: err, userName: req.body.userName });
    });
});

router.get('/logout', (req, res) =>{
  req.session.reset();
  res.redirect('/');
});

router.get('/userHistory', ensureLogin, (req, res) => {
  res.render('userHistory')
});

router.get("*", (req, res) => {
  res.status(`The page does not exist`);
  res.sendStatus(404);
});

module.exports = router;
