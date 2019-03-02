pragma solidity ^0.5.0;

import "./Base.sol";

contract Proxy is Base {
    constructor (address admin) public {
        sysSetAdmin(admin);
    }

    bytes32 constant adminSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("adminSlot"))))));

    bytes32 constant delegateFallbackSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("delegateFallbackSlot"))))));

    //index => address, array,  index starts from 1
    //delegatesEnhancedMappingSlot is the mapping's slot, and contains length (so we called enhanced :))
    bytes32 constant delegatesEnhancedMappingSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("delegatesEnhancedMappingSlot"))))));

    //address => index, mapping, index starts from 1, 0 means not indexed
    //delegatesIndexSlot is the mapping's slot, and contains length (so we called enhanced :))
    bytes32 constant delegatesIndexEnhancedMappingSlot = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("delegatesIndexMappingSlot"))))));


    function sysGetDelegateCount() public view returns (uint256){
        return sysEnhancedMappingLen(delegatesEnhancedMappingSlot);
    }

    function sysGetDelegateByIndex(uint256 index) public view returns (address){
        return address(uint256(sysEnhancedMappingGet(delegatesEnhancedMappingSlot, bytes32(index))));
    }

    function sysGetIndexByDelegate(address addr) public view returns (uint256) {
        return uint256(sysEnhancedMappingGet(delegatesIndexEnhancedMappingSlot, bytes32(uint256(addr))));
    }

    function sysAddDelegate(address _input) public onlyAdmin {
        bytes32 input = bytes32(uint256(_input));
        require(uint256(sysEnhancedMappingGet(delegatesIndexEnhancedMappingSlot, input)) == 0, "adding existing address to delegate pool is forbidden");
        uint256 last = sysEnhancedMappingLen(delegatesEnhancedMappingSlot);
        last ++;
        sysEnhancedMappingSet(delegatesEnhancedMappingSlot, bytes32(last), input);
        sysEnhancedMappingSet(delegatesIndexEnhancedMappingSlot, input, bytes32(last));
    }

    function sysDelDelegate(address _input) public onlyAdmin {
        bytes32 input = bytes32(uint256(_input));
        bytes32 index = sysEnhancedMappingGet(delegatesIndexEnhancedMappingSlot, input);
        require(index != 0, "deleting wrong address from delegate pool is forbidden");
        bytes32 last = bytes32(sysEnhancedMappingLen(delegatesEnhancedMappingSlot));
        bytes32 lastValue = sysEnhancedMappingGet(delegatesEnhancedMappingSlot, last);
        if (index != last) {
            //move the last to the current place

            sysEnhancedMappingSet(delegatesEnhancedMappingSlot, index, lastValue);
            sysEnhancedMappingSet(delegatesIndexEnhancedMappingSlot, lastValue, index);
        }
        sysEnhancedMappingSet(delegatesEnhancedMappingSlot, last, bytes32(0x00));
        sysEnhancedMappingSet(delegatesIndexEnhancedMappingSlot, input, bytes32(0x00));
    }

    function sysGetDelegateFallback() public view returns (address){
        return address(uint256(sysLoadSlotData(delegateFallbackSlot)));
    }

    function sysSetDelegateFallback(address _input) public onlyAdmin {
        sysSaveSlotData(delegateFallbackSlot, bytes32(uint256(_input)));
    }

    function sysGetAdmin() public view returns(address){
        return address(uint256(sysLoadSlotData(adminSlot)));
    }

    function sysSetAdmin(address _input) private {
        sysSaveSlotData(adminSlot, bytes32(uint256(_input)));
    }

    function sysEnhancedMappingSet(bytes32 mappingSlot, bytes32 key, bytes32 value) internal {

        uint256 length = uint256(sysLoadSlotData(mappingSlot));
        bytes32 elementOffset = bytes32(keccak256(abi.encodePacked(key, mappingSlot)));
        bytes32 storedValue = sysLoadSlotData(elementOffset);
        if (value == storedValue) {
            //needn't set same value;
        } else if (value == bytes32(0x00)) {
            //deleting value
            sysSaveSlotData(elementOffset, value);
            length--;
            sysSaveSlotData(mappingSlot, bytes32(length));
        } else if (storedValue == bytes32(0x00)) {
            //setting new value
            sysSaveSlotData(elementOffset, value);
            length++;
            sysSaveSlotData(mappingSlot, bytes32(length));
        } else {
            //updating
            sysSaveSlotData(elementOffset, value);
        }
        return;
    }

    function sysEnhancedMappingGet(bytes32 mappingSlot, bytes32 key) internal view returns (bytes32){
        bytes32 elementOffset = bytes32(keccak256(abi.encodePacked(key, mappingSlot)));
        return sysLoadSlotData(elementOffset);
    }

    function sysEnhancedMappingLen(bytes32 mappingSlot) internal view returns (uint256){
        return uint256(sysLoadSlotData(mappingSlot));
    }

    function sysLoadSlotData(bytes32 slot) internal view returns (bytes32){
        //ask a stack position
        bytes32 ret;
        assembly{
            ret := sload(slot)
        }
        return ret;
    }

    function sysSaveSlotData(bytes32 slot, bytes32 data) internal {
        assembly{
            sstore(slot, data)
        }
    }

    //since low-level address.delegateCall is available in solidity,
    //we don't need to write assembly
    function() payable external {

        bool found = false;
        bool error;
        bytes memory returnData;

        if (msg.sig == bytes4(0x00000000) && sysGetDelegateFallback() != address(0x00)) {
            /*
            the default transfer will set data to empty,
            so that the msg.data.length = 0 and msg.sig = bytes4(0x00000000)
            */

            (found, error, returnData) = redirect(sysGetDelegateFallback(), msg.data);
            returnAsm(error, returnData);
        }

        uint256 len = sysGetDelegateCount();
        for (uint256 i = 0; i < len; i++) {
            bool isFound;
            (isFound, error, returnData) = redirect(sysGetDelegateByIndex(i + 1), msg.data);
            if (isFound) {
                found = true;
                break;
            }
        }

        if (found) {
            returnAsm(error, returnData);
        } else {
            if (revertFriendly()) {
                revert(string(abi.encodePacked("function selector not found : ", sysPrintBytes4ToHex(msg.sig))));
            } else {
                revert();
            }
        }
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

    function revertFriendly() internal pure returns (bool){
        return true;
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

    modifier onlyAdmin(){
        require(msg.sender == sysGetAdmin(), "only admin");
        _;
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
