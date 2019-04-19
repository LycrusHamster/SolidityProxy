const SlotDataTest = artifacts.require('./SlotDataTest.sol');

contract('SlotDataTest ', async (accounts) => {

  let slotData;
  const slotName = web3.utils.toHex('testSlot');
  let slot;
  const emptyBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

  let tx;
  let len;

  const deployerAddress = accounts[0];
  const FROM_DEPLOYER = {from: deployerAddress};

  before('setup', async () => {
    slotData = await SlotDataTest.new(FROM_DEPLOYER);
    slot = await slotData.sysCalcSlot(slotName, FROM_DEPLOYER);
  });

  it('sysSaveSlotData & sysLoadSlotData', async () => {
    let slotValue = '0x0000112233445511223344551122334455112233445511223344551122334455';
    tx = await slotData.sysSaveSlotDataTest(slot, slotValue);

    let value = await slotData.sysLoadSlotDataTest(slot);
    expect(slotValue).to.equal(value);

    tx = await slotData.sysSaveSlotDataTest(slot, emptyBytes32);

    value = await slotData.sysLoadSlotDataTest(slot);
    expect(emptyBytes32).to.equal(value);
  });

  it('sysMapLen & sysMapSet & sysMapGet', async () => {
    len = await slotData.sysMapLenTest(slot);
    expect(0).to.equal(len.toNumber());

    const key1 = '0x1111111111111111111111111111111111111111111111111111111111111111';
    const key2 = '0x2222222222222222222222222222222222222222222222222222222222222222';

    const value1 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const value2 = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

    tx = await slotData.sysMapSetTest(slot, key1, value1);

    len = await slotData.sysMapLenTest(slot);
    expect(1).to.equal(len.toNumber());

    tx = await slotData.sysMapSetTest(slot, key2, value2);

    len = await slotData.sysMapLenTest(slot);
    expect(2).to.equal(len.toNumber());

    tx = await slotData.sysMapSetTest(slot, key1, value2);

    len = await slotData.sysMapLenTest(slot);
    expect(2).to.equal(len.toNumber());

    tx = await slotData.sysMapSetTest(slot, key2, emptyBytes32);

    len = await slotData.sysMapLenTest(slot);
    expect(1).to.equal(len.toNumber());

    tx = await slotData.sysMapSetTest(slot, key1, emptyBytes32);

    len = await slotData.sysMapLenTest(slot);
    expect(0).to.equal(len.toNumber());

    tx = await slotData.sysMapSetTest(slot, key2, value1);

    len = await slotData.sysMapLenTest(slot);
    expect(1).to.equal(len.toNumber());
  });

});