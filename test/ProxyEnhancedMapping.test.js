// it's a little bit annoying to do function test, so we do them together as whole mixed test

let Delegate = artifacts.require('./Delegate.sol');
let Proxy = artifacts.require('./Proxy.sol');

contract('proxy enhanced mapping', async (accounts) => {

  let proxy;
  let delegate;

  let tx;
  let fallback;

  const deployerAddress = accounts[0];
  const FROM_DEPLOYER = {from: deployerAddress};
  const adminAddress = accounts[0];
  const FROM_ADMIN = {from: adminAddress};

  const emptyAddress = '0x0000000000000000000000000000000000000000';
  const fakeAddress1 = '0x55ff000000000000000000000000000000000001';
  const fakeAddress2 = '0x55ff000000000000000000000000000000000002';
  const fakeAddress3 = '0x55ff000000000000000000000000000000000003';
  const fakeAddress4 = '0x55ff000000000000000000000000000000000004';
  const fakeAddress5 = '0x55ff000000000000000000000000000000000005';
  const fakeAddress6 = '0x55ff000000000000000000000000000000000006';
  const fakeAddress7 = '0x55ff000000000000000000000000000000000007';

  const fakeAddress = [emptyAddress, fakeAddress1, fakeAddress2, fakeAddress3, fakeAddress4, fakeAddress5, fakeAddress6, fakeAddress7];

  before('setup', async () => {
    //proxy = await Proxy.deployed();
    proxy = await Proxy.new(adminAddress, FROM_DEPLOYER);
    //delegate = await Delegate.deployed();
    delegate = await Delegate.new(FROM_DEPLOYER);
  });

  it('empty -> 1', async () => {

    await matchEnhancedMapping([0, 0]);

    // empty
    tx = await proxy.sysAddDelegate(fakeAddress[1], FROM_ADMIN);
    // 1

    await matchEnhancedMapping([0, 1, 0]);
  });

  it('1 -> 123', async () => {
    // 1
    tx = await proxy.sysAddDelegate(fakeAddress[2], FROM_ADMIN);
    tx = await proxy.sysAddDelegate(fakeAddress[3], FROM_ADMIN);
    // 1, 2, 3

    await matchEnhancedMapping([0, 1, 2, 3, 0]);
  });

  it('123 -> 32', async () => {
    // 1, 2, 3
    tx = await proxy.sysDelDelegate(fakeAddress[1], FROM_ADMIN);
    // 3, 2

    await matchEnhancedMapping([0, 3, 2, 0]);
  });

  it('32 -> 324', async () => {
    // 3, 2
    tx = await proxy.sysAddDelegate(fakeAddress[4], FROM_ADMIN);
    // 3, 2, 4

    await matchEnhancedMapping([0, 3, 2, 4, 0]);
  });

  it('324 -> 324', async () => {
    // 3, 2, 4
    let flag = false;
    try {
      tx = await proxy.sysAddDelegate(fakeAddress[4], FROM_ADMIN);
    } catch (e) {
      flag = true;
    }
    expect(flag).to.equal(true);
    // 3, 2, 4

    await matchEnhancedMapping([0, 3, 2, 4, 0]);
  });

  it('324 -> 34', async () => {
    // 3, 2, 4
    tx = await proxy.sysDelDelegate(fakeAddress[2], FROM_ADMIN);
    // 3, 4

    await matchEnhancedMapping([0, 3, 4, 0, 0]);
  });

  it('34 -> 3456', async () => {
    // 3, 4
    tx = await proxy.sysAddDelegate(fakeAddress[5], FROM_ADMIN);
    tx = await proxy.sysAddDelegate(fakeAddress[6], FROM_ADMIN);
    // 3, 4, 5, 6

    await matchEnhancedMapping([0, 3, 4, 5, 6, 0]);
  });

  it('3456 -> 54', async () => {
    // 3, 4, 5, 6
    tx = await proxy.sysDelDelegate(fakeAddress[6], FROM_ADMIN);
    tx = await proxy.sysDelDelegate(fakeAddress[3], FROM_ADMIN);
    // 5, 4

    await matchEnhancedMapping([0, 5, 4, 0, 0, 0]);
  });

  it('set fallback delegate to 5', async () => {

    fallback = await proxy.sysGetDelegateFallback(FROM_ADMIN);
    expect(fallback.toLowerCase()).to.equal(emptyAddress);

    tx = await proxy.sysSetDelegateFallback(fakeAddress[5], FROM_ADMIN);
    fallback = await proxy.sysGetDelegateFallback(FROM_ADMIN);
    expect(fallback.toLowerCase()).to.equal(fakeAddress[5]);
  });

  it('set fallback delegate to 3', async () => {

    tx = await proxy.sysSetDelegateFallback(fakeAddress[3], FROM_ADMIN);
    fallback = await proxy.sysGetDelegateFallback(FROM_ADMIN);
    expect(fallback.toLowerCase()).to.equal(fakeAddress[3]);
  });

  it('set fallback delegate to empty', async () => {

    tx = await proxy.sysSetDelegateFallback(emptyAddress, FROM_ADMIN);
    fallback = await proxy.sysGetDelegateFallback(FROM_ADMIN);
    expect(fallback.toLowerCase()).to.equal(emptyAddress);
  });

  // 0, 1, 2, 4, 7, 0
  async function matchEnhancedMapping (vector) {
    //console.log('[' + vector.toString() + ']');

    let count = 0;
    vector.forEach(function (e, i) {
      e !== 0 ? count++ : count;
    });

    //console.log(`effective count : ${count}`);

    let expCount = (await proxy.sysGetDelegateCount(FROM_DEPLOYER)).toNumber();
    expect(expCount).to.equal(count);

    for (let i = 0; i < vector.length; i++) {
      let e = vector[i];
      //console.log(`i : ${i} e : ${e}`);
      let tempAddress = await proxy.sysGetDelegateByIndex(i, FROM_DEPLOYER);
      //console.log(`tempAddress : ${tempAddress}`);
      expect(tempAddress.toLowerCase()).to.equal(fakeAddress[e]);

      if (e !== 0) {
        let index = (await proxy.sysGetIndexByDelegate(fakeAddress[e], FROM_DEPLOYER)).toNumber();
        //console.log(`index : ${index}`);
        expect(index).to.equal(i);
      }
    }

    //console.log('\n');
  }

});


