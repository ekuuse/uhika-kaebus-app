const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

console.log('Database connection parameters:');
console.log('Host:', Bun.env.DB_HOST);
console.log('Database:', Bun.env.DB_NAME);
console.log('User:', Bun.env.DB_USER);
console.log('Password length:', Bun.env.DB_PASSWORD ? Bun.env.DB_PASSWORD.length : 0);

const sequelize = new Sequelize(Bun.env.DB_NAME, Bun.env.DB_USER, Bun.env.DB_PASSWORD, {
  host: Bun.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 60000
  }
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const models = {};
fs.readdirSync(__dirname + '/models').forEach(file => {
  const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
  models[model.name] = model;
});

console.log(Object.keys(models));

const { User, Room, Complaint, ComplaintRoom } = models;

if (!User || !Room || !Complaint || !ComplaintRoom) {
  throw new Error('Model initialization failed. Expected models: User, Room, Complaint, ComplaintRoom.');
}

// ROOM - USER
Room.hasMany(User, {
  foreignKey: "room_nr",
});

User.belongsTo(Room, {
  foreignKey: "room_nr",
});


// USER - COMPLAINT
User.hasMany(Complaint, {
  foreignKey: "user_id",
});

Complaint.belongsTo(User, {
  foreignKey: "user_id",
});

// COMPLAINT - ROOMS 
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



Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = { sequelize, models };