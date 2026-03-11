module.exports = (sequelize, DataTypes) => {
    const Complaint = sequelize.define(
        "complaints",
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
        },
        {
            tableName: "complaints",
            freezeTableName: true,
            timestamps: false,
        }
    );
    return Complaint;
};