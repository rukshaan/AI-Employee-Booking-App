const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = dbConfig.url
  ? new Sequelize(dbConfig.url, {
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
    })
  : new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Employee = require("./employee.model.js")(sequelize);
db.Employer = require("./employer.model.js")(sequelize);
db.Admin = require("./admin.model.js")(sequelize);

module.exports = db;
