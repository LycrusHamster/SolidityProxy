pragma solidity ^0.5.7;

import "./ConsignorLayout.sol";
import "../Delegate.sol";

contract ConsignorLogic is ConsignorLayout, Delegate {
    constructor () public{

    }

    function testFunction(address _a, bytes32 _b, uint256 _c, uint256[] calldata _d) external view inConsignorMode
    returns(address a,bytes32 b,uint256 c,uint256[] memory d,address consignor, address target,address msgsender, bytes memory callData){
        consignor = getConsignor();
        target = getTargetContract();
        return (_a, _b, _c,_d,consignor,target,msg.sender,msg.data);
    }

    function testFunction2(address _a, bytes32 _b, uint256 _c, uint256[] calldata _d) external view inWalkThroughMode
    returns(address a,bytes32 b,uint256 c,uint256[] memory d,address msgsender){
        return (_a, _b, _c,_d,msg.sender);
    }

}
