pragma solidity ^0.5.7;

import "./Base.sol";
import "./EnhancedMap.sol";
import "./EnhancedUniqueIndexMap.sol";

contract Proxy is Base, EnhancedMap, EnhancedUniqueIndexMap {
    constructor (address admin) public {
        sysSaveSlotData(adminSlot, bytes32(uint256(admin)));
        sysSaveSlotData(userSigZeroSlot, bytes32(uint256(0)));
        sysSaveSlotData(outOfServiceSlot, bytes32(uint256(0)));
        sysSaveSlotData(revertMessageSlot, bytes32(uint256(1)));
        //sysSetDelegateFallback(address(0));
    }

    bytes32 constant adminSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("adminSlot"))))));

    bytes32 constant revertMessageSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("revertMessageSlot"))))));

    bytes32 constant outOfServiceSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("outOfServiceSlot"))))));

    //address <===>  index EnhancedUniqueIndexMap
    //0x2f80e9a12a11b80d2130b8e7dfc3bb1a6c04d0d87cc5c7ea711d9a261a1e0764
    bytes32 constant delegatesSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("delegatesSlot"))))));

    //bytes4 abi ===> address, both not 0x00
    //0xba67a9e2b7b43c3c9db634d1c7bcdd060aa7869f4601d292a20f2eedaf0c2b1c
    bytes32 constant userAbiSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("userAbiSlot"))))));

    bytes32 constant userAbiSearchSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("userAbiSearchSlot"))))));

    //0xe2bb2e16cbb16a10fab839b4a5c3820d63a910f4ea675e7821846c4b2d3041dc
    bytes32 constant userSigZeroSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("userSigZeroSlot"))))));

    bytes32 constant uuidSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("uuidSlot"))))));

    event DelegateSet(address delegate, bool activated);
    event AbiSet(bytes4 abi, address delegate, bytes32 slot);
    event PrintBytes(bytes data);
    //===================================================================================

    function sysCountDelegate() public view returns (uint256){
        return sysUniqueIndexMapSize(delegatesSlot);
    }

    function sysGetDelegateAddress(uint256 index) public view returns (address){
        return address(uint256(sysUniqueIndexMapGetValue(delegatesSlot, index)));
    }

    function sysGetDelegateIndex(address addr) public view returns (uint256) {
        return uint256(sysUniqueIndexMapGetIndex(delegatesSlot, bytes32(uint256(addr))));
    }

    function sysGetDelegateAddresses() public view returns (address[] memory){
        uint256 count = sysCountDelegate();
        address[] memory delegates = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            delegates[i] = sysGetDelegateAddress(i + 1);
        }
        return delegates;
    }

    //add delegates on current version
    function sysAddDelegates(address[] memory _inputs) public onlyAdmin {
        for (uint256 i = 0; i < _inputs.length; i ++) {
            sysUniqueIndexMapAdd(delegatesSlot, bytes32(uint256(_inputs[i])));
            emit DelegateSet(_inputs[i], true);
        }
    }

    //delete delegates
    //be careful, if you delete a delegate, the index will change
    function sysDelDelegates(address[] memory _inputs) public onlyAdmin {
        for (uint256 i = 0; i < _inputs.length; i ++) {

            //travers all abis to delete those abis mapped to the given address
            uint256 j;
            uint256 k;
            /*bytes4[] memory toDeleteSelectors = new bytes4[](count + 1);
            uint256 pivot = 0;*/
            uint256 count = sysCountSelectors();

            /*for (j = 0; j < count; j ++) {
                bytes4 selector;
                address delegate;
                (selector, delegate) = sysGetUserSelectorAndDelegateByIndex(j + 1);
                if (delegate == _inputs[i]) {
                    toDeleteSelectors[pivot] = selector;
                    pivot++;
                }
            }
            pivot = 0;
            while (toDeleteSelectors[pivot] != bytes4(0x00)) {
                sysSetUserSelectorAndDelegate(toDeleteSelectors[pivot], address(0));
                pivot++;
            }*/
            k = 1;
            for (j = 0; j < count; j++) {
                bytes4 selector;
                address delegate;
                (selector, delegate) = sysGetSelectorAndDelegateByIndex(k);
                if (delegate == _inputs[i]) {
                    sysSetSelectorAndDelegate(selector, address(0));
                }
                else {
                    k++;
                }
            }

            if (sysGetSigZero() == _inputs[i]) {
                sysSetSigZero(address(0x00));
            }

            sysUniqueIndexMapDelArrange(delegatesSlot, bytes32(uint256(_inputs[i])));
            emit DelegateSet(_inputs[i], false);
        }
    }

    //add and delete delegates
    function sysReplaceDelegates(address[] memory _delegatesToDel, address[] memory _delegatesToAdd) public onlyAdmin {
        require(_delegatesToDel.length == _delegatesToAdd.length, "sysReplaceDelegates, length does not match");
        for (uint256 i = 0; i < _delegatesToDel.length; i ++) {
            sysUniqueIndexMapReplace(delegatesSlot, bytes32(uint256(_delegatesToDel[i])), bytes32(uint256(_delegatesToAdd[i])));
            emit DelegateSet(_delegatesToDel[i], false);
            emit DelegateSet(_delegatesToAdd[i], true);
        }
    }

    //=============================================

    function sysGetSigZero() public view returns (address){
        return address(uint256(sysLoadSlotData(userSigZeroSlot)));
    }

    function sysSetSigZero(address _input) public onlyAdmin {
        sysSaveSlotData(userSigZeroSlot, bytes32(uint256(_input)));
    }

    function sysGetAdmin() public view returns (address){
        return address(uint256(sysLoadSlotData(adminSlot)));
    }

    function sysSetAdmin(address _input) external onlyAdmin {
        sysSaveSlotData(adminSlot, bytes32(uint256(_input)));
    }

    function sysGetRevertMessage() public view returns (uint256){
        return uint256(sysLoadSlotData(revertMessageSlot));
    }

    function sysSetRevertMessage(uint256 _input) external onlyAdmin {
        sysSaveSlotData(revertMessageSlot, bytes32(_input));
    }

    function sysGetOutOfService() public view returns (uint256){
        return uint256(sysLoadSlotData(outOfServiceSlot));
    }

    function sysSetOutOfService(uint256 _input) external onlyAdmin {
        sysSaveSlotData(outOfServiceSlot, bytes32(_input));
    }

    //=============================================

    //abi and delegates should not be 0x00 in mapping;
    //set delegate to 0x00 for delete the entry
    function sysSetSelectorsAndDelegates(bytes4[] memory selectors, address[] memory delegates) public onlyAdmin {
        require(selectors.length == delegates.length, "sysSetUserSelectorsAndDelegates, length does not matchs");
        for (uint256 i = 0; i < selectors.length; i ++) {
            sysSetSelectorAndDelegate(selectors[i], delegates[i]);
        }
    }

    function sysSetSelectorAndDelegate(bytes4 selector, address delegate) public {

        require(selector != bytes4(0x00), "sysSetSelectorAndDelegate, selector should not be selector");
        //require(delegates[i] != address(0x00));
        address oldDelegate = address(uint256(sysEnhancedMapGet(userAbiSlot, bytes32(selector))));
        if (oldDelegate == delegate) {
            //if oldDelegate == 0 & delegate == 0
            //if oldDelegate == delegate != 0
            //do nothing here
        }
        if (oldDelegate == address(0x00)) {
            //delegate != 0
            //adding new value
            sysEnhancedMapAdd(userAbiSlot, bytes32(selector), bytes32(uint256(delegate)));
            sysUniqueIndexMapAdd(userAbiSearchSlot, bytes32(selector));
        }
        if (delegate == address(0x00)) {
            //oldDelegate != 0
            //deleting new value
            sysEnhancedMapDel(userAbiSlot, bytes32(selector));
            sysUniqueIndexMapDel(userAbiSearchSlot, bytes32(selector));

        } else {
            //oldDelegate != delegate & oldDelegate != 0 & delegate !=0
            //updating
            sysEnhancedMapReplace(userAbiSlot, bytes32(selector), bytes32(uint256(delegate)));
        }


    }

    function sysGetDelegateBySelector(bytes4 selector) public view returns (address){
        return address(uint256(sysEnhancedMapGet(userAbiSlot, bytes32(selector))));
    }

    function sysCountSelectors() public view returns (uint256){
        return sysEnhancedMapSize(userAbiSlot);
    }

    function sysGetSelector(uint256 index) public view returns (bytes4){
        bytes4 selector = bytes4(sysUniqueIndexMapGetValue(userAbiSearchSlot, index));
        return selector;
    }

    function sysGetSelectorAndDelegateByIndex(uint256 index) public view returns (bytes4, address){
        bytes4 selector = sysGetSelector(index);
        address delegate = sysGetDelegateBySelector(selector);
        return (selector, delegate);
    }

    function sysGetSelectorsAndDelegates() public view returns (bytes4[] memory selectors, address[] memory delegates){
        uint256 count = sysCountSelectors();
        selectors = new bytes4[](count);
        delegates = new address[](count);
        for (uint256 i = 0; i < count; i ++) {
            (selectors[i], delegates[i]) = sysGetSelectorAndDelegateByIndex(i + 1);
        }
    }

    function sysClearSelectorsAndDelegates() public {
        uint256 count = sysCountSelectors();
        for (uint256 i = 0; i < count; i ++) {
            bytes4 selector;
            address delegate;
            //always delete the first, after 'count' times, it will clear all
            (selector, delegate) = sysGetSelectorAndDelegateByIndex(1);
            sysSetSelectorAndDelegate(selector, address(0x00));
        }
    }

    //=====================internal functions=====================

    //since low-level address.delegateCall is available in solidity,
    //we don't need to write assembly
    function() payable external outOfService {

        /*
        do consignor check
        */
        (, bool error) = checkConsignors();
        if (error) {
            if (sysGetRevertMessage() == 1) {
                revert(string(abi.encodePacked("consignor mode fails : ", sysPrintBytesToHex(msg.data))));
            } else {
                revert();
            }
        }

        /*
        let us check if the callData enabled consignor.
        If yes, check the consignor rules and then pass/reject
        If not, just work through
        */

        /*
        the default transfer will set data to empty,
        so that the msg.data.length = 0 and msg.sig = bytes4(0x00000000),

        however some one can manually set msg.sig to 0x00000000 and tails more man-made data,
        so here we have to forward all msg.data to delegates
        */
        address targetDelegate;

        //for look-up table
        /*        if (msg.sig == bytes4(0x00000000)) {
                    targetDelegate = sysGetUserSigZero();
                    if (targetDelegate != address(0x00)) {
                        delegateCallExt(targetDelegate, msg.data);
                    }

                    targetDelegate = sysGetSystemSigZero();
                    if (targetDelegate != address(0x00)) {
                        delegateCallExt(targetDelegate, msg.data);
                    }
                } else {
                    targetDelegate = sysGetUserDelegate(msg.sig);
                    if (targetDelegate != address(0x00)) {
                        delegateCallExt(targetDelegate, msg.data);
                    }

                    //check system abi look-up table
                    targetDelegate = sysGetSystemDelegate(msg.sig);
                    if (targetDelegate != address(0x00)) {
                        delegateCallExt(targetDelegate, msg.data);
                    }
                }*/

        if (msg.sig == bytes4(0x00000000)) {
            targetDelegate = sysGetSigZero();
            if (targetDelegate != address(0x00)) {
                delegateCallExt(targetDelegate, msg.data);
            }
        } else {
            targetDelegate = sysGetDelegateBySelector(msg.sig);
            if (targetDelegate != address(0x00)) {
                delegateCallExt(targetDelegate, msg.data);
            }
        }

        //goes here means this abi is not in the system abi look-up table
        discover();

        //hit here means not found selector
        if (sysGetRevertMessage() == 1) {
            revert(string(abi.encodePacked("function selector not found : ", sysPrintBytes4ToHex(msg.sig))));
        } else {
            revert();
        }
    }

    function discover() internal {
        bool found = false;
        bool error;
        bytes memory returnData;
        address targetDelegate;
        uint256 len = sysCountDelegate();
        for (uint256 i = 0; i < len; i++) {
            targetDelegate = sysGetDelegateAddress(i + 1);
            (found, error, returnData) = redirect(targetDelegate, msg.data);
            if (found) {
                /*                if (msg.sig == bytes4(0x00000000)) {
                                    sysSetSystemSigZero(targetDelegate);
                                } else {
                                    sysSetSystemSelectorAndDelegate(msg.sig, targetDelegate);
                                }*/
                returnAsm(error, returnData);
            }
        }
    }

    function delegateCallExt(address targetDelegate, bytes memory callData) internal {
        bool found = false;
        bool error;
        bytes memory returnData;
        (found, error, returnData) = redirect(targetDelegate, callData);
        require(found, "delegateCallExt to a delegate in the map but finally not found, this shouldn't happen");
        returnAsm(error, returnData);
    }

    //since low-level ```<address>.delegatecall(bytes memory) returns (bool, bytes memory)``` can return returndata,
    //we use high-level solidity for better reading
    function redirect(address delegateTo, bytes memory callData) internal returns (bool found, bool error, bytes memory returnData){
        require(delegateTo != address(0), "delegateTo must not be 0x00");
        bool success;
        (success, returnData) = delegateTo.delegatecall(callData);
        if (success == true && keccak256(returnData) == keccak256(notFoundMark)) {
            //the delegate returns ```notFoundMark``` notFoundMark, which means invoke goes to wrong contract or function doesn't exist
            return (false, true, returnData);
        } else {
            return (true, !success, returnData);
        }
    }

    function sysPrintBytesToHex(bytes memory input) internal pure returns (string memory){
        bytes memory ret = new bytes(input.length * 2);
        bytes memory alphabet = "0123456789abcdef";
        for (uint256 i = 0; i < input.length; i++) {
            bytes32 t = bytes32(input[i]);
            bytes32 tt = t >> 31 * 8;
            uint256 b = uint256(tt);
            uint256 high = b / 0x10;
            uint256 low = b % 0x10;
            byte highAscii = alphabet[high];
            byte lowAscii = alphabet[low];
            ret[2 * i] = highAscii;
            ret[2 * i + 1] = lowAscii;
        }
        return string(ret);
    }

    function sysPrintAddressToHex(address input) internal pure returns (string memory){
        return sysPrintBytesToHex(
            abi.encodePacked(input)
        );
    }

    function sysPrintBytes4ToHex(bytes4 input) internal pure returns (string memory){
        return sysPrintBytesToHex(
            abi.encodePacked(input)
        );
    }

    function sysPrintUint256ToHex(uint256 input) internal pure returns (string memory){
        return sysPrintBytesToHex(
            abi.encodePacked(input)
        );
    }

    function sysPrintBytes32ToHex(bytes32 input) internal pure returns (string memory){
        return sysPrintBytesToHex(
            abi.encodePacked(input)
        );
    }

    modifier onlyAdmin(){
        require(msg.sender == sysGetAdmin(), "only admin");
        _;
    }

    modifier outOfService(){
        if (sysGetOutOfService() == uint256(1)) {
            if (sysGetRevertMessage() == 1) {
                revert(string(abi.encodePacked("Proxy is out-of-service right now")));
            } else {
                revert();
            }
        }
        _;
    }

    //this could be used in eth_call
    //BUT, CAN'T BE USED BY statical_call(normally is compiled by calling view function in contract)
    //MUST NOT ENABLE CONSIGNOR MODE IN CALLING VIEW FUNCTION
    //if Mark is enabled, the calldata should be in form:
    //[selector, [abi-encoded params]], uuid, target , [mark, consignor, sig-r-s-v]|N-times
    //[unknown], 32, 32, [32, 32, 32-32-1]
    //sig is considered for all info before its sig-r-s-v, which means including all data like mark and consignor
    //consignors : 0 for not in consignor mode, non-0 for how many consignors
    function checkConsignors() internal returns (uint256 consignors, bool error){
        uint256 markNumber = 0;
        bytes32 r;
        bytes32 s;
        uint8 v;
        bytes32 hash;
        uint256 envelope = msg.data.length;
        while (envelope >= 193) {
            envelope = envelope - 129;
            if (checkConsignorMark != toBytes32(msg.data, envelope)) {
                break;
            }
            r = toBytes32(msg.data, envelope + 64);
            s = toBytes32(msg.data, envelope + 96);
            v = toUint8(msg.data, envelope + 128);
            hash = keccak256(slice(msg.data, 0, envelope + 64));
            //revert(string(abi.encodePacked("r : ",sysPrintBytes32ToHex(r), " s : ", sysPrintBytes32ToHex(s), " v : ", sysPrintUint256ToHex(v))));
            //revert(string(abi.encodePacked("hash : ",sysPrintBytes32ToHex(hash))));
            //revert(string(abi.encodePacked("consignor : ",sysPrintAddressToHex(toAddressFromBytes32(msg.data, envelope + 32)))));
            if (toAddressFromBytes32(msg.data, envelope + 32) != ecrecover(hash, v, r, s)) {

                //revert(string(abi.encodePacked("ecrecover : ",sysPrintAddressToHex(ecrecover(hash, v, r, s)))));
                return (0, true);
            }
            markNumber ++;
        }

        //now we get how many marks stored by markNumber
        if (markNumber > 0) {
            if (toAddressFromBytes32(msg.data, msg.data.length - markNumber * 129 - 32) != address(this)) {
                return (markNumber, true);
                //revert("target address");
            }

            bytes32 uuid = toBytes32(msg.data, msg.data.length - markNumber * 129 - 64);

            if (sysGetUuid(uuid)) {
                return (markNumber, true);
                //revert("uuid");
            }
            sysSetUuidUsed(uuid);

            return (markNumber, false);
        }

        //not found any marks, deal like normal ethereum tx

        return (0, false);
    }

    function sysSetUuidUsed(bytes32 uuid) internal {
        sysEnhancedMapAdd(uuidSlot, uuid, bytes32(uint256(0x01)));
    }

    function sysGetUuid(bytes32 uuid) internal view returns (bool){
        if (sysEnhancedMapGet(uuidSlot, uuid) == bytes32(uint256(0x01))) {
            return true;
        }
        return false;
    }

    //this function is copied from https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol
    function slice(
        bytes memory _bytes,
        uint _start,
        uint _length
    )
    internal
    pure
    returns (bytes memory)
    {
        require(_bytes.length >= (_start + _length), "slice, out of range");

        bytes memory tempBytes;

        assembly {
            switch iszero(_length)
            case 0 {
            // Get a location of some free memory and store it in tempBytes as
            // Solidity does for memory variables.
                tempBytes := mload(0x40)

            // The first word of the slice result is potentially a partial
            // word read from the original array. To read it, we calculate
            // the length of that partial word and start copying that many
            // bytes into the array. The first word we copy will start with
            // data we don't care about, but the last `lengthmod` bytes will
            // land at the beginning of the contents of the new array. When
            // we're done copying, we overwrite the full first word with
            // the actual length of the slice.
                let lengthmod := and(_length, 31)

            // The multiplication in the next line is necessary
            // because when slicing multiples of 32 bytes (lengthmod == 0)
            // the following copy loop was copying the origin's length
            // and then ending prematurely not copying everything it should.
                let mc := add(add(tempBytes, lengthmod), mul(0x20, iszero(lengthmod)))
                let end := add(mc, _length)

                for {
                // The multiplication in the next line has the same exact purpose
                // as the one above.
                    let cc := add(add(add(_bytes, lengthmod), mul(0x20, iszero(lengthmod))), _start)
                } lt(mc, end) {
                    mc := add(mc, 0x20)
                    cc := add(cc, 0x20)
                } {
                    mstore(mc, mload(cc))
                }

                mstore(tempBytes, _length)

            //update free-memory pointer
            //allocating the array padded to 32 bytes like the compiler does now
                mstore(0x40, and(add(mc, 31), not(31)))
            }
            //if we want a zero-length slice let's just return a zero-length array
            default {
                tempBytes := mload(0x40)

                mstore(0x40, add(tempBytes, 0x20))
            }
        }

        return tempBytes;
    }
}



