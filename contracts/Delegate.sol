pragma solidity ^0.5.0;

import "./Base.sol";

contract Delegate is Base {
    constructor () public {

    }

    //function sig : 552079dccdd240270daf6f7b8880a36555740730dd71469d4b1bb6a76a47c355
    //default fallback function doesn't allow args and returns, and is non-payable
    //but you can access calldata and set returndata by assembly by yourself :)
    function fallback() nonPayable internal {
    }

    function() payable external {
        //target function doesn't hit normal functions
        //check if it's sig is 0x00000000 to call fallback
        if (msg.sig == bytes4(0x00000000)) {
            fallback();
        } else {
            //if goes here, the target function must not be found;
            returnAsm(false, notFoundMark);
        }


    }
}
