const EnhancedUniqueIndexMapTest = artifacts.require('./EnhancedUniqueIndexMapTest.sol');

contract('EnhancedUniqueIndexMapTest ', async (accounts) => {

  let enhancedUniqueIndexMap;
  const slotName = web3.utils.toHex('testSlot');
  let slot;
  const emptyBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

  let tx;
  let size;
  let index;
  let value;

  const value1 = '0x1111111111111111111111111111111111111111111111111111111111111111';
  const value2 = '0x2222222222222222222222222222222222222222222222222222222222222222';
  const value3 = '0x3333333333333333333333333333333333333333333333333333333333333333';
  const value4 = '0x4444444444444444444444444444444444444444444444444444444444444444';

  const deployerAddress = accounts[0];
  const FROM_DEPLOYER = {from: deployerAddress};

  before('setup', async () => {
    enhancedUniqueIndexMap = await EnhancedUniqueIndexMapTest.new(FROM_DEPLOYER);
    slot = await enhancedUniqueIndexMap.sysCalcSlot(slotName, FROM_DEPLOYER);

  });

  //  1
  // v1
  it('add value1', async () => {
    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(0).to.equal(size.toNumber());

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapAddTest(slot, value1);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(1).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value1);
    expect(1).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value1).to.equal(value.toString(16));
  });

  //  1   2
  // v1  v2
  it('add value2', async () => {
    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapAddTest(slot, value2);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value2);
    expect(2).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value2).to.equal(value.toString(16));

  });

  //  1   2   3
  // v1  v2  v3
  it('add value3', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapAddTest(slot, value3);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(3).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value3);
    expect(3).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value3).to.equal(value.toString(16));

  });

  //  1   2
  // v1  v2
  it('delete value3', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapDelTest(slot, value3);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value3);
    expect(0).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, '2');
    expect(value2).to.equal(value.toString(16));

  });

  //  1
  // v2
  it('delete value1', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapDelTest(slot, value1);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(1).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value1);
    expect(0).to.equal(index.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value2);
    expect(1).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, '1');
    expect(value2).to.equal(value.toString(16));
  });

  //  1   2
  // v2  v4
  it('add value4', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapAddTest(slot, value4);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(2).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value4).to.equal(value.toString(16));

  });

  //  1   2
  // v2  v1
  it('replace value4 by value1', async () => {

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(2).to.equal(index.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value1);
    expect(0).to.equal(index.toNumber());

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapReplaceTest(slot, value4, value1);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(0).to.equal(index.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value1);
    expect(2).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value1).to.equal(value.toString(16));

  });

  //  1   2   3   4
  // v2  v1  v3  v4
  it('add value3 & value4', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapAddTest(slot, value3);
    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapAddTest(slot, value4);


    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(4).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value3);
    expect(3).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value3).to.equal(value.toString(16));

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(4).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value4).to.equal(value.toString(16));

  });

  //  1   2   3
  // v2  v4  v3
  it('delete value1', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapDelTest(slot, value1);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(3).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value2);
    expect(1).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value2).to.equal(value.toString(16));

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(2).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value4).to.equal(value.toString(16));

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value3);
    expect(3).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value3).to.equal(value.toString(16));
  });

  //  1   2   3   4
  // v2  v4  v3  v1
  it('add value1', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapAddTest(slot, value1);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(4).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value2);
    expect(1).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value2).to.equal(value.toString(16));

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(2).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value4).to.equal(value.toString(16));

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value3);
    expect(3).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value3).to.equal(value.toString(16));

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value1);
    expect(4).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value1).to.equal(value.toString(16));
  });

  //  1   2   3
  // v4  v3  v1
  it('delete value2 arrange', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapDelArrangeTest(slot, value2);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(3).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(1).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value4).to.equal(value.toString(16));

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value3);
    expect(2).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value3).to.equal(value.toString(16));

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value1);
    expect(3).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value1).to.equal(value.toString(16));
  });

  //  1   2
  // v4  v1
  it('delete value3 arrange', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapDelArrangeTest(slot, value3);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(2).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(1).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value4).to.equal(value.toString(16));

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value1);
    expect(2).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value1).to.equal(value.toString(16));

  });

  //  1
  // v4
  it('delete value1 arrange', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapDelArrangeTest(slot, value1);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(1).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(1).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(value4).to.equal(value.toString(16));
  });

  //  1
  // v4
  it('delete value4 arrange', async () => {

    tx = await enhancedUniqueIndexMap.sysUniqueIndexMapDelArrangeTest(slot, value4);

    size = await enhancedUniqueIndexMap.sysUniqueIndexMapSizeTest(slot);
    expect(0).to.equal(size.toNumber());

    index = await enhancedUniqueIndexMap.sysUniqueIndexMapGetIndexTest(slot, value4);
    expect(0).to.equal(index.toNumber());

    value = await enhancedUniqueIndexMap.sysUniqueIndexMapGetValueTest(slot, index.toNumber());
    expect(emptyBytes32).to.equal(value.toString(16));
  });
});