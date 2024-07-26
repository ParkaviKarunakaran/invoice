module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "items",
    {
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      cgst: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      sgst: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      tableName: "items",
      timestamps: false,
    },
    {
      tableName: "items",
      id: false,
    }
  );

  return Item;
};
