module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define(
        "Room",
        {
            room_nr: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            room_letter: {
                type: DataTypes.ENUM("A", "B", "C"),
                primaryKey: true,
                allowNull: false,
            },
            floor: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            grade: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: "room",
            freezeTableName: true,
            timestamps: false,
        }
    );
    return Room;
};