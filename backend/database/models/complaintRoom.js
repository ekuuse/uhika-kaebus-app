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
      room_letter: {
        type: DataTypes.ENUM("A", "B", "C"),
        primaryKey: true,
      },
    },
    {
      tableName: "complaint_room",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return ComplaintRoom;
};