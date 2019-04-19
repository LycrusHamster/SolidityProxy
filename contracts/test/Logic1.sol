pragma solidity ^0.5.7;

import "./Layout.sol";
import "../Delegate.sol";
import "./Event.sol";

contract Logic1 is Layout, Event, Delegate {

    //c170d0fe
    function setAddress_1(address _addr) public {
        addr_1 = _addr;
    }

    //3702ff6b
    function getAddress_1() public view returns (address) {
        return addr_1;
    }

    //c22574aa
    function setBytes32_1(bytes32 _bytes32) external {
        bytes32_1 = _bytes32;
    }

    //78653d93
    function getBytes32_1() external view returns (bytes32) {
        return bytes32_1;
    }
}
