const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var exports = (module.exports = {});

const userSchema = new Schema({
  userName: String,
  password: String,
  email: String,
  loginHistory: [{ dateTime: Date, userAgent: String }],
});

let User = mongoose.model('User', userSchema);
/**
 * Initializes a connection to the mongodb database that's provided within the .env file
 */
exports.initialize = () => {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(process.env.DB_CONNECTION_STRING);
    db.on('error', (err) => {
      reject(err);
    });
    db.once('open', () => {
      User = db.model('users', userSchema);
      resolve();
    })
  });
}

/**
 * Saves the userData into mongodb along with a few error checks:
 * @param {Object} - contains the data that the user is requesting to be saved to the database
 * - Checks if userData.password and userData.password2 are matching
 * - Checks if userData.userName is already taken
 * - Checks for any error while saving to db
 */
exports.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2)
      reject('Passwords do not match');
    else {
      let newUser = new User(userData);
      newUser.save((err, newUser) => {
        if (err && err.code == 11000)
          reject('User Name already taken');
        else if(err && err.code != 11000)
          reject(`There was an error creating the user: ${err}`);
        else
          resolve();
      });
    }
  });
}

/**
 * Checks the existing database for a specific user with the same information as the passed parameter:
 * @param {Object} - contains the user data to be checked within the database
 * - Checks if userData.userName is found
 * - Checks if password matches any of the passwords from the matching userName
 */
exports.checkUser = (userData) => {
  return new Promise((resolve, reject) => {
    User.find({ user: userData.userName }, (err, users) => {
      if (err)
        reject(`Unable to find user: ${userData.userName}`);
      else {
        if (users.length == 0)
          reject(`Unable to find user: ${userData.userName}`);
        if (users[0].password !== userData.password)
          reject(`Incorrect Password for user: ${userData.userName}`);
        if (users[0].password === userData.password) {
          users[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
          User.update({ userName: users[0].userName }, { $set: { loginHistory: users[0].loginHistory } }, (err, raw) => {
            if (err)
              reject(`There was an error verifying the user: ${err}`);
            else
              resolve(users[0]);
          });
        }
      }
    })
  });
}