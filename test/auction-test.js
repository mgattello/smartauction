const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Auction", function () {
    let Auction;
    let auction;

    let owner;
    let assetProvider;
    let bidder1;
    let bidders;

    beforeEach(async function () {
        [owner, assetProvider, bidder1, ...bidders] = await ethers.getSigners();

        Auction = await ethers.getContractFactory("Auction");
        auction = await Auction.deploy();

        await auction.deployed();
    })

    it("records owner", async function () {
        expect(await auction.owner()).to.equal(owner.address);
    })

    it("can place auction", async function () {
        await auction.connect(assetProvider).placeInAuction("MyAsset!", {
            value: ethers.utils.parseEther("1.0")
        });
        
        expect(await auction.asset()).to.equal("MyAsset!");
        expect(await auction.assetOwner()).to.equal(assetProvider.address);
    })

    it("prevents a second auction from being placed", async function () {
        await auction.connect(assetProvider).placeInAuction("MyAsset!", {
            value: ethers.utils.parseEther("1.0")
        });
        
        expect(await auction.asset()).to.equal("MyAsset!");

        await expect(
            auction.connect(bidder1).placeInAuction("AnotherAsset", {
                value: ethers.utils.parseEther("1.0")
            })
        ).to.be.revertedWith("There is an auction in place")
    })

    describe("With auction in place", async function () {
        beforeEach(async function () {
            await auction.connect(assetProvider).placeInAuction("MyAsset!", {
                value: ethers.utils.parseEther("1.0")
            });
        })

        it("bidder cannot participate paying less than 1 Pwei fee", async function () {
            await expect(
                auction.connect(bidder1).participate({
                    value: ethers.utils.parseEther("0.0005")
                })
            ).to.be.revertedWith("Participation fee is 1 Pwei")
        })

        it("bidder cannot participate paying more than 1 Pwei fee", async function () {
            await expect(
                auction.connect(bidder1).participate({
                    value: ethers.utils.parseEther("0.002")
                })
            ).to.be.revertedWith("Participation fee is 1 Pwei")
        })

        it("bidder can participate paying exactly 1 Pwei fee", async function () {
            await auction.connect(bidder1).participate({
                value: ethers.utils.parseEther("0.001")
            })
            
            expect(await auction.players(bidder1.address)).to.equal(true);
        })

        it("bidder participation fee is sent to owner", async function () {
            let initialBalance = await ethers.provider.getBalance(owner.address)

            await auction.connect(bidder1).participate({
                value: ethers.utils.parseEther("0.001")
            })
            
            let updatedBalance = ethers.BigNumber.from(initialBalance).add(
                ethers.BigNumber.from("1000000000000000")
            )
            expect(await ethers.provider.getBalance(owner.address)).to.equal(updatedBalance)
        })

        it("bidder cannot pay double fee", async function () {
            await auction.connect(bidder1).participate({
                value: ethers.utils.parseEther("0.001")
            })

            await expect(
                auction.connect(bidder1).participate({
                    value: ethers.utils.parseEther("0.001")
                })
            ).to.be.revertedWith("You are already a player")
        })
    })

    describe("Auction mechanics", async function () {
        beforeEach(async function () {
            await auction.connect(assetProvider).placeInAuction("MyAsset!", {
                value: ethers.utils.parseEther("1.0")
            });
        })
        
        it("bidding sends money to owner", async function() {
            let initialBalance = await ethers.provider.getBalance(owner.address)

            await auction.connect(bidder1).bid({
                value: ethers.utils.parseEther("0.003")
            })
            
            let updatedBalance = ethers.BigNumber.from(initialBalance).add(
                ethers.BigNumber.from("3000000000000000")
            )
            expect(await ethers.provider.getBalance(owner.address)).to.equal(updatedBalance)
        })

        it("cannot bid less than current bid", async function() {
            await auction.connect(bidder1).bid({
                value: ethers.utils.parseEther("0.003")
            })

            await expect(
                auction.connect(bidders[0]).participate({
                    value: ethers.utils.parseEther("0.001")
                })
            ).to.be.revertedWith("You have to bid at least 1 Pwei more than current winner")
        })
    })
})

    // function test_bid_sends_money_to_owner() {

    // }

    // function test_first_bid_sets_current_winner() {

    // }

    // function test_cannot_bid_less_than_current_bid() {

    // }

    // function test_larger_bid_replaces_winner() {

    // }

    // function test_larger_bid_triggers_sendig_funds_to_previous_owner() {

    // }

    // function test_cannot_bid_without_auction() {

    // }

    // function test_non_owner_cannot_finish_round() {

    // }

    // function test_finish_round_sends_90_percent_to_asset_provider() {

    // }
