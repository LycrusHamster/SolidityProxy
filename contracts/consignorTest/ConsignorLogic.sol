pragma solidity ^0.5.7;

import "./ConsignorLayout.sol";
import "../Delegate.sol";

contract ConsignorLogic is ConsignorLayout, Delegate {
    constructor () public{

    }

    function testConsignorFunction(address _a, bytes32 _b, uint256 _c, uint256[] calldata _d) external view inConsignorMode
    returns (address a, bytes32 b, uint256 c, uint256[] memory d, address consignor, address THIS, address msgsender, bytes memory callData){
        consignor = getMsgSender();
        return (_a, _b, _c, _d, consignor, address(this), msg.sender, msg.data);
    }

    function testConsignorsFunction(address _a, bytes32 _b, uint256 _c, uint256[] calldata _d) external view inConsignorMode
    returns (address a, bytes32 b, uint256 c, uint256[] memory d, address[] memory consignors, address THIS, address msgsender, bytes memory callData){
        address[] memory consignors = getMsgSenders();
        return (_a, _b, _c, _d, consignors, address(this), msg.sender, msg.data);
    }

    function testConsignorsLiteFunction() external view returns (address[] memory consignors, address consignor){
        address[] memory consignors = getMsgSenders();
        address consignor = getMsgSender();
        return(consignors,consignor);
    }

    function testDirectFunction(address _a, bytes32 _b, uint256 _c, uint256[] calldata _d) external view inWalkThroughMode
    returns (address a, bytes32 b, uint256 c, uint256[] memory d, address msgsender){
        return (_a, _b, _c, _d, msg.sender);
    }

}
