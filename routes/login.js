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

module.exports = router;