/*function() payable external {
    bytes32 notFound = notFoundMark;
    assembly {

        let ptr := mload(0x40)
        mstore(ptr, notFound)
        return (ptr, 32)
    }
}*/


/* bytes4 selector = msg.sig;

        uint256 size;
        uint256 ptr;
        bool result;
        //check if the shortcut hit
        address delegateTo = checkShortcut(selector);
        if (delegateTo != address(0x00)) {

            assembly{
                ptr := mload(0x40)
                calldatacopy(ptr, 0, calldatasize)
                result := delegatecall(gas, delegateTo, ptr, calldatasize, 0, 0)
                size := returndatasize
                returndatacopy(ptr, 0, size)
                switch result
                case 0 {revert(ptr, size)}
                default {return (ptr, size)}
            }
        }

        //no shortcut
        bytes32 notFound = notFoundMark;
        bool found = false;
        for (uint256 i = 0; i < delegates.length && !found; i ++) {
            delegateTo = delegates[i];
            assembly{
                result := delegatecall(gas, delegateTo, 0, 0, 0, 0)
                size := returndatasize
                returndatacopy(ptr, 0, size)
                mstore(0x40, add(ptr, size))//update free memory pointer
                found := 0x01 //assume we found the target function
                if and(and(eq(result, 0x01), eq(size, 0x20)), eq(mload(ptr), notFound)){
                //match the "notFound" mark
                    found := 0x00
                }
            }
            if (found) {
                emit FunctionFound(delegateTo);
                //add to shortcut, take effect only when the delegatecall returns 1 (not 0-revert)
                shortcut[selector] = delegateTo;


                //return data
                assembly{
                    switch result
                    case 0 {revert(ptr, size)}
                    default {return (ptr, size)}
                }
            }
        }
        //comes here for not found
        emit FunctionNotFound(selector);*/
