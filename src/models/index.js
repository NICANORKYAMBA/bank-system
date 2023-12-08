const User = require('./user');
const Account = require('./accounts');
const UserAddress = require('./userAddress');

User.hasMany(Account, { as: 'Accounts' });
Account.belongsTo(User);

User.hasMany(UserAddress, { as: 'Addresses' });
UserAddress.belongsTo(User);

module.exports = {
  User,
  Account,
  UserAddress
};