pragma solidity ^0.5.7;

import "./Logic1.sol";
import "./Logic2.sol";
import "./Logic3.sol";
import "./Logic4.sol";

/*
{
    "70318695": "getUint256_2()",
    "3702ff6b": "getAddress_1()",
    "023f14a3": "getAddress_3()",
    "78653d93": "getBytes32_1()",
    "cc841616": "getBytes32_3()",
    "2b600cfe": "getBytes_2()",
    "c170d0fe": "setAddress_1(address)",
    "90050b9b": "setAddress_3(address)",
    "c22574aa": "setBytes32_1(bytes32)",
    "b9273f7b": "setBytes32_3(bytes32)",
    "a63cb761": "setBytes_2(bytes)",
    "fa469943": "setUint256_2(uint256)"
}
*/
contract LogicABI is Logic1, Logic2, Logic3, Logic4 {
    constructor () public{}
}
