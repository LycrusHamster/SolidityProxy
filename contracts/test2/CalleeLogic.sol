pragma solidity ^0.5.7;

import "./CalleeLayout.sol";
import "../Delegate.sol";

contract CalleeLogic is CalleeLayout, Delegate {
    constructor () public{

    }

    function setUint256(uint256 _input) external {
        slot1 = _input;
    }

    function getUint256() external view returns (uint256){
        return slot1;
    }
}
