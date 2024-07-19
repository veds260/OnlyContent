// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {OnlyContent} from "../src/OnlyContent.sol";

contract OnlyContentScript is Script {
    function setUp() public {}

    function run() public {
        uint deployerPrivateKey= vm.envUint("PRIVATE_KEY");
        vm.broadcast(deployerPrivateKey);
        new OnlyContent();
    }
}
