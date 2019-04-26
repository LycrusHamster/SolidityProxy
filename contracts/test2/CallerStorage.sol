pragma solidity ^0.5.7;

import "./CallerLayout.sol";
import "../Proxy.sol";

contract CallerStorage is CallerLayout, Proxy {
    constructor() public Proxy(msg.sender){
    }
}
