const express = require("express");
const router = express.Router();
const userDb = require("../data/helpers/userDb.js");
const bcrypt = require("bcryptjs");

// Protected MWare
function protected(req, res, next) {
  // console.log(req.session);
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json("Unauthorized user");
  }
}

router.get("/users", (req, res) => {
  console.log("TYPEOF USERDB####", typeof userDb);
  userDb
    .getAllUsers()
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
  // save the user to the userDb
  userDb
    .registerUser(creds)
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
  userDb
    .loginUser(creds)
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

router.put("/update/:id", protected, (req, res) => {
  const { id } = req.params;
  let { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 14);
  password = hashedPassword;
  const user = { username, password };
  userDb
    .updateUser(id, user)
    .then(ids => {
      console.log(ids);
      res.status(200).json(ids);
    })
    .catch(err => {
      res.status(500).json({ err, error: "Failed to update user" });
    });
});

router.delete("/delete/:id", protected, (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  userDb
    .deleteUser(userId)
    .then(count => {
      if (count === 1) {
        console.log(res);
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "User could not be found" });
      }
    })
    .catch(err => {
      res.status(500).json({ err, error: "Failed to delete user" });
    });
});

module.exports = router;
