module.exports = (sequelize, DataTypes) => {
  const ComplaintRoom = sequelize.define(
    "ComplaintRoom",
    {
      complaint_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      room_nr: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return ComplaintRoom;
};