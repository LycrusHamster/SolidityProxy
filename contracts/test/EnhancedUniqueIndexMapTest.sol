pragma solidity ^0.5.7;

import "../EnhancedUniqueIndexMap.sol";

contract EnhancedUniqueIndexMapTest is EnhancedUniqueIndexMap {
    constructor()public{}

    function sysUniqueIndexMapAddTest(bytes32 slot, bytes32 value) external {
        sysUniqueIndexMapAdd(slot, value);
    }

    function sysUniqueIndexMapDelTest(bytes32 slot, bytes32 value) external {
        sysUniqueIndexMapDel(slot, value);
    }

    function sysUniqueIndexMapDelArrangeTest(bytes32 slot, bytes32 value) external {
        sysUniqueIndexMapDelArrange(slot, value);
    }

    function sysUniqueIndexMapReplaceTest(bytes32 slot, bytes32 oldValue, bytes32 newValue) external {
        sysUniqueIndexMapReplace(slot, oldValue, newValue);
    }

    function sysUniqueIndexMapSizeTest(bytes32 slot) external view returns (uint256){
        return sysUniqueIndexMapSize(slot);
    }

    //returns index, 0 mean not exist
    function sysUniqueIndexMapGetIndexTest(bytes32 slot, bytes32 value) external view returns (uint256){
        return sysUniqueIndexMapGetIndex(slot, value);
    }

    function sysUniqueIndexMapGetValueTest(bytes32 slot, uint256 index) external view returns (bytes32){
        return sysUniqueIndexMapGetValue(slot, index);
    }
}
