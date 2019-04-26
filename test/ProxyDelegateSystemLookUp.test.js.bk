const Storage = artifacts.require('./Storage.sol');
const Logic1 = artifacts.require('./Logic1.sol');
const Logic2 = artifacts.require('./Logic2.sol');
const Logic3 = artifacts.require('./Logic3.sol');
const Logic4 = artifacts.require('./Logic4.sol');
const Logic5 = artifacts.require('./Logic5.sol');
const LogicABI = artifacts.require('./LogicABI.sol');

contract('ProxyDelegateSystemLookUpTest ', async (accounts) => {

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

    res = await storage.sysGetSystemSelectorAndDelegateByIndex(0);
    console.log('index 0 : ' + JSON.stringify(res));

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
    delegates = await storage.sysGetDelegates();
    expect(3).to.equal(delegates.length);
    expect(logic1.address).to.equal(delegates[0]);
    expect(logic2.address).to.equal(delegates[1]);
    expect(logic3.address).to.equal(delegates[2]);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    expect(0).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

  });

  it('call setBytes32_1 logic1', async () => {

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    expect(0).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    tx = await logicABI.setBytes32_1(testBytes32);
    res = await logicABI.getBytes32_1();
    expect(testBytes32).to.equal(res);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages : ');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_setBytes32_1);
    expect(logic1.address).to.equal(delegate);
    console.log('abi_setBytes32_1 delegate' + delegate);
  });

  it('call setAddress_1 logic1', async () => {

    tx = await logicABI.setAddress_1(testAddress);
    res = await logicABI.getAddress_1();
    expect(testAddress).to.equal(res);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(2).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_setAddress_1);
    expect(logic1.address).to.equal(delegate);
    console.log('abi_setAddress_1 delegate' + delegate);
  });

  it('call setUint256_2 logic2', async () => {

    tx = await logicABI.setUint256_2(testUint256);
    res = (await logicABI.getUint256_2()).toString('hex');
    expect(testUint256).to.equal('0x' + res);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(3).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_setUint256_2);
    expect(logic2.address).to.equal(delegate);
    console.log('abi_setUint256_2 delegate' + delegate);
  });

  //logic2 logic3
  it('delete logic1, all selectors and delegates to logic1 have been deleted', async () => {

    tx = await storage.sysDelDelegates([logic1.address]);

    delegates = await storage.sysGetDelegates();
    expect(2).to.equal(delegates.length);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_setAddress_1);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_setAddress_1 delegate' + delegate);

    delegate = await storage.sysGetSystemDelegate(abi_setBytes32_1);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_setBytes32_1 delegate' + delegate);

    delegate = await storage.sysGetSystemDelegate(abi_setUint256_2);
    expect(logic2.address).to.equal(delegate);
    console.log('abi_setUint256_2 delegate' + delegate);
  });

  it('call setUint256_2 logic2 again, nothing happens', async () => {

    delegate = await storage.sysGetSystemDelegate(abi_getUint256_2);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_getUint256_2 delegate' + delegate);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    tx = await logicABI.setUint256_2(testUint256);
    res = (await logicABI.getUint256_2()).toString('hex');
    //view function will never get system indexed automatically
    expect(testUint256).to.equal('0x' + res);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_setBytes_2);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_setBytes_2 delegate' + delegate);

    delegate = await storage.sysGetSystemDelegate(abi_setUint256_2);
    expect(logic2.address).to.equal(delegate);
    console.log('abi_setUint256_2 delegate' + delegate);
  });

  it('call setBytes_2 logic2', async () => {

    delegate = await storage.sysGetSystemDelegate(abi_setBytes_2);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_setBytes_2 delegate' + delegate);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    tx = await logicABI.setBytes_2(testBytes);
    //tx = await logicABI.getUint256_2();
    res = await logicABI.getBytes_2();
    expect(testBytes).to.equal(res);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(2).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_setBytes_2);
    expect(logic2.address).to.equal(delegate);
    console.log('abi_setBytes_2 delegate' + delegate);

    delegate = await storage.sysGetSystemDelegate(abi_setUint256_2);
    expect(logic2.address).to.equal(delegate);
    console.log('abi_setUint256_2 delegate' + delegate);
  });

  it('clear system Selectors And Delegates', async () => {

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(2).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    res = await storage.sysGetSystemSelectorAndDelegateByIndex(1);
    console.log('index 1 : ' + JSON.stringify(res));
    res = await storage.sysGetSystemSelectorAndDelegateByIndex(2);
    console.log('index 2 : ' + JSON.stringify(res));

    tx = await storage.sysClearSystemSelectorsAndDelegates();

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(0).to.equal(sysSelectorsAndDelegates.sysSelectors.length);
  });

  it('call setAddress_1 logic4, but logic4 is not added', async () => {

    delegate = await storage.sysGetSystemDelegate(abi_setAddress_1);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_setAddress_1 delegate' + delegate);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(0).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    let flag = false;
    try {

      tx = await logicABI.setAddress_1(testAddress);
    } catch (e) {
      flag = true;
    }
    expect(true).to.equal(flag);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(0).to.equal(sysSelectorsAndDelegates.sysSelectors.length);
  });

  it('add logic3 as delegate again', async () => {
    let flag = false;
    try {
      tx = await storage.sysAddDelegates([logic3.address]);

    } catch (e) {
      flag = true;
    }
    expect(true).to.equal(flag);
  });

  //logic2 logic3 logic4
  it('add logic4 as delegate', async () => {
    tx = await storage.sysAddDelegates([logic4.address]);
    delegates = await storage.sysGetDelegates();
    expect(3).to.equal(delegates.length);
    expect(logic2.address).to.equal(delegates[0]);
    expect(logic3.address).to.equal(delegates[1]);
    expect(logic4.address).to.equal(delegates[2]);
  });

  it('call someABI logic5', async () => {

    tx = await logic5.someABI_5(testAddress);
    //console.log(tx);
    expect(1).to.equal(tx.logs.length);
    expect('DefaultFallback').to.equal(tx.logs[0].event);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_someABI_5);
    expect(logic4.address).to.equal(delegate);
    console.log('abi_someABI_5 delegate' + delegate);

    res = await storage.sysGetSystemSelectorAndDelegateByIndex(1);
    console.log('index 1 : ' + JSON.stringify(res));

    try {
      tx = await logic5.someABIview_5();
      //console.log(tx);
    } catch (e) {
      //although the delegate falls into defaultFallback() and emit DefaultFallback;
      //but it doesn't return any value.
      //so that web3.js can't convert '0x' to address, which throws an error
      flag = true;
    }
    expect(true).to.equal(flag);
  });

  it('call setAddress_1 logic4, now logic4 is added', async () => {

    delegate = await storage.sysGetSystemDelegate(abi_setAddress_1);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_setAddress_1 delegate' + delegate);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    //1 = someABI
    expect(1).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    tx = await logicABI.setAddress_1(testAddress);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    //2 = someABI + setAddress_1
    expect(2).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_setAddress_1);
    expect(logic4.address).to.equal(delegate);
    console.log('abi_setAddress_1 delegate' + delegate);
  });

  it('send ETH and trigger defaultFallback in logic4, 2300 gas is not enough', async () => {

    tx = await logicABI.send('10', {
      from: deployerAddress,
      value: 10, //for 10 wei
      //gas:2300,
    });
    //console.log(tx);
    expect(1).to.equal(tx.logs.length);
    expect('DefaultFallback').to.equal(tx.logs[0].event);
    expect(10).to.equal(tx.logs[0].args.value.toNumber());
    console.log(`gasLeft : ${tx.logs[0].args.gasLeft.toNumber()}`);

    sysZero = await storage.sysGetSystemSigZero();
    expect(logic4.address).to.equal(sysZero);

  });

  //logic2 logic3
  it('delete logic4', async () => {

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(2).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_setAddress_1);
    expect(logic4.address).to.equal(delegate);
    console.log('abi_setAddress_1 delegate' + delegate);

    delegate = await storage.sysGetSystemDelegate(abi_someABI_5);
    expect(logic4.address).to.equal(delegate);
    console.log('abi_someABI_5 delegate' + delegate);

    tx = await storage.sysDelDelegates([logic4.address]);

    delegates = await storage.sysGetDelegates();
    expect(2).to.equal(delegates.length);

    res = await storage.sysGetSystemSelectorsAndDelegates();
    sysSelectorsAndDelegates.sysSelectors = res.selectors;
    sysSelectorsAndDelegates.sysDelegates = res.delegates;
    console.log('selectors & deletages :');
    console.log(JSON.stringify(sysSelectorsAndDelegates));

    expect(0).to.equal(sysSelectorsAndDelegates.sysSelectors.length);

    delegate = await storage.sysGetSystemDelegate(abi_setAddress_1);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_setAddress_1 delegate' + delegate);

    delegate = await storage.sysGetSystemDelegate(abi_someABI_5);
    expect(emptyAddress).to.equal(delegate);
    console.log('abi_someABI_5 delegate' + delegate);

    sysZero = await storage.sysGetSystemSigZero();
    expect(emptyAddress).to.equal(sysZero);
  });
});