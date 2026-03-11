module.exports = (sequelize, DataTypes) => {
  const Deadline = sequelize.define(
    "deadlines",
    {
      deadline_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("korduv","tähtis"),
        allowNull: true,
      },
    },
    {
      tableName: "deadlines",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Deadline;
};