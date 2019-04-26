pragma solidity ^0.5.7;

import "./CalleeLayout.sol";
import "../Proxy.sol";

contract CalleeStorage is CalleeLayout, Proxy {
    constructor() public Proxy(msg.sender){
    }
}
