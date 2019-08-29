const ConsignorLogic = artifacts.require('./ConsignorLogic.sol');
const ConsignorStorage = artifacts.require('./ConsignorStorage.sol');

const ethereumjs = require('ethereumjs-util');

contract('ChainCallTest', async (accounts) => {

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

    let delegateIndex;
    let delegate;

    const deployerAddress = accounts[0];
    const FROM_DEPLOYER = {from: deployerAddress};

    const consignorAddress = accounts[1];

    before('setup', async () => {
        consignorLogic = await ConsignorLogic.new(FROM_DEPLOYER);
        consignorStorage = await ConsignorStorage.new(FROM_DEPLOYER);
        tx = await consignorStorage.sysAddDelegates([consignorLogic.address]);
        consignor = await ConsignorLogic.at(consignorStorage.address);
    });

    it('testFunction with consignor', async () => {

        consignorContract = new web3.eth.Contract(consignorLogic.abi);

        let calldata = consignorContract.methods.testFunction(testAddress, testBytes32, testUint256, [testUint256, testUint256_2]).encodeABI();

        //now add consignor, targetContractAddress, mark, and then sign it

        console.log("consignor : " + consignorAddress.slice(2));
        calldata = calldata + web3.utils.padLeft(consignorAddress.slice(2), 64);

        console.log("target : " + consignorStorage.address.slice(2));
        calldata = calldata + web3.utils.padLeft(consignorStorage.address.slice(2), 64);
        calldata = calldata + web3.utils.padLeft(consignorMark.slice(2), 64);

        console.log("calldata : " + calldata.slice(2));

        let hash = web3.utils.keccak256(calldata);
        console.log("hash : " + hash.slice(2));
        /*let sig = await web3.eth.sign(hash, consignorAddress);

        let v = sig.slice(130);
        if(v === '00'){
            v = '1b'
        }
        if(v === '01'){
            v = '1c'
        }
        sig = sig.slice(0,130) + v;

        console.log("sig : " + sig.slice(2));*/

        let ecsig = ethereumjs.ecsign(Buffer.from(hash.substring(2), 'hex'), Buffer.from('a19c6fbea46424b76d1a3706ff99a9b819d10e474f4b79ce3b60040ebf7f0908', 'hex'));
        let sig2 = ecsig.r.toString('hex') + ecsig.s.toString('hex') + ecsig.v.toString('16')
        console.log("sig2 : " + sig2);


        let data = calldata + sig2;

        console.log("data : " + data.slice(2));

        tx = await web3.eth.call(
            {
                from: deployerAddress,
                to: consignorStorage.address,
                data: data
            }
        );
        console.log("tx : " + tx.slice(2));
        let output = web3.eth.abi.decodeParameters(consignorLogic.abi[2].outputs, tx);
        console.log(output);

        expect(output.target).to.equal(consignorStorage.address);
        expect(output.msgsender).to.equal(deployerAddress);
        expect(output.consignor).to.equal(consignorAddress);
        expect(output.c).to.equal(testUint256_decimal);
    });

    it('testFunction2 with consignor', async () => {
        tx = await consignor.testFunction2(testAddress, testBytes32, testUint256, [testUint256, testUint256_2],{from: deployerAddress});

        expect(tx.msgsender).to.equal(deployerAddress);
        expect(tx.c.toString('hex')).to.equal(testUint256.substring(2));
    });
});