let Delegate = artifacts.require('./Delegate.sol');
let Proxy = artifacts.require('./Proxy.sol');

module.exports = async function (deployer, network, accounts) {
  const deployerAddress = accounts[0];
  const FROM_DEPLOYER = {from: deployerAddress};

  let delegate;
  let proxy;

  /*await deployer.deploy(Delegate, FROM_ADMIN);
  delegate = await Delegate.deployed();

  await deployer.deploy(Proxy, FROM_ADMIN);
  proxy = await Proxy.deployed();

  console.log('delegate address :                       ' + delegate.address);
  console.log('proxy address :                          ' + proxy.address);*/
};
