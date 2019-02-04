const express = require("express");
const configMWare = require("../config/globalMWare");
const server = express();

configMWare(server);

module.exports = server;
