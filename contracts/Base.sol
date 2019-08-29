pragma solidity ^0.5.7;

contract Base {
    constructor () public{

    }

    //0x20 - length
    //0x53c6eaee8696e4c5200d3d231b29cc6a40b3893a5ae1536b0ac08212ffada877
    bytes constant notFoundMark = abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("404-method-not-found")))))));

    //for consignor mode
    //0x7e4f3c4fbc4d7bfb49012d8288defc0717f3e8b2de6308d424ff0c1353793bc9
    bytes32 constant checkConsignorMark = keccak256(abi.encodePacked(keccak256(abi.encodePacked(keccak256(abi.encodePacked("checkConsignorMark"))))));

    //return the payload of returnData, stripe the leading length
    function returnAsm(bool isRevert, bytes memory returnData) pure internal {
        assembly{
            let length := mload(returnData)
            switch isRevert
            case 0x00{
                return (add(returnData,0x20), length)
            }
            default{
                revert (add(returnData,0x20), length)
            }
        }
    }


    function isConsignorMode() internal pure returns (bool){
        bytes32 mark = toBytes32(msg.data,msg.data.length -97);
        if(mark == checkConsignorMark){
            return true;
        }
        return false;
    }
    //only in consignor mode, or you get wrong data or throw exception, I don't wan't to check consignor mode here again for wasting of time
    function getConsignor() internal pure returns (address){
        return toAddressFromBytes32(msg.data,msg.data.length - 161);
    }

    //only in consignor mode, or you get wrong data or throw exception, I don't wan't to check consignor mode here again for wasting of time
    function getTargetContract() internal pure returns (address){
        return toAddressFromBytes32(msg.data,msg.data.length - 129);
    }


    //this function is copied from https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol
    function toBytes32(bytes memory _bytes, uint _start) internal  pure returns (bytes32) {
        require(_bytes.length >= (_start + 32), "toBytes32, out of range");
        bytes32 tempBytes32;

        assembly {
            tempBytes32 := mload(add(add(_bytes, 0x20), _start))
        }

        return tempBytes32;
    }

    function toAddressFromBytes32(bytes memory _bytes, uint _start) internal pure returns (address) {
        bytes32 b = toBytes32(_bytes,_start);
        return address(uint256(b));
    }

    //this function is copied from https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol
    function toUint8(bytes memory _bytes, uint _start) internal  pure returns (uint8) {
        require(_bytes.length >= (_start + 1), "toUint8, out of range");
        uint8 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x1), _start))
        }

        return tempUint;
    }
    /*
        function toAddress(bytes memory _bytes, uint _start) internal  pure returns (address) {
            require(_bytes.length >= (_start + 20), "toAddress, out of range");
            address tempAddress;

            assembly {
                tempAddress := div(mload(add(add(_bytes, 0x20), _start)), 0x1000000000000000000000000)
            }

            return tempAddress;
        }*/

    modifier nonPayable(){
        require(msg.value == 0, "nonPayable");
        _;
    }

}
