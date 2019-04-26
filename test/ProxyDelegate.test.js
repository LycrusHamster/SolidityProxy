const Storage = artifacts.require('./Storage.sol');
const Logic1 = artifacts.require('./Logic1.sol');
const Logic2 = artifacts.require('./Logic2.sol');
const Logic3 = artifacts.require('./Logic3.sol');
const Logic4 = artifacts.require('./Logic4.sol');

contract('ProxyDelegateTest ', async (accounts) => {

  let storage;
  let logic1;
  let logic2;
  let logic3;
  let logic4;
  const emptyBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const emptyAddress = '0x0000000000000000000000000000000000000000';


  let tx;

  let delegates;
  let delegatesCount;
  let userZero;
  let sysZero;
  let userAbis;
  let sysAbis;

  let delegateIndex;
  let delegate;

  const deployerAddress = accounts[0];
  const FROM_DEPLOYER = {from: deployerAddress};

  before('setup', async () => {
    storage = await Storage.new(FROM_DEPLOYER);
    logic1 = await Logic1.new(FROM_DEPLOYER);
    logic2 = await Logic2.new(FROM_DEPLOYER);
    logic3 = await Logic3.new(FROM_DEPLOYER);
    logic4 = await Logic4.new(FROM_DEPLOYER);
  });

  it('init', async () => {
    delegates = await storage.sysGetDelegateAddresses();
    expect(0).to.equal(delegates.length);

    userZero = await storage.sysGetSigZero();
    expect(emptyAddress).to.equal(userZero);

  });

  //1
  it('add logic1', async () => {
    tx = await storage.sysAddDelegates([logic1.address]);

    delegatesCount = (await storage.sysCountDelegate()).toNumber();
    delegates = await storage.sysGetDelegateAddresses();

    expect(delegates.length).to.equal(delegatesCount);
    expect(1).to.equal(delegatesCount);

    delegateIndex = (await storage.sysGetDelegateIndex(logic1.address)).toNumber();
    delegate = await storage.sysGetDelegateAddress(delegateIndex);
    expect(delegate).to.equal(logic1.address);
  });

  //1, 2
  it('add logic2', async () => {
    tx = await storage.sysAddDelegates([logic2.address]);

    delegatesCount = (await storage.sysCountDelegate()).toNumber();
    delegates = await storage.sysGetDelegateAddresses();

    expect(delegates.length).to.equal(delegatesCount);
    expect(2).to.equal(delegatesCount);

    delegateIndex = (await storage.sysGetDelegateIndex(logic2.address)).toNumber();
    expect(2).to.equal(delegateIndex);
    delegate = await storage.sysGetDelegateAddress(delegateIndex);
    expect(delegate).to.equal(logic2.address);
  });

  //1, 3
  it('replace logic2 by logic3', async () => {
    tx = await storage.sysReplaceDelegates([logic2.address],[logic3.address]);

    delegatesCount = (await storage.sysCountDelegate()).toNumber();
    delegates = await storage.sysGetDelegateAddresses();

    expect(delegates.length).to.equal(delegatesCount);
    expect(2).to.equal(delegatesCount);

    delegateIndex = (await storage.sysGetDelegateIndex(logic2.address)).toNumber();
    expect(0).to.equal(delegateIndex);

    delegateIndex = (await storage.sysGetDelegateIndex(logic3.address)).toNumber();
    expect(2).to.equal(delegateIndex);
    delegate = await storage.sysGetDelegateAddress(delegateIndex);
    expect(delegate).to.equal(logic3.address);
  });

  //3
  it('delete logic1', async () => {
    tx = await storage.sysDelDelegates([logic1.address]);

    delegatesCount = (await storage.sysCountDelegate()).toNumber();
    delegates = await storage.sysGetDelegateAddresses();

    expect(delegates.length).to.equal(delegatesCount);
    expect(1).to.equal(delegatesCount);

    delegateIndex = (await storage.sysGetDelegateIndex(logic1.address)).toNumber();
    expect(0).to.equal(delegateIndex);

    delegateIndex = (await storage.sysGetDelegateIndex(logic3.address)).toNumber();
    expect(1).to.equal(delegateIndex);
    delegate = await storage.sysGetDelegateAddress(delegateIndex);
    expect(delegate).to.equal(logic3.address);
  });

  //3, 1
  it('add logic1', async () => {
    tx = await storage.sysAddDelegates([logic1.address]);

    delegatesCount = (await storage.sysCountDelegate()).toNumber();
    delegates = await storage.sysGetDelegateAddresses();

    expect(delegates.length).to.equal(delegatesCount);
    expect(2).to.equal(delegatesCount);

    delegateIndex = (await storage.sysGetDelegateIndex(logic1.address)).toNumber();
    expect(2).to.equal(delegateIndex);

    delegateIndex = (await storage.sysGetDelegateIndex(logic3.address)).toNumber();
    expect(1).to.equal(delegateIndex);
    delegate = await storage.sysGetDelegateAddress(delegateIndex);
    expect(delegate).to.equal(logic3.address);
  });

  //3, 1
  it('delete logic2', async () => {
    let flag =false;
    try{
      tx = await storage.sysDelDelegates([logic2.address]);
    }catch (e) {
      flag = true;
    }
    expect(flag).to.equal(true);
  });

  //1
  it('delete logic3', async () => {
    tx = await storage.sysDelDelegates([logic3.address]);

    delegatesCount = (await storage.sysCountDelegate()).toNumber();
    delegates = await storage.sysGetDelegateAddresses();

    expect(delegates.length).to.equal(delegatesCount);
    expect(1).to.equal(delegatesCount);

    delegateIndex = (await storage.sysGetDelegateIndex(logic3.address)).toNumber();
    expect(0).to.equal(delegateIndex);

    delegateIndex = (await storage.sysGetDelegateIndex(logic1.address)).toNumber();
    expect(1).to.equal(delegateIndex);
    delegate = await storage.sysGetDelegateAddress(delegateIndex);
    expect(delegate).to.equal(logic1.address);
  });

  //1, 2, 3
  it('add logic2, logic3', async () => {
    tx = await storage.sysAddDelegates([logic2.address]);

    delegatesCount = (await storage.sysCountDelegate()).toNumber();
    delegates = await storage.sysGetDelegateAddresses();

    expect(delegates.length).to.equal(delegatesCount);
    expect(2).to.equal(delegatesCount);

    delegateIndex = (await storage.sysGetDelegateIndex(logic2.address)).toNumber();
    expect(2).to.equal(delegateIndex);
    delegate = await storage.sysGetDelegateAddress(delegateIndex);
    expect(delegate).to.equal(logic2.address);

    tx = await storage.sysAddDelegates([logic3.address]);

    delegatesCount = (await storage.sysCountDelegate()).toNumber();
    delegates = await storage.sysGetDelegateAddresses();

    expect(delegates.length).to.equal(delegatesCount);
    expect(3).to.equal(delegatesCount);

    delegateIndex = (await storage.sysGetDelegateIndex(logic3.address)).toNumber();
    expect(3).to.equal(delegateIndex);
    delegate = await storage.sysGetDelegateAddress(delegateIndex);
    expect(delegate).to.equal(logic3.address);
  });
});