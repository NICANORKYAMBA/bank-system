import sequelize from '../database.js';

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

sequelize.models.User.hasOne(sequelize.models.UserAddress, {
  foreignKey: 'userId',
  as: 'Addresses',
  onDelete: 'CASCADE'
});

sequelize.models.UserAddress.belongsTo(sequelize.models.User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

sequelize.models.Account.hasMany(sequelize.models.Transaction, {
  foreignKey: 'sourceAccountId',
  as: 'sourceTransactions',
  onDelete: 'CASCADE'
});

sequelize.models.Transaction.belongsTo(sequelize.models.Account, {
  foreignKey: 'sourceAccountId',
  as: 'sourceTransactionAccount'
});

sequelize.models.Account.hasMany(sequelize.models.Transaction, {
  foreignKey: 'destinationAccountId',
  as: 'destinationTransactions',
  onDelete: 'CASCADE'
});

sequelize.models.Transaction.belongsTo(sequelize.models.Account, {
  foreignKey: 'destinationAccountId',
  as: 'destinationTransactionAccount'
});
