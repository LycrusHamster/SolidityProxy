pragma solidity ^0.5.11;

library StringAppend {

    function appendString(string memory original, string memory toAppend) internal pure returns (string memory){
        return sewUp(original, toAppend);
    }

    function appendBytes(string memory original, bytes memory toAppend) internal pure returns (string memory){
        return sewUp(original, sysPrintBytesToHex(toAppend));
    }

    function appendAddress(string memory original, address toAppend) internal pure returns (string memory){
        return sewUp(original, sysPrintAddressToHex(toAppend));
    }

    function appendBytes32(string memory original, bytes32 toAppend) internal pure returns (string memory){
        return sewUp(original, sysPrintBytes32ToHex(toAppend));
    }

    function appendUint256(string memory original, uint256 toAppend) internal pure returns (string memory){
        return sewUp(original, sysPrintUint256ToHex(toAppend));
    }

    function appendBytes4(string memory original, bytes4 toAppend) internal pure returns (string memory){
        return sewUp(original, sysPrintBytes4ToHex(toAppend));
    }

    function sewUp(string memory original, string memory toAppend) internal pure returns (string memory){
        return string(abi.encodePacked(original, toAppend));
    }

    function sysPrintBytesToHex(bytes memory input) internal pure returns (string memory){
        bytes memory ret = new bytes(input.length * 2);
        bytes memory alphabet = "0123456789abcdef";
        for (uint256 i = 0; i < input.length; i++) {
            bytes32 t = bytes32(input[i]);
            bytes32 tt = t >> 31 * 8;
            uint256 b = uint256(tt);
            uint256 high = b / 0x10;
            uint256 low = b % 0x10;
            byte highAscii = alphabet[high];
            byte lowAscii = alphabet[low];
            ret[2 * i] = highAscii;
            ret[2 * i + 1] = lowAscii;
        }
        return string(ret);
    }

    function sysPrintAddressToHex(address input) internal pure returns (string memory){
        return sysPrintBytesToHex(
            abi.encodePacked(input)
        );
    }

    function sysPrintBytes4ToHex(bytes4 input) internal pure returns (string memory){
        return sysPrintBytesToHex(
            abi.encodePacked(input)
        );
    }

    function sysPrintUint256ToHex(uint256 input) internal pure returns (string memory){
        return sysPrintBytesToHex(
            abi.encodePacked(input)
        );
    }

    function sysPrintBytes32ToHex(bytes32 input) internal pure returns (string memory){
        return sysPrintBytesToHex(
            abi.encodePacked(input)
        );
    }
}
