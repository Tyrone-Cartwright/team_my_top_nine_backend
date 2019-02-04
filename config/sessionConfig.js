const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const db = require("../data/dbConfig.js");

const sessionConfig = {
  store: new KnexSessionStore({
    tablename: "session",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 10
  }),
  secret: "dfgdg||dsdfkf%^kfirtnxv,kgt;sdwpnvc,zzCDb",
  name: "silverback",
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1 * 24 * 60 * 60 * 1000
  }
};

module.exports = sessionConfig;
