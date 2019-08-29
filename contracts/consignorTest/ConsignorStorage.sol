pragma solidity ^0.5.7;

import "./ConsignorLayout.sol";
import "../Proxy.sol";

contract ConsignorStorage is ConsignorLayout, Proxy {
    constructor() public Proxy(msg.sender){
    }
}
