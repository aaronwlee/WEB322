const fs = require("fs");
const express = require("express");
var multer = require("multer");
var path = require("path");
const router = express.Router();
var dataService = require("../data-service");

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

router.get("/managers", (req, res) => {
  dataService
    .getManagers()
    .then(data => res.json(data))
    .catch(err => res.json({ message: err }));
});

/**
 * Employee Routes
 */
router.get("/employees", (req, res) => {
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

router.get("/employees/add", (req, res) => {
  res.render("addEmployee");
});

router.post("/employees/add", (req, res) => {
  let employeeToAdd = req.body;
  dataService.addEmployee(employeeToAdd).then(() => res.redirect("/employees"));
});

router.post("/employee/update", (req, res) => {
  dataService
    .updateEmployee(req.body)
    .then(() => res.redirect("/employees"))
    .catch(err => console.log(err));
});2


router.get("/employee/:value", (req, res) => {
  dataService
    .getEmployeesByNum(req.params.value)
    .then(data => res.render("employee", { employee: data }))
    .catch(err => res.render({ message: err }));
});

/**
 * Departments
 */
router.get("/departments", (req, res) => {
  dataService
    .getDepartments()
    .then(data =>
      data.length > 0
        ? res.render("departments", { data: data })
        : res.render("departments", { message: "no results" })
    )
    .catch(err => res.render('departments', { message: "no results" }));
});

router.get('/departments/add', (req, res) => {
  res.render('addDepartment');
});

router.post('/departments/add', (req, res) => {
  dataService.addDepartment(req.params)
    .then(data => res.redirect('/departments'))
});

router.post('/department/update', (req, res) => {
  dataService.updateDepartment(req.params)
  .then(data => res.redirect('/departments'))
});

router.get("/department/:id", (req, res) => {
  dataService.updateDepartment(req.params.id)
    .then(data => res.render('department', { department: data }))
    .catch(err => res.status(400).send('Department not found'));
}); 

router.get('/departments/delete/:departmentId', (req, res) => {
  dataService.deleteDepartmentById(req.params.id)
    .then(data => res.redirect('/departments'))
    .catch(err => res.status(500).send('Unable to Remove Department / Department not found'))
})

/**
 * Adding Images
 */

router.post("/images/add", upload.single("imageFile"), (req, res, next) => {
  res.redirect("/images");
});

router.get("/images", (req, res) => {
  fs.readdir("public/images/uploaded", (err, files) => {
    if (err) throw err;
    else {
      res.render("images", { data: files });
    }
  });
});

router.get("*", (req, res) => {
  res.status(`The page does not exist`);
  res.sendStatus(404);
});

module.exports = router;
