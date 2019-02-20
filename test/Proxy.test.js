// it's a little bit annoying to do function test, so we do them together as whole mixed test

let Proxy = artifacts.require('./Proxy.sol');
let LogicOld = artifacts.require('./LogicOld.sol');
let LogicNew = artifacts.require('./LogicNew.sol');



contract('proxy ', async (accounts) => {

  let proxy;
  let logicOld;
  let proxyFacadeOld;
  let logicNew;
  let proxyFacadeNew;

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
    proxy = await Proxy.new(adminAddress, FROM_DEPLOYER);
    logicOld = await LogicOld.new(FROM_DEPLOYER);
    logicNew = await LogicNew.new(FROM_DEPLOYER);

    proxyFacadeOld = await LogicOld.at(proxy.address);
    proxyFacadeNew = await LogicNew.at(proxy.address);

    console.log('proxy address :                          ' + proxy.address);
    console.log('logicOld address :                       ' + logicOld.address);
    console.log('logicNew address :                       ' + logicNew.address);
    console.log('proxyFacadeOld address :                 ' + proxyFacadeOld.address);
    console.log('proxyFacadeNew address :                 ' + proxyFacadeNew.address);
  });

  it('set proxy to logicOld', async () => {
    tx = await proxy.sysAddDelegate(logicOld.address, FROM_ADMIN);
  });

  it('proxyFacadeOld event1', async () => {

    tx = await proxyFacadeOld.emitEvent1(fakeAddress[1],1024,'0xff55ff5500000000000000000000000000000000000000000000000000000000', FROM_DEPLOYER);
    let Event1logs = tx.logs.filter(e => e.event === 'Event1');
    expect(Event1logs.length).to.equal(1);
    expect(Event1logs[0].args.addr.toLowerCase()).to.equal(fakeAddress[1]);
    expect(Event1logs[0].args.num.toNumber()).to.equal(1024);
    expect(Event1logs[0].args.b32).to.equal('0xff55ff5500000000000000000000000000000000000000000000000000000000');
    expect(Event1logs[0].args.emitter).to.equal(proxy.address);
  });

  it('proxyFacadeOld setSalary & getSalary', async () => {

    tx = await proxyFacadeOld.setSalary(fakeAddress[1],1314, FROM_DEPLOYER);
    let fakeAddress1Salary = (await proxyFacadeOld.getSalary(fakeAddress[1], FROM_DEPLOYER)).toNumber();
    expect(fakeAddress1Salary).to.equal(1314);
  });

  it('proxyFacadeOld fallback(nonpayable)', async () => {

    tx = await proxyFacadeOld.send(0, FROM_DEPLOYER);
    let Event1logs = tx.logs.filter(e => e.event === 'Event2');
    expect(Event1logs.length).to.equal(1);
    expect(Event1logs[0].args.addr.toLowerCase()).to.equal(proxy.address.toLowerCase());
    expect(Event1logs[0].args.num.toNumber()).to.equal(1234);
    expect(Event1logs[0].args.b32).to.equal('0x4321000000000000000000000000000000000000000000000000000000000000');
    expect(Event1logs[0].args.emitter.toLowerCase()).to.equal(proxy.address.toLowerCase());

    let flag = false;
    try{
      tx = await proxyFacadeOld.send(1, FROM_DEPLOYER);
    }catch (e) {
      flag = true;
    }
    expect(flag).to.equal(true);
  });

  it('change proxy to logicNew', async () => {
    tx = await proxy.sysDelDelegate(logicOld.address, FROM_ADMIN);
    tx = await proxy.sysAddDelegate(logicNew.address, FROM_ADMIN);
  });

  it('proxyFacadeNew event4', async () => {

    tx = await proxyFacadeNew.emitEvent4(fakeAddress[2],1024,'0xff55ff5500000000000000000000000000000000000000000000000000000001', FROM_DEPLOYER);
    let Event1logs = tx.logs.filter(e => e.event === 'Event4');
    expect(Event1logs.length).to.equal(1);
    expect(Event1logs[0].args.addr.toLowerCase()).to.equal(fakeAddress[2]);
    expect(Event1logs[0].args.num.toNumber()).to.equal(1024);
    expect(Event1logs[0].args.b32).to.equal('0xff55ff5500000000000000000000000000000000000000000000000000000001');
    expect(Event1logs[0].args.emitter).to.equal(proxy.address);
  });

  it('proxyFacadeNew getSalary', async () => {

    let fakeAddress1Salary = (await proxyFacadeNew.getSalary(fakeAddress[1], FROM_DEPLOYER)).toNumber();
    expect(fakeAddress1Salary).to.equal(1314);
  });

  it('proxyFacadeNew setSalary & getSalary', async () => {

    //the setSalary of LogicNew will bribe your another 1000
    tx = await proxyFacadeNew.setSalary(fakeAddress[1],520, FROM_DEPLOYER);
    let fakeAddress1Salary = (await proxyFacadeNew.getSalary(fakeAddress[1], FROM_DEPLOYER)).toNumber();
    expect(fakeAddress1Salary).to.equal(1520);
  });

  it('proxyFacadeNew fallback(payable)', async () => {

    tx = await proxyFacadeNew.send(1, FROM_DEPLOYER);
    let Event1logs = tx.logs.filter(e => e.event === 'Event5');
    expect(Event1logs.length).to.equal(1);
    expect(Event1logs[0].args.addr.toLowerCase()).to.equal(proxy.address.toLowerCase());
    expect(Event1logs[0].args.num.toNumber()).to.equal(1234);
    expect(Event1logs[0].args.b32).to.equal('0x4321000000000000000000000000000000000000000000000000000000000000');
    expect(Event1logs[0].args.emitter.toLowerCase()).to.equal(proxy.address.toLowerCase());

  });

  it('add logicOld to proxy', async () => {
    tx = await proxy.sysAddDelegate(logicOld.address, FROM_ADMIN);
    console.log('priority : new > old')
  });

  it('proxyFacadeOld setSalary & getSalary, but the function will be delegate to proxyFacadeNew', async () => {
    let fakeAddress1Salary = (await proxyFacadeOld.getSalary(fakeAddress[1], FROM_DEPLOYER)).toNumber();
    expect(fakeAddress1Salary).to.equal(1520);

    //the setSalary of LogicNew will bribe your another 1000
    tx = await proxyFacadeOld.setSalary(fakeAddress[1],998, FROM_DEPLOYER);
    fakeAddress1Salary = (await proxyFacadeOld.getSalary(fakeAddress[1], FROM_DEPLOYER)).toNumber();
    expect(fakeAddress1Salary).to.equal(1998);
  });

  it('proxyFacadeNew setEnrollment & getEnrollment', async () => {

    let enrollment;
    //the setSalary of LogicNew will bribe your another 1000
    tx = await proxyFacadeNew.setEnrollment(fakeAddress[2],true, FROM_DEPLOYER);
    enrollment = await proxyFacadeNew.getEnrollment(fakeAddress[2]);
    expect(enrollment).to.equal(true);

  });

  it('proxyFacadeOld event1', async () => {

    tx = await proxyFacadeOld.emitEvent1(fakeAddress[4],1024,'0xff55ff5500000000000000000000000000000000000000000000000000000000', FROM_DEPLOYER);
    let Event1logs = tx.logs.filter(e => e.event === 'Event1');
    expect(Event1logs.length).to.equal(1);
    expect(Event1logs[0].args.addr.toLowerCase()).to.equal(fakeAddress[4]);
    expect(Event1logs[0].args.num.toNumber()).to.equal(1024);
    expect(Event1logs[0].args.b32).to.equal('0xff55ff5500000000000000000000000000000000000000000000000000000000');
    expect(Event1logs[0].args.emitter).to.equal(proxy.address);
  });

  it('proxyFacadeNew event4', async () => {

    tx = await proxyFacadeNew.emitEvent4(fakeAddress[5],1024,'0xff55ff5500000000000000000000000000000000000000000000000000000001', FROM_DEPLOYER);
    let Event1logs = tx.logs.filter(e => e.event === 'Event4');
    expect(Event1logs.length).to.equal(1);
    expect(Event1logs[0].args.addr.toLowerCase()).to.equal(fakeAddress[5]);
    expect(Event1logs[0].args.num.toNumber()).to.equal(1024);
    expect(Event1logs[0].args.b32).to.equal('0xff55ff5500000000000000000000000000000000000000000000000000000001');
    expect(Event1logs[0].args.emitter).to.equal(proxy.address);
  });

  it('proxyFacadeNew fallback(payable), cause new > old', async () => {

    tx = await proxyFacadeNew.send(4, FROM_DEPLOYER);
    let Event1logs = tx.logs.filter(e => e.event === 'Event5');
    expect(Event1logs.length).to.equal(1);
    expect(Event1logs[0].args.addr.toLowerCase()).to.equal(proxy.address.toLowerCase());
    expect(Event1logs[0].args.num.toNumber()).to.equal(1234);
    expect(Event1logs[0].args.b32).to.equal('0x4321000000000000000000000000000000000000000000000000000000000000');
    expect(Event1logs[0].args.emitter.toLowerCase()).to.equal(proxy.address.toLowerCase());

  });

  it('specify fallback to LogicOld', async () => {

    tx = await proxy.sysSetDelegateFallback(logicOld.address, FROM_ADMIN);
    let fallbackAddress = await proxy.sysGetDelegateFallback(FROM_ADMIN);
    expect(fallbackAddress.toLowerCase()).to.equal(logicOld.address.toLowerCase());
  });

  it('proxyFacadeOld fallback(nonpayable)', async () => {

    tx = await proxyFacadeOld.send(0, FROM_DEPLOYER);
    let Event1logs = tx.logs.filter(e => e.event === 'Event2');
    expect(Event1logs.length).to.equal(1);
    expect(Event1logs[0].args.addr.toLowerCase()).to.equal(proxy.address.toLowerCase());
    expect(Event1logs[0].args.num.toNumber()).to.equal(1234);
    expect(Event1logs[0].args.b32).to.equal('0x4321000000000000000000000000000000000000000000000000000000000000');
    expect(Event1logs[0].args.emitter.toLowerCase()).to.equal(proxy.address.toLowerCase());

    let flag = false;
    try{
      tx = await proxyFacadeOld.send(1, FROM_DEPLOYER);
    }catch (e) {
      flag = true;
    }
    expect(flag).to.equal(true);
  });

});


