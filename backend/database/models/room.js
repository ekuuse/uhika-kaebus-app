module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define(
        "rooms",
        {
            room_nr: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            room_letter: {
                type: DataTypes.enum("A", "B", "C"),
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
            tableName: "rooms",
            freezeTableName: true,
            timestamps: false,
        }
    );
    return Room;
};