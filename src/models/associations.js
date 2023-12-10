const sequelize = require('../database');

sequelize.models.User.hasOne(sequelize.models.UserAddress, {
  foreignKey: 'userId',
  as: 'Addresses',
  onDelete: 'CASCADE'
});

sequelize.models.UserAddress.belongsTo(sequelize.models.User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
