const mysql = require("mysql2");
const config = require("../config");

const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});

module.exports = connection;
