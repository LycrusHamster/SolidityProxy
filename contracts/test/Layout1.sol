pragma solidity ^0.5.0;

import "./DataStructs.sol";

contract Layout1 {

    DataStructs.Person public admin;
    uint256 public postCode;
    string public welcomeMessage;

    struct mappingStruct {
        mapping(address => uint256) data;
    }

    mappingStruct salary;

    event Event1(address addr, uint256 num, bytes32 b32, address emitter);
    event Event2(address addr, uint256 num, bytes32 b32, address emitter);
    event Event3(address addr, uint256 num, bytes32 b32, address emitter);
}
