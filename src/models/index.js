const User = require('./user');
const Account = require('./accounts');
const UserAddress = require('./userAddress');

User.hasOne(UserAddress, {
  foreignKey: 'userId',
  as: 'address',
});

UserAddress.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = {
  User,
  Account,
  UserAddress
};