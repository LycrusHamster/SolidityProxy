pragma solidity ^0.5.0;

import "./DataStructs.sol";

contract Layout2 {

    struct arrayStruct {
        DataStructs.Person[] data;
    }

    arrayStruct people;

    mapping(address => bool) public enrollment;
    DataStructs.Person[] public registry;


    event Event4(address addr, uint256 num, bytes32 b32, address emitter);
    event Event5(address addr, uint256 num, bytes32 b32, address emitter);
}
