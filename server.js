/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Lean Junio Student ID: 019-109-123 Date: 12/06/2018
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/ 

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 8080;
// const PORT = 8080;
const app = module.exports = express();

// .env file
require('dotenv').config();

// Routes and data-service
const routes = require('./routes/routes');
const dataService = require('./data-service');
const dataServiceAuth = require('./data-service-auth');

// Configure view engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    navLink: function (url, options) {
      return `<li` + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));

app.set('view engine', '.hbs');

/**
 * Middlewares
 */

// Configure the public folder
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));

// Show correct active item
app.use((req, res, next) => {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  console.log(`Route: ${app.locals.activeRoute}`);
  next();
});

app.use('/', routes);

dataService.initialize()
  .then(dataServiceAuth.initialize)
  .then(() => app.listen(PORT, () => console.log(`app listening on: ${PORT}`)))
  .catch(err => console.log(`unable to start server: ${err}`));

module.exports = app;