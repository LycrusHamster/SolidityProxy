pragma solidity ^0.5.11;

import "./Base.sol";
import "./StringAppend.sol";

/*
For solidity, if you don't add modifier payable, compiler will add a piece of assembly code to make sure the
transaction or internal transaction get 0 value and will prevent use msg.value.

For named-function(which means all function except the sysSaveSlotData function), solidity generate perfect code.

However, if a proxy forward a
*/
contract Delegate is Base {

    using StringAppend for *;

    event ResetParamSuccessful();

    constructor () public {

    }

    //Note that nonpayable is a term opposite to payable in solidity and solc
    //nonPayable with big letter P is a modifier in this framework
    //delegateCall will keep msg.sender and msg.value
    //function sig : 44409a82e623ed8da60bc4cd88253f204a87ae1a7e8937c1a0f9ec92fa753c71
    //function(), the fallback function, doesn't allow args and returns, and is nonpayable
    //but you can access calldata and set returndata by assembly by yourself :)
    //without modifier 'payable', you can't refer msg.value in public and external.that's a compiler protection;
    //but you can use msg.value freely in internal function
    //or you can access msg.value by assembly by yourself too :)
    //because defaultFallback is only called by function(), which is fallback, so it is payable.
    //thus if you want to reject receiving ETH, just add 'nonPayable' by overriding it, DO NOT MODIFY code here
    function defaultFallback() /*nonPayable*/ internal {
        returnAsm(false, notFoundMark);
    }

    function() payable external {
        //target function doesn't hit normal functions
        defaultFallback();
    }

    //mix mode
    //get the only msgSender, msg.sender for direct mode, the only one consignor for consignor mode
    //revert while finding more the one consignor in consignor mode
    //this likes getMsgSenders(1), but returns address instead of address[]
    function getMsgSender() internal view returns (address){
        address[] memory consignors = getConsignors();

        if (consignors.length == 1) {
            return getConsignors()[0];
        } else if (consignors.length == 0) {
            return msg.sender;
        }
        revert("getMsgSender, finds more than one consignors : ".appendUint256(consignors.length));
    }

    //mix mode
    //expect set 0 for expect all cases
    function getMsgSenders(uint256 expected) internal view returns (address[] memory){
        address[] memory consignors = getConsignors();
        if (consignors.length > 0) {

            if (expected != 0 && consignors.length != expected) {
                revert(
                    "getMsgSenders, MsgSenders : "
                    .appendUint256(consignors.length)
                    .appendString(" , not as expected : ")
                    .appendUint256(expected));
            }

            return consignors;
        }

        //native msg.sender is counted as one MsgSender
        if (expected != 0 && expected != 1) {
            revert("getMsgSenders, MsgSenders found native msg.sender but expected is : ".appendUint256(expected));
        }
        address[] memory ret = new address[](1);
        ret[0] = msg.sender;
        return ret;
    }


    //this returns consignors number, 0 for not consignorMode
    function isConsignorMode() internal pure returns (uint256 consignors){
        uint256 markNumber = 0;
        uint256 envelope = msg.data.length;
        while (envelope >= 193) {
            envelope = envelope - 129;
            if (checkConsignorMark != toBytes32(msg.data, envelope)) {
                break;
            }
            /*
                        //escape check consignor's sig because we have already done this in Proxy
                        //well, if you bypass Proxy and manipulate a calldata to hack, that violates the usage, but won't do harm to the system cause the Delegate doesn't care its storage
                        r = toBytes32(msg.data, envelope + 64);
                        s = toBytes32(msg.data, envelope + 96);
                        v = toUint8(msg.data, envelope + 97);
                        hash = keccak256(slice(msg.data, 0, envelope));
                        if (toAddressFromBytes32(msg.data, envelope + 32) != ecrecover(hash, v, r, s)) {
                            return (true, 0, true);
                        }
            */
            markNumber ++;
        }

        return markNumber;
    }

    //only consign mode
    //this get all consignors, 0 for not consignorMode
    //the returns address[] of consign is in signing sequence
    //e.g.  A signs first, B signs later, C signs last
    //e.g. the address[0] = A, address[1] = B, address[2] = C
    function getConsignors() internal pure returns (address[] memory){
        uint256 consignorNumbers = isConsignorMode();
        if (consignorNumbers == 0) {
            return new address[](0);
        }

        address[] memory consignors = new address[](consignorNumbers);

        uint256 envelope = msg.data.length;
        for (uint256 i = 0; i < consignorNumbers; i++) {
            envelope = envelope - 129;

            consignors[consignorNumbers - 1 - i] = toAddressFromBytes32(msg.data, envelope + 32);
        }
        return consignors;
    }

    //only original mode
    function getOriginalMsgSender() internal view returns (address){
        uint256 consignorNumbers = isConsignorMode();
        if (consignorNumbers != 0) {
            revert("getOriginalMsgSender, isConsignorMode() found consignors but expected only msg.sender");
        }
        return msg.sender;
    }

    modifier inConsignorMode(){
        require(isConsignorMode() > 0, "not in consignor mode");
        _;
    }

    modifier inWalkThroughMode(){
        require(isConsignorMode() == 0, "not in walk through mode");
        _;
    }

    modifier resetParamNotifier(){
        _;
        emit ResetParamSuccessful();
    }

    /*function() payable external {
        //target function doesn't hit normal functions
        //check if it's sig is 0x00000000 to call sysSaveSlotData
        if (msg.sig == bytes4(0x00000000)) {
            defaultFallback();
        } else {
            //if goes here, the target function must not be found;
            returnAsm(false, notFoundMark);
        }
    }*/
}
