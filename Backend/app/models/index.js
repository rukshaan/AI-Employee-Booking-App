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

db.Admin = require("./admin.model.js")(sequelize, Sequelize);
db.Employee = require("./employee.model.js")(sequelize, Sequelize);
db.Employer = require("./employer.model.js")(sequelize, Sequelize);
db.WorkType = require("./worktype.model.js")(sequelize, Sequelize);
db.Booking = require("./booking.model.js")(sequelize, Sequelize);
db.Complaint = require("./complaint.model.js")(sequelize, Sequelize);
db.Item = require("./item.model.js")(sequelize, Sequelize);
db.Message = require("./message.model.js")(sequelize, Sequelize);

// Associations
db.Booking.belongsTo(db.Employee, { foreignKey: 'employeeId' });
db.Booking.belongsTo(db.Employer, { foreignKey: 'employerId' });
db.Booking.belongsTo(db.WorkType, { foreignKey: 'workTypeId' });

db.Complaint.belongsTo(db.Employee, { foreignKey: 'employeeId' });
db.Complaint.belongsTo(db.Booking, { foreignKey: 'bookingId' });

db.Item.belongsTo(db.WorkType, { foreignKey: 'workTypeId' });

module.exports = db;
