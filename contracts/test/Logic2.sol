pragma solidity ^0.5.7;

import "./Layout.sol";
import "../Delegate.sol";
import "./Event.sol";

contract Logic2 is Layout, Event, Delegate {

    //fa469943
    function setUint256_2(uint256 _uint256) public {
        uint256_2 = _uint256;
    }

    //70318695
    function getUint256_2() public view returns (uint256) {
        return uint256_2;
    }

    //a63cb761
    function setBytes_2(bytes memory _bytes) public {
        bytes_2 = _bytes;
    }

    //2b600cfe
    function getBytes_2() public view returns (bytes memory) {
        return bytes_2;
    }

}
