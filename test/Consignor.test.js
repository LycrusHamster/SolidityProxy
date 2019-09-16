const util = require('./utils/util.js');

const ConsignorLogic = artifacts.require('./ConsignorLogic.sol');
const ConsignorStorage = artifacts.require('./ConsignorStorage.sol');

const ethereumjs = require('ethereumjs-util');

contract('ConsignorTest', async (accounts) => {

  let consignorLogic;
  let consignorStorage;
  let consignorContract;
  let consignor;

  const emptyBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const emptyAddress = '0x0000000000000000000000000000000000000000';

  const testBytes32 = '0x1100000000000000000000000000000000000000000000000000000000000011';
  const testAddress = '0x0000000000000000000000000000000000001111';
  const testUint256 = '0x1100000000000000000000000000000000000000000000000000000000111111'; //'7689318425915528602346510723233181380881209919202693705745230188025482383633'
  const testUint256_decimal = '7689318425915528602346510723233181380881209919202693705745230188025482383633';

  const testUint256_2 = '0x2200000000000000000000000000000000000000000000000000000000111111';
  const testUint256_2_decimal = '15378636851831057204693021446466362761762419838405387411490460376050963648785';

  const testBytes = '0x12344321';
  const testFixedAddress = '0x0000000000000000000000000000000000004444';
  const testFixedUint256 = '0x0000000000000000000000000000000000000000000000000000000000004444';

  const revertSig = '0x08c379a000000000000000000000000000000000000000000000000000000000';

  const consignorMark = '0x7e4f3c4fbc4d7bfb49012d8288defc0717f3e8b2de6308d424ff0c1353793bc9';

  let tx;
  let res;
  let abi;

  let delegateIndex;
  let delegate;

  const deployerAddress = accounts[0];
  const FROM_DEPLOYER = {from: deployerAddress};

  const consignorAddress = accounts[1];
  const consignorsAddress = [accounts[1],accounts[2],accounts[3]];
  before('setup', async () => {
    consignorLogic = await ConsignorLogic.new(FROM_DEPLOYER);
    consignorStorage = await ConsignorStorage.new(FROM_DEPLOYER);
    tx = await consignorStorage.sysAddDelegates([consignorLogic.address]);
    consignor = await ConsignorLogic.at(consignorStorage.address);
  });

  it('testConsignorFunction', async () => {

    consignorContract = new web3.eth.Contract(consignorLogic.abi);

    let calldata = consignorContract.methods.testConsignorFunction(testAddress, testBytes32, testUint256, [testUint256, testUint256_2]).encodeABI();

    //now add consignor, targetContractAddress, mark, and then sign it
    let data = util.preConsign(calldata,web3.utils.randomHex(32), consignorStorage.address);
    data = util.consign(data, ['0xa19c6fbea46424b76d1a3706ff99a9b819d10e474f4b79ce3b60040ebf7f0908']);
    console.log('data : ' + data.slice(2));

    tx = await web3.eth.call(
      {
        from: deployerAddress,
        to: consignorStorage.address,
        data: data
      }
    );
    console.log('tx : ' + tx.slice(2));
    abi = consignorLogic.abi.filter(abi => abi.name === 'testConsignorFunction')[0];
    let output = web3.eth.abi.decodeParameters(abi.outputs, tx);
    console.log(output);

    expect(output.THIS).to.equal(consignorStorage.address);
    expect(output.msgsender).to.equal(deployerAddress);
    expect(output.consignor).to.equal(consignorAddress);
    expect(output.c).to.equal(testUint256_decimal);
  });

  it('testConsignorsFunction', async () => {

    consignorContract = new web3.eth.Contract(consignorLogic.abi);

    let calldata = consignorContract.methods.testConsignorsFunction(testAddress, testBytes32, testUint256, [testUint256, testUint256_2]).encodeABI();

    //now add consignor, targetContractAddress, mark, and then sign it
    let data = util.preConsign(calldata,web3.utils.randomHex(32), consignorStorage.address);
    data = util.consign(data, ['0xa19c6fbea46424b76d1a3706ff99a9b819d10e474f4b79ce3b60040ebf7f0908',
    '0xc2e06ef4e7efd653a1452dccc9c141d39017ebea5916d493c90cc843f937c98d',
    '0xac85771fdbccf98a8fcfc2826f32ad7b20d98acbcc2446dd9d9ba403685225b2']);
    console.log('data : ' + data.slice(2));

    tx = await web3.eth.call(
      {
        from: deployerAddress,
        to: consignorStorage.address,
        data: data
      }
    );
    console.log('tx : ' + tx.slice(2));
    abi = consignorLogic.abi.filter(abi => abi.name === 'testConsignorsFunction')[0];
    let output = web3.eth.abi.decodeParameters(abi.outputs, tx);
    console.log(output);

    expect(output.THIS).to.equal(consignorStorage.address);
    expect(output.msgsender).to.equal(deployerAddress);
    expect(output.consignors[0]).to.equal(consignorsAddress[2]);
    expect(output.consignors[1]).to.equal(consignorsAddress[1]);
    expect(output.consignors[2]).to.equal(consignorsAddress[0]);
    expect(output.c).to.equal(testUint256_decimal);
  });

  it('testConsignorsLiteFunction by consign', async () => {

    consignorContract = new web3.eth.Contract(consignorLogic.abi);

    let calldata = consignorContract.methods.testConsignorsLiteFunction().encodeABI();

    //now add consignor, targetContractAddress, mark, and then sign it
    let data = util.preConsign(calldata,web3.utils.randomHex(32), consignorStorage.address);
    data = util.consign(data, ['0xa19c6fbea46424b76d1a3706ff99a9b819d10e474f4b79ce3b60040ebf7f0908',
      '0xc2e06ef4e7efd653a1452dccc9c141d39017ebea5916d493c90cc843f937c98d',
      '0xac85771fdbccf98a8fcfc2826f32ad7b20d98acbcc2446dd9d9ba403685225b2']);
    console.log('data : ' + data.slice(2));

    tx = await web3.eth.call(
      {
        from: deployerAddress,
        to: consignorStorage.address,
        data: data
      }
    );
    console.log('tx : ' + tx.slice(2));
    abi = consignorLogic.abi.filter(abi => abi.name === 'testConsignorsLiteFunction')[0];
    let output = web3.eth.abi.decodeParameters(abi.outputs, tx);
    console.log(output);


    expect(output.consignors[0]).to.equal(consignorsAddress[2]);
    expect(output.consignors[1]).to.equal(consignorsAddress[1]);
    expect(output.consignors[2]).to.equal(consignorsAddress[0]);
    expect(output.consignor).to.equal(consignorsAddress[2]);
  });

  it('testConsignorsLiteFunction by direct', async () => {

    tx = await consignor.testConsignorsLiteFunction( {from: deployerAddress});

    expect(tx.consignor).to.equal(deployerAddress);
    expect(tx.consignors.length).to.equal(1);
    expect(tx.consignors[0]).to.equal(deployerAddress);
  });

  it('testDirectFunction', async () => {
    tx = await consignor.testDirectFunction(testAddress, testBytes32, testUint256, [testUint256, testUint256_2], {from: deployerAddress});

    expect(tx.msgsender).to.equal(deployerAddress);
    expect(tx.c.toString('hex')).to.equal(testUint256.substring(2));
  });
});

/*
const consign = function (calldata, toContractAddress, consignorPrivateKey) {

    const consignorMark = '7e4f3c4fbc4d7bfb49012d8288defc0717f3e8b2de6308d424ff0c1353793bc9';

    consignorPrivateKey = Buffer.from(consignorPrivateKey.substring(2), 'hex');
    let consignorAddr = ethereumjs.privateToAddress(consignorPrivateKey);
    consignorAddr = consignorAddr.toString('hex');

    calldata = calldata + web3.utils.padLeft(consignorAddr, 64);
    calldata = calldata + web3.utils.padLeft(toContractAddress.slice(2), 64);
    calldata = calldata + web3.utils.padLeft(consignorMark, 64);

    console.log("calldata inside : " + calldata.substring(2));

    let hash2 = web3.utils.keccak256(calldata);

    console.log("hash2 : " + hash2.substring(2));

    let ecsig = ethereumjs.ecsign(Buffer.from(hash2.substring(2), 'hex'), consignorPrivateKey);
    let sig = ecsig.r.toString('hex') + ecsig.s.toString('hex') + ecsig.v.toString('16')

    calldata = calldata + sig;
    return calldata;
};*/