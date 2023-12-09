const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME_D, process.env.DB_USER_D, process.env.DB_PASSWORD_D, {
  host: process.env.DB_HOST_D,
  dialect: 'postgres'
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "Users",
  timestamps: true
});

// Define the association with UserAddress
User.hasOne(UserAddress, {
  foreignKey: 'userId',
  as: 'address',
  onDelete: 'CASCADE',
});

module.exports = User;
