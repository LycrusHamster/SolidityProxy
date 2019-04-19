pragma solidity ^0.5.7;

import "../Proxy.sol";
import "./Layout.sol";

contract Storage is Layout, Proxy {
    constructor() public Proxy(msg.sender){
        uint256_2 = 1;
    }
}
