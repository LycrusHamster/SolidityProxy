pragma solidity ^0.5.7;

import "./Event.sol";


//logic4 has same function selector conflicted with logic1 and logic2
contract Logic5 is Event {

    //7dbc08c8
    function someABI_5(address _addr) public {
    }

    //5084a22b
    function someABIview_5() public view returns (address) {
        return address(0x0000000000000000000000000000000022221111);
    }

}
