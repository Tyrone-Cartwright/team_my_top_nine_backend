const express = require("express");
const router = express.Router();
const db = require("../data/dbConfig.js");
const bcrypt = require("bcryptjs");

// Protected MWare
function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json("Unauthorized user");
  }
}

router.get("/users", protected, (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.post("/register", (req, res) => {
  //Grab the username and password from the body
  const creds = req.body;
  // generate the hash from the users password
  const hash = bcrypt.hashSync(creds.password, 15);
  // override the user password with the hash
  creds.password = hash;
  // save the user to the db
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      req.session.username = creds.username;
      res.status(201).json({ newUserId: id });
    })
    .catch(err => res.json(err));
});

router.post("/login", (req, res) => {
  // Grab the username and password from body
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        // passwords match and the user exists by the username
        res.status(200).json({ message: "Thank you for signing in!" });
      } else {
        // either username or password is invalid
        res.status(401).json({ message: "Please enter valid information!" });
      }
    })
    .catch(err => res.json(err));
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("Unable to logout, try again");
      } else {
        res.send("You are logged out");
      }
    });
  }
});

module.exports = router;
