pragma solidity ^0.5.7;

import "../EnhancedMap.sol";

contract EnhancedMapTest is EnhancedMap {
    constructor()public{}

    function sysEnhancedMapSetTest(bytes32 slot, bytes32 key, bytes32 value) external  {
        sysEnhancedMapSet(slot, key, value);
    }

    function sysEnhancedMapAddTest(bytes32 slot, bytes32 key, bytes32 value) external  {
        sysEnhancedMapAdd(slot, key, value);
    }

    function sysEnhancedMapDelTest(bytes32 slot, bytes32 key) external {
        sysEnhancedMapDel(slot, key);
    }

    function sysEnhancedMapReplaceTest(bytes32 slot, bytes32 key, bytes32 value) external {
    sysEnhancedMapReplace(slot, key, value);
    }

    function sysEnhancedMapGetTest(bytes32 slot, bytes32 key) external view returns (bytes32){
        return sysEnhancedMapGet(slot, key);
    }

    function sysEnhancedMapSizeTest(bytes32 slot) external view returns (uint256){
        return sysEnhancedMapSize(slot);
    }
}
