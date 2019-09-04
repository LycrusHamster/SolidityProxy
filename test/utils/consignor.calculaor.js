const util = require('./util');

(function(){

    let abidata = '0x60fe47b100000000000000000000000000000000000000000000000000000000000003e8';
    let toContractAddress = '0xe570AED1424989DF69C1E55c462fADeB75E95890';
    let consignorPrivateKey = '0x447ec538a3341787bfaa7fc3e083666e9e86986383867440e8f9a397fa832afb';

    let result = util.consign(abidata,toContractAddress,consignorPrivateKey);
    console.log(result)
})();