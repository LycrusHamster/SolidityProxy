var Migrations = artifacts.require('./Migrations.sol');

module.exports = function (deployer, network, accounts) {
  console.log('==================available accounts==================');
  console.log(accounts);
  console.log('==================available accounts==================');

  const admin = accounts[0];
  const FROMADMIN = {from: admin};

  deployer.deploy(Migrations, FROMADMIN);
};
