/*********************************************************************************
* WEB322: Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Lean Junio Student ID: 019-1091523 Date: September 4, 2018
*
* Online (Heroku) URL: https://stark-meadow-12652.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var app = express();

// PORT Config
var HTTP_PORT = process.env.PORT || 8080;

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    var student = {
        name: "Lean Junio",
        studentNumber: "019-109-123"
    }
    res.send(`${student.name} - ${student.studentNumber}`);
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);