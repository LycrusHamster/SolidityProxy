const CallerLogic = artifacts.require('./CallerLogic.sol');
const CallerStorage = artifacts.require('./CallerStorage.sol');
const CalleeLogic = artifacts.require('./CalleeLogic.sol');
const CalleeStorage = artifacts.require('./CalleeStorage.sol');

contract('ChainCallTest', async (accounts) => {

  let callerLogic;
  let callerStorage;
  let calleeLogic;
  let calleeStorage;

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

  let tx;
  let res;

  let delegateIndex;
  let delegate;

  const deployerAddress = accounts[0];
  const FROM_DEPLOYER = {from: deployerAddress};

  before('setup', async () => {
    callerLogic = await CallerLogic.new(FROM_DEPLOYER);
    callerStorage = await CallerStorage.new(FROM_DEPLOYER);
    calleeLogic = await CalleeLogic.new(FROM_DEPLOYER);
    calleeStorage = await CalleeStorage.new(FROM_DEPLOYER);

    tx = await callerStorage.sysAddDelegates([callerLogic.address]);
    tx = await calleeStorage.sysAddDelegates([calleeLogic.address]);
  });

  it('init', async () => {
    tx = await callerLogic.setAddress(calleeStorage.address);
  });

  it('call setUint256Callee and getUint256Callee', async () => {

    tx = await callerLogic.setUint256Callee(testUint256);
    res = (await callerLogic.getUint256Callee()).toString('hex');
    expect(testUint256).to.equal('0x'+res);
  });


  it('call setUint256CalleeAndGet', async () => {

    tx = await callerLogic.setUint256CalleeAndGet(testUint256_2);
    expect(tx.logs.length).to.equal(1);
    expect(testUint256_2).to.equal('0x'+ tx.logs[0].args.u.toString('hex'))
  });
});