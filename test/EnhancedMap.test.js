const EnhancedMapTest = artifacts.require('./EnhancedMapTest.sol');

contract('EnhancedMapTest ', async (accounts) => {

  let enhancedMap;
  const slotName = web3.utils.toHex('testSlot');
  let slot;
  const emptyBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

  let tx;
  let size;
  let key;
  let value;

  const key1 = '0x0000111111111111111111111111111111111111111111111111111111111111';
  const key2 = '0x0000222222222222222222222222222222222222222222222222222222222222';
  const key3 = '0x0000333333333333333333333333333333333333333333333333333333333333';
  const key4 = '0x0000444444444444444444444444444444444444444444444444444444444444';

  const value1 = '0x1111111111111111111111111111111111111111111111111111111111111111';
  const value2 = '0x2222222222222222222222222222222222222222222222222222222222222222';
  const value3 = '0x3333333333333333333333333333333333333333333333333333333333333333';
  const value4 = '0x4444444444444444444444444444444444444444444444444444444444444444';

  const deployerAddress = accounts[0];
  const FROM_DEPLOYER = {from: deployerAddress};

  before('setup', async () => {
    enhancedMap = await EnhancedMapTest.new(FROM_DEPLOYER);
    slot = await enhancedMap.sysCalcSlot(slotName, FROM_DEPLOYER);
  });

  it('add value1', async () => {
    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(0).to.equal(size.toNumber());

    tx = await enhancedMap.sysEnhancedMapAddTest(slot, key1, value1);

    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(1).to.equal(size.toNumber());

    value = await enhancedMap.sysEnhancedMapGetTest(slot, key1);
    expect(value1).to.equal(value.toString());
  });

  it('add value2', async () => {
    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(1).to.equal(size.toNumber());

    tx = await enhancedMap.sysEnhancedMapSetTest(slot, key2, value2);

    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    value = await enhancedMap.sysEnhancedMapGetTest(slot, key2);
    expect(value2).to.equal(value.toString());
  });

  it('replace key2(value2) by value3', async () => {
    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    tx = await enhancedMap.sysEnhancedMapReplaceTest(slot, key2, value3);

    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    value = await enhancedMap.sysEnhancedMapGetTest(slot, key2);
    expect(value3).to.equal(value.toString());
  });

  it('replace key1(value1) by value4', async () => {
    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    tx = await enhancedMap.sysEnhancedMapSetTest(slot, key1, value4);

    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    value = await enhancedMap.sysEnhancedMapGetTest(slot, key1);
    expect(value4).to.equal(value.toString());
  });

  it('delete key1', async () => {
    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    tx = await enhancedMap.sysEnhancedMapDelTest(slot, key1);

    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(1).to.equal(size.toNumber());

    value = await enhancedMap.sysEnhancedMapGetTest(slot, key1);
    expect(emptyBytes32).to.equal(value.toString());

    value = await enhancedMap.sysEnhancedMapGetTest(slot, key2);
    expect(value3).to.equal(value.toString());
  });

  it('delete key2', async () => {
    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(1).to.equal(size.toNumber());

    tx = await enhancedMap.sysEnhancedMapSetTest(slot, key2, emptyBytes32);

    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(0).to.equal(size.toNumber());

    value = await enhancedMap.sysEnhancedMapGetTest(slot, key2);
    expect(emptyBytes32).to.equal(value.toString());
  });

  it('add key3 and key4', async () => {
    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(0).to.equal(size.toNumber());

    tx = await enhancedMap.sysEnhancedMapSetTest(slot, key3, value3);

    tx = await enhancedMap.sysEnhancedMapSetTest(slot, key4, value4);

    size = await enhancedMap.sysEnhancedMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    tx = await enhancedMap.sysEnhancedMapSetTest(slot, key3, value4);

    value = await enhancedMap.sysEnhancedMapGetTest(slot, key3);
    expect(value4).to.equal(value.toString());
  });
});