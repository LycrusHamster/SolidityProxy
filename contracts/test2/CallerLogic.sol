pragma solidity ^0.5.7;

import "./CallerLayout.sol";
import "../Delegate.sol";
import "./CalleeLogic.sol";

contract CallerLogic is CallerLayout, Delegate {
    constructor () public{

    }

    event Uint256(uint256 u);

    function setAddress(address payable _input) external {
        slot1 = _input;
    }

    function getAddress() external view returns (address){
        return slot1;
    }

    function setUint256Callee(uint256 _input) external {
        CalleeLogic(slot1).setUint256(_input);
    }

    function getUint256Callee() external view returns (uint256){
        return CalleeLogic(slot1).getUint256();
    }

    function setUint256CalleeAndGet(uint256 _input) external {
        CalleeLogic(slot1).setUint256(_input);
        emit Uint256(CalleeLogic(slot1).getUint256());
    }
}
