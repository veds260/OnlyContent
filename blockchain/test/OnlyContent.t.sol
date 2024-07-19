// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {OnlyContent} from "../src/OnlyContent.sol";
contract BadCreator{}


contract CounterTest is Test {
    OnlyContent public onlycontent;
    address payable creator= payable(address(1));
    address member= address(2);
    address notMember= address(3);
    uint fee= 0.1 ether;

    function setUp() public {
        onlycontent = new OnlyContent();
        deal(member, 1 ether);
        vm.startPrank(member);
    }

    function test_Join_Successful() public {
        onlycontent.join{value: fee}(creator); 
        bool isMember1= onlycontent.members(creator, member);
        bool isMember2= onlycontent.members(creator, notMember);
        assertEq(isMember1, true);
        assertEq(isMember2, false);
        assertEq(creator.balance, fee);
    }

    function test_Join_PaymentTooLow() public {
        vm.expectRevert(OnlyContent.PaymentTooLow.selector);
        onlycontent.join{value: fee-1}(creator);
        bool isMember= onlycontent.members(creator, member);
        assertEq(isMember, false);
    }

    function test_Join_AlreadyMember() public {
        onlycontent.join{value: fee}(creator);
        vm.expectRevert(abi.encodeWithSelector(OnlyContent.AlreadyMember.selector, creator));
        onlycontent.join{value: fee}(creator);
    }
    function test_Join_PaymentRejected() public {
        BadCreator badCreator= new BadCreator();
        vm.expectRevert(OnlyContent.PaymentRejected.selector);
        onlycontent.join{value: fee}(payable(address(badCreator)));
    }
}
