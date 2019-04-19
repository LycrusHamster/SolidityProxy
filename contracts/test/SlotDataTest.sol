pragma solidity ^0.5.7;
import "../SlotData.sol";

contract SlotDataTest is SlotData {

    constructor()public{}

    // for map,  key could be 0x00, but value can't be 0x00;
    // if a key's value == 0x00, it mean the key doesn't has any value
    function sysMapSetTest(bytes32 mappingSlot, bytes32 key, bytes32 value) external returns (uint256 length){
        return sysMapSet(mappingSlot, key, value);
    }

    function sysMapGetTest(bytes32 mappingSlot, bytes32 key) external view returns (bytes32){
        return sysMapGet(mappingSlot, key);
    }

    function sysMapLenTest(bytes32 mappingSlot) external view returns (uint256){
        return sysMapLen(mappingSlot);
    }

    function sysLoadSlotDataTest(bytes32 slot) external view returns (bytes32){
        return sysLoadSlotData(slot);
    }

    function sysSaveSlotDataTest(bytes32 slot, bytes32 data) external {
        sysSaveSlotData(slot, data);
    }

    function sysCalcMapOffsetTest(bytes32 mappingSlot, bytes32 key) external pure returns (bytes32){
        return sysCalcMapOffset(mappingSlot, key);
    }
}
