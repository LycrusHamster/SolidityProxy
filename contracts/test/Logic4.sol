pragma solidity ^0.5.7;

import "./Layout.sol";
import "../Delegate.sol";
import "./Event.sol";

//logic4 has same function selector conflicted with logic1 and logic2
contract Logic4 is Layout, Event, Delegate {

    //@Logic1
    function setAddress_1(address _addr) public {
        addr_1 = address(0x0000000000000000000000000000000000004444);
    }

    //@Logic1
    function getAddress_1() public view returns (address) {
        return addr_1;
    }

    //@Logic2
    function setUint256_2(uint256 _uint256) public {
        uint256_2 = 0x0000000000000000000000000000000000000000000000000000000000004444;
    }

    //@Logic2
    function getUint256_2() public view returns (uint256) {
        return uint256_2;
    }


    function defaultFallback() internal {
        emit DefaultFallback(msg.value, gasleft());
    }
}
