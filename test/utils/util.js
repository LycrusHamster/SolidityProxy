const ethereumjs = require('ethereumjs-util');
const web3 = require('web3');
const consignorMark = '7e4f3c4fbc4d7bfb49012d8288defc0717f3e8b2de6308d424ff0c1353793bc9';

/*
    calldata: contract.methods.functionName().encodeABI()
    calldata: 0x-hex
    uuid: 0x-hex
    toContractAddress: 0x-hex
    return: 0x-hex
 */
const preConsign = function (calldata, uuid, toContractAddress) {
  calldata = calldata + web3.utils.padLeft(uuid.slice(2), 64);
  calldata = calldata + web3.utils.padLeft(toContractAddress.slice(2), 64);
  return calldata;
};

/*
    calldata: contract.methods.functionName().encodeABI()
    calldata: 0x-hex
    consignorsPrivateKey: 0x-hex, the sign sequence is the array sequence
    return: 0x-hex
 */
const consign = function (calldata, consignorPrivateKeys) {
  const consignorMark = '7e4f3c4fbc4d7bfb49012d8288defc0717f3e8b2de6308d424ff0c1353793bc9';
  for (let i = 0; i < consignorPrivateKeys.length; i++) {
    let consignorPrivateKey = consignorPrivateKeys[i];

    consignorPrivateKey = Buffer.from(consignorPrivateKey.substring(2), 'hex');
    let consignorAddr = ethereumjs.privateToAddress(consignorPrivateKey);
    consignorAddr = consignorAddr.toString('hex');

    calldata = calldata + web3.utils.padLeft(consignorMark, 64);
    calldata = calldata + web3.utils.padLeft(consignorAddr, 64);

    let hash2 = web3.utils.keccak256(calldata);
    console.log("hash : " + hash2.substring(2));
    let ecsig = ethereumjs.ecsign(Buffer.from(hash2.substring(2), 'hex'), consignorPrivateKey);
    let sig = ecsig.r.toString('hex') + ecsig.s.toString('hex') + ecsig.v.toString('16');
    console.log("sig : " + sig);
    calldata = calldata + sig;
  }

  return calldata;
};

module.exports = {
  consign: consign,
  preConsign: preConsign,
};