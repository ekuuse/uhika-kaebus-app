module.exports = (sequelize, DataTypes) => {
  const Complaint = sequelize.define(
    "Complaint",
    {
      complaint_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      reasoning: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sent_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      tableName: "complaint",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Complaint;
};
