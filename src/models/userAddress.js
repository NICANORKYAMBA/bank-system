require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

const UserAddress = sequelize.define('UserAddress', {
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
            model: 'users',
            key: 'id',
        }
    }
}, {
    timestamps: true,
});

module.exports = UserAddress;