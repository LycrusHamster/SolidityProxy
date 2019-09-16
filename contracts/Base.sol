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
                return (add(returnData, 0x20), length)
            }
            default{
                revert (add(returnData, 0x20), length)
            }
        }
    }

    function isConsignorMode() internal pure returns (uint256 consignors){
        uint256 markNumber = 0;
        uint256 envelope = msg.data.length;
        while (envelope >= 193) {
            envelope = envelope - 129;
            if (checkConsignorMark != toBytes32(msg.data, envelope)) {
                break;
            }
            /*
                        //escape check consignor's sig because we have already done this in Proxy
                        //well, if you bypass Proxy and manipulate a calldata to hack, that violates the usage, but won't do harm to the system cause the Delegate doesn't care its storage
                        r = toBytes32(msg.data, envelope + 64);
                        s = toBytes32(msg.data, envelope + 96);
                        v = toUint8(msg.data, envelope + 97);
                        hash = keccak256(slice(msg.data, 0, envelope));
                        if (toAddressFromBytes32(msg.data, envelope + 32) != ecrecover(hash, v, r, s)) {
                            return (true, 0, true);
                        }
            */
            markNumber ++;
        }

        return markNumber;
    }

    function getConsignors() internal pure returns (address[] memory){
        uint256 consignorNumbers = isConsignorMode();
        if (consignorNumbers == 0) {
            return new address[](0);
        }

        address[] memory consignors = new address[] (consignorNumbers);

        uint256 envelope = msg.data.length;
        for(uint256 i = 0 ; i <consignorNumbers; i++ ){
            envelope = envelope - 129;

            consignors[i] = toAddressFromBytes32(msg.data, envelope + 32);
        }
        return consignors;
    }

    //this function is copied from https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol
    function toBytes32(bytes memory _bytes, uint _start) internal pure returns (bytes32) {
        require(_bytes.length >= (_start + 32), "toBytes32, out of range");
        bytes32 tempBytes32;

        assembly {
            tempBytes32 := mload(add(add(_bytes, 0x20), _start))
        }

        return tempBytes32;
    }

    function toAddressFromBytes32(bytes memory _bytes, uint _start) internal pure returns (address) {
        bytes32 b = toBytes32(_bytes, _start);
        return address(uint256(b));
    }

    //this function is copied from https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol
    function toUint8(bytes memory _bytes, uint _start) internal pure returns (uint8) {
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
