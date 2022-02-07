// SPDX-License-Identifier: MIT
// Specifies that the source code is for a version
// of Solidity greater than 0.8.11
pragma solidity ^0.8.0;

contract Auction {
    address payable public owner;

    address payable public highestAddress;
    uint public highestBet;

    address payable public assetOwner;
    string public asset;

    bool public receivingAssets;
    mapping(address => bool) public players;

    constructor () {
        owner = payable(msg.sender);
        receivingAssets = true;
    }

    function participate() public payable {
        require(msg.value == 1000000000000000, "Participation fee is 1 Pwei");
        require(!players[msg.sender], "You are already a player");

        owner.transfer(msg.value);
        players[msg.sender] = true;
    }

    function bid() public payable {
        require(msg.value >= (highestBet + 1000000000000000), "You have to bid at least 1 Pwei more than current winner");

        // Return funds to previous winner
        highestAddress.transfer(highestBet);

        // Hold funds of current bidder
        owner.transfer(msg.value);

        // Record current funds
        highestAddress = payable(msg.sender);
        highestBet = msg.value;
    }

    function placeInAuction(string memory _asset) public payable {
        require(receivingAssets, "There is an auction in place");

        asset = _asset;
        assetOwner = payable(msg.sender);
        receivingAssets = false;
    }

    function finishRound() public {
        require(msg.sender == owner, "You are not the owner");

        // move asset to winner

        // take percentage from transaction and send the rest to previous asset owner
        highestAddress.transfer(uint(highestBet * 9 / 10));

        receivingAssets = true;
    }
}
