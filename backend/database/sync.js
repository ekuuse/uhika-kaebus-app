const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  Bun.env.DB_NAME,
  Bun.env.DB_USER,
  Bun.env.DB_PASSWORD,
  {
    host: Bun.env.DB_HOST,
    dialect: 'mysql',
    define: {
      freezeTableName: true,
    },
    logging: false,
  }
);


const User = require('./models/user')(sequelize, Sequelize.DataTypes);
const Event = require('./models/event')(sequelize, Sequelize.DataTypes);
const Deadline = require('./models/deadline')(sequelize, Sequelize.DataTypes);
const Room = require('./models/room')(sequelize, Sequelize.DataTypes);
const Complaint = require('./models/complaint')(sequelize, Sequelize.DataTypes);
const ComplaintRoom = require('./models/complaintRoom')(sequelize, Sequelize.DataTypes);


// ROOM → USER
Room.hasMany(User, { foreignKey: "room_nr" });
User.belongsTo(Room, { foreignKey: "room_nr" });

// USER → COMPLAINT
User.hasMany(Complaint, { foreignKey: "user_id" });
Complaint.belongsTo(User, { foreignKey: "user_id" });

// ROOM ↔ COMPLAINT 
Room.belongsToMany(Complaint, {
  through: {
    model: ComplaintRoom,
    unique: false,
  },
  foreignKey: "room_nr",
  otherKey: "complaint_id",
});
Complaint.belongsToMany(Room, {
  through: {
    model: ComplaintRoom,
    unique: false,
  },
  foreignKey: "complaint_id",
  otherKey: "room_nr",
});


// USER - EVENT
User.hasMany(Event, {
  foreignKey: "user_id",
});

// USER - DEADLINE
User.hasMany(Deadline, {
  foreignKey: "user_id",
});


const models = { User, Event, Deadline, Room, Complaint, ComplaintRoom, Event, Deadline };

async function syncDatabase(force = false) {
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await Room.sync({ force });
    await User.sync({ force });
    await Complaint.sync({ force });
    await ComplaintRoom.sync({ force });
    await Event.sync({ force });
    await Deadline.sync({ force });

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Tables synced successfully!");
  } catch (err) {
    console.error("Error syncing database:", err);
  }
}

if (require.main === module) {
  syncDatabase(true).then(() => process.exit());
}

module.exports = { sequelize, models, syncDatabase };