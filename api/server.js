const express = require("express");
const configMWare = require("../config/globalMWare");
const routeLogin = require("../routes/login");
const server = express();

configMWare(server);

server.use("/api", routeLogin);

module.exports = server;
