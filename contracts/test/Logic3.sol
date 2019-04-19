pragma solidity ^0.5.7;

import "./Layout.sol";
import "../Delegate.sol";
import "./Event.sol";

contract Logic3 is Layout, Event, Delegate {

    //90050b9b
    function setAddress_3(address _addr) public {
        addr_3 = _addr;
    }

    //023f14a3
    function getAddress_3() public view returns (address) {
        return addr_3;
    }

    //b9273f7b
    function setBytes32_3(bytes32 _bytes32) external {
        bytes32_3 = _bytes32;
    }

    //cc841616
    function getBytes32_3() external view returns (bytes32) {
        return bytes32_3;
    }

}
