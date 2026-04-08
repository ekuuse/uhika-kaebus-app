module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      google_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      status: {
        type: DataTypes.ENUM("pending", "denied", "accepted"),
        allowNull: false,
        defaultValue: "pending",
      },
      room_nr: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Room",
          key: "room_nr",
        },
      },
    },
    {
      tableName: "user",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return User;
};