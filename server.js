/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Lean Junio Student ID: 019-109-123 Date: Friday, November 23, 2018
*
* Online (Heroku) Link: https://ljjunioweb322a5.herokuapp.com/departments
*
********************************************************************************/

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const clientSessions = require('client-sessions');

const PORT = process.env.PORT || 8080;
const app = express();

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
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

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

