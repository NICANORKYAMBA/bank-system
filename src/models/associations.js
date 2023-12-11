const sequelize = require('../database');

sequelize.models.User.hasMany(sequelize.models.Account, {
  foreignKey: 'userId',
  as: 'Accounts',
  onDelete: 'CASCADE'
});

sequelize.models.Account.belongsTo(sequelize.models.User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

sequelize.models.User.hasMany(sequelize.models.Transaction, {
  foreignKey: 'userId',
  as: 'Transactions',
  onDelete: 'CASCADE'
});

sequelize.models.Transaction.belongsTo(sequelize.models.User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

sequelize.models.Account.hasMany(sequelize.models.Transaction, {
  foreignKey: 'accountId',
  as: 'Transactions',
  onDelete: 'CASCADE'
});

sequelize.models.Transaction.belongsTo(sequelize.models.Account, {
  foreignKey: 'accountId',
  onDelete: 'CASCADE'
});

sequelize.models.User.hasOne(sequelize.models.UserAddress, {
  foreignKey: 'userId',
  as: 'Addresses',
  onDelete: 'CASCADE'
});

sequelize.models.UserAddress.belongsTo(sequelize.models.User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
