const Storage = artifacts.require('./Storage.sol');
const Logic1 = artifacts.require('./Logic1.sol');
const Logic2 = artifacts.require('./Logic2.sol');
const Logic3 = artifacts.require('./Logic3.sol');
const Logic4 = artifacts.require('./Logic4.sol');
const Logic5 = artifacts.require('./Logic5.sol');
const LogicABI = artifacts.require('./LogicABI.sol');

contract('ProxyDelegateUserLookUpTest ', async (accounts) => {

  let storage;
  let logic1;
  let logic2;
  let logic3;
  let logic4;
  let logic5;
  let logicABI;
  const emptyBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const emptyAddress = '0x0000000000000000000000000000000000000000';

  const testBytes32 = '0x1100000000000000000000000000000000000000000000000000000000000011';
  const testAddress = '0x0000000000000000000000000000000000001111';
  const testUint256 = '0x1100000000000000000000000000000000000000000000000000000000111111';
  const testUint256_2 = '0x2200000000000000000000000000000000000000000000000000000000111111';
  const testBytes = '0x12344321';
  const testFixedAddress = '0x0000000000000000000000000000000000004444';
  const testFixedUint256 = '0x0000000000000000000000000000000000000000000000000000000000004444';

  const revertSig = '0x08c379a000000000000000000000000000000000000000000000000000000000';

  const abi_setAddress_1 = '0xc170d0fe';
  const abi_setBytes32_1 = '0xc22574aa';
  const abi_setUint256_2 = '0xfa469943';
  const abi_setBytes_2 = '0xa63cb761';
  const abi_setAddress_3 = '0x90050b9b';
  const abi_setBytes32_3 = '0xb9273f7b';
  const abi_getUint256_2 = '0x70318695';
  const abi_someABI_5 = '0x7dbc08c8';
  const abi_someABIview_5 = '0x5084a22b';

  let tx;
  let res;

  let delegates;
  let delegatesCount;
  let userZero;
  let sysZero;
  let sysSelectorsAndDelegate = {};
  let sysSelectorsAndDelegates = {};

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
    logic5 = await Logic5.at(storage.address);

    console.log(`logci1 address : ${logic1.address}`);
    console.log(`logci2 address : ${logic2.address}`);
    console.log(`logci3 address : ${logic3.address}`);
    console.log(`logci4 address : ${logic4.address}`);

    logicABI = await LogicABI.at(storage.address);

    tx = await storage.sysAddDelegates([logic1.address]);
    tx = await storage.sysAddDelegates([logic2.address]);
    tx = await storage.sysAddDelegates([logic3.address]);
  });

  it('init', async () => {
    delegates = await storage.sysGetDelegateAddresses();
    expect(3).to.equal(delegates.length);
    expect(logic1.address).to.equal(delegates[0]);
    expect(logic2.address).to.equal(delegates[1]);
    expect(logic3.address).to.equal(delegates[2]);

  });

  it('call add setBytes32_1 logic1', async () => {

    res = await storage.sysGetSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    expect(0).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    tx = await storage.sysSetSelectorAndDelegate(abi_setBytes32_1, logic1.address);

    res = await storage.sysGetSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages : ');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetDelegateBySelector(abi_setBytes32_1);
    expect(logic1.address).to.equal(delegate);
    console.log('abi_setBytes32_1 delegate' + delegate);

    tx = await logicABI.setBytes32_1(testBytes32);
    res = await logicABI.getBytes32_1();

    expect(testBytes32).to.equal(res);

  });

  it('call add setUint256_2 logic2', async () => {

    res = await storage.sysGetSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    tx = await storage.sysSetSelectorAndDelegate(abi_setUint256_2, logic2.address);

    res = await storage.sysGetSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages : ');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(2).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetDelegateBySelector(abi_setUint256_2);
    expect(logic2.address).to.equal(delegate);
    console.log('abi_setUint256_2 delegate' + delegate);

    tx = await logicABI.setUint256_2(testUint256);
    res = (await logicABI.getUint256_2()).toString('hex');

    expect(testUint256).to.equal('0x' + res);
  });

  it('delete logic1', async () => {

    res = await storage.sysGetSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    expect(2).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    tx = await storage.sysDelDelegates([logic1.address]);

    delegates = await storage.sysGetDelegateAddresses();
    expect(2).to.equal(delegates.length);
    expect(logic2.address).to.equal(delegates[0]);
    expect(logic3.address).to.equal(delegates[1]);

    res = await storage.sysGetSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages : ');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetDelegateBySelector(abi_setBytes32_1);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_setBytes32_1 delegate' + delegate);

    delegate = await storage.sysGetDelegateBySelector(abi_setUint256_2);
    expect(logic2.address).to.equal(delegate);
    console.log('abi_setUint256_2 delegate' + delegate);

  });
  it('add logic4', async () => {

    tx = await storage.sysAddDelegates([logic4.address]);

    delegates = await storage.sysGetDelegateAddresses();
    expect(3).to.equal(delegates.length);
    expect(logic2.address).to.equal(delegates[0]);
    expect(logic3.address).to.equal(delegates[1]);
    expect(logic4.address).to.equal(delegates[2]);
  });

  it('sysSetSigZero to logic4', async () => {

    res = await storage.sysGetSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    tx = await storage.sysSetSigZero(logic4.address);

    sysZero = await storage.sysGetSigZero();
    expect(logic4.address).to.equal(sysZero);
  });

  it('send ETH and trigger defaultFallback in logic4, 2300 gas is not enough', async () => {

    tx = await logicABI.send('10', {
      from: deployerAddress,
      value: 10, //for 10 wei
      //gas:100000,
    });
    //console.log(tx);
    expect(1).to.equal(tx.logs.length);
    expect('DefaultFallback').to.equal(tx.logs[0].event);
    expect(10).to.equal(tx.logs[0].args.value.toNumber());
    console.log(`gasLeft : ${tx.logs[0].args.gasLeft.toNumber()}`);

  });
});