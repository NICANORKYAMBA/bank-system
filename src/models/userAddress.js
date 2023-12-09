const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME_D, process.env.DB_USER_D, process.env.DB_PASSWORD_D, {
  host: process.env.DB_HOST_D,
  dialect: 'postgres'
});

const UserAddress = sequelize.define('UserAddress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: true,
    primaryKey: true
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    }
  }
}, {
  tableName: 'UserAddress',
  timestamps: true,
  freezeTableName: true,
});

// Define the association with User
UserAddress.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

module.exports = UserAddress;
