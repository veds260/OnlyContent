// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

contract OnlyContent{
    uint constant public fee= 0.1 ether;
    error PaymentTooLow();
    error AlreadyMember(address creator);
    error PaymentRejected();
    mapping(address=>mapping(address=>bool)) public members; // When we create a public variable, we essentially create a function also. Here, members has two arguments members(address, address)
    function join(address payable creator) external payable{
        if(msg.value<fee){
            revert PaymentTooLow();
        }
        if(members[creator][msg.sender] == true){
            revert AlreadyMember(creator);
        }
        (bool sent, bytes memory _data)= creator.call{value: fee}("");
        if(!sent){
            revert PaymentRejected();
        }
        members[creator][msg.sender]= true;
    }
}