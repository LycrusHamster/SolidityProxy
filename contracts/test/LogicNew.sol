pragma solidity ^0.5.0;

import "../Delegate.sol";
import "./LayoutNew.sol";

contract LogicNew is Delegate, LayoutNew {
    constructor () public {

    }

    function setSalary(address addr, uint256 sal) public {
        salary.data[addr] = sal + 1000;
    }

    function getSalary(address addr) view public returns (uint256){
        return salary.data[addr];
    }

    function setEnrollment(address addr, bool enrolled) public {
        enrollment[addr] = enrolled;
    }

    function getEnrollment(address addr) view public returns (bool){
        return enrollment[addr];
    }

    function emitEvent4(address addr, uint256 num, bytes32 b32) public {
        emit Event4(addr, num, b32, address(this));
    }

    function fallback() internal {
        emit Event5(address(this), 1234, hex"4321", address(this));
    }
}
