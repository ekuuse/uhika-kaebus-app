require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  define: {
    freezeTableName: true,
  },
});

const User = require('./models/user')(sequelize, Sequelize.DataTypes);
const Event = require('./models/event')(sequelize, Sequelize.DataTypes);
const Deadline = require('./models/deadline')(sequelize, Sequelize.DataTypes);
const Room = require('./models/room')(sequelize, Sequelize.DataTypes);
const Complaint = require('./models/complaint')(sequelize, Sequelize.DataTypes);


if (require.main === module) {
  sequelize.sync({ force: true }).then(() => {
    console.log('Tables created!');
    process.exit();
  });
}

module.exports = { sequelize, models: sequelize.models };