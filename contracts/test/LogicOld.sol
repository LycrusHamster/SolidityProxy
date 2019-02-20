pragma solidity ^0.5.0;

import "./LayoutOld.sol";
import "../Delegate.sol";

contract LogicOld is Delegate, LayoutOld {
    constructor () public{

    }

    function setSalary(address addr, uint256 sal) public {
        salary.data[addr] = sal;
    }

    function getSalary(address addr) view public returns (uint256){
        return salary.data[addr];
    }

    function emitEvent1(address addr, uint256 num, bytes32 b32) public {
        emit Event1(addr, num, b32, address(this));
    }

    function setPostCode(uint256 code) public {
        postCode = code;
    }

    function getPostCode() public view returns (uint256){
        return postCode;
    }

    function fallback() nonPayable internal {
        emit Event2(address(this), 1234, hex"4321", address(this));
    }
}
