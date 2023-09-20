const { expect } = require("chai");
const { ethers } = require("hardhat");
// 0x009fc6Ae3fC9895F98464c2725022D29CDFe7bcE

describe("Marketplace", () => {
  let marketplace;
  let owner;
  let user1;
  let user2;

  beforeEach(async () => {
    // Get Signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy Marketplace contract
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.connect(owner).deploy(
      "CustomNFT",
      "CNFT",
      1
    );
  });

  //mint
  describe("mint()", () => {
    it("should mint an NFT with a given tokenURI", async () => {
      // Mint NFT
      const tokenURI = "ipfs://QmZtnvma4nEKQgJRHcvfRNpXjYbz9ASUkSfbDT62stfTRg";
      await marketplace.connect(user1).mint(tokenURI);

      // Expect the token to be minted
      const tokenId = 1;
      const ownerOf = await marketplace.ownerOf(tokenId);
      expect(ownerOf).equal(await user1.getAddress());
      expect(await marketplace.tokenURI(tokenId)).equal(tokenURI);
      expect(parseInt(await marketplace.tokenCount())).to.equal(tokenId);
    });
  });

  //create new item
  describe("makeItem()", () => {
    it("should create a new item and emit an Offered event", async () => {
      // Create a new NFT
      const tokenURI = "ipfs://QmZtnvma4nEKQgJRHcvfRNpXjYbz9ASUkSfbDT62stfTRg";
      await marketplace.connect(user1).mint(tokenURI);

      await marketplace
        .connect(user1)
        .setApprovalForAll(marketplace.address, true);
      // Make a new item
      const price = ethers.utils.parseEther("1");
      await marketplace.connect(user1).makeItem(marketplace.address, 1, price);

      // Check that the item was created correctly
      const itemCount = await marketplace.itemCount();
      expect(parseInt(itemCount)).to.equal(1);

      const item = await marketplace.items(itemCount);
      // console.log("price is: ", price.toString());
      // console.log("item.price is: ", item.price.toString());

      expect(item.nft).to.equal(marketplace.address);
      expect(parseInt(item.tokenId)).to.equal(1);
      expect(item.price.toString()).to.equal(price.toString());
      expect(item.seller).to.equal(await user1.getAddress());
      expect(item.sold).to.equal(false);

      //eventdata
      const events = await marketplace.queryFilter("Offered");
      expect(events.length).to.equal(1);
      const eventArgs = events[0].args;
      expect(parseInt(eventArgs[0])).to.equal(1);
      expect(eventArgs[1]).to.equal(marketplace.address);
      expect(parseInt(eventArgs[2])).to.equal(1);
      expect(eventArgs[3].toString()).to.equal(price.toString());
      expect(eventArgs[4]).to.equal(await user1.getAddress());

      // Check that the NFT was transferred to the marketplace
      const marketplaceOwner = await marketplace.ownerOf(1);
      expect(marketplaceOwner).to.equal(await marketplace.address);
    });
  });

  //purchase an item
  describe("purchaseItem()", () => {
    it("should purchase an item and emit a Bought event", async () => {
      // Create a new NFT
      const tokenURI = "ipfs://QmZtnvma4nEKQgJRHcvfRNpXjYbz9ASUkSfbDT62stfTRg";
      await marketplace.connect(user1).mint(tokenURI);

      // const address = await user1.getAddress();
      const price = ethers.utils.parseEther("1");
      await marketplace
        .connect(user1)
        .setApprovalForAll(marketplace.address, true);
      await marketplace.connect(user1).makeItem(marketplace.address, 1, price);

      // Purchase the item
      const item = await marketplace.items(1);
      const totalPrice = await marketplace.getTotalPrice(1);
      // console.log("totalPrice is ", totalPrice);
      // console.log("item.price is ", item.price);

      // Balance before selling nft
      const sellerPrevBalance = await ethers.provider.getBalance(item.seller);
      // console.log("Balance before selling is ", sellerPrevBalance);

      // balance of fee account before transaction
      const feeAccountBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );
      // console.log("feeAccountBalanceBefore is ",feeAccountBalanceBefore);

      await marketplace.connect(user2).purchaseItem(1, { value: totalPrice });

      // Check that the item was marked as sold
      const updatedItem = await marketplace.items(1);
      expect(updatedItem.sold).to.equal(true);

      // Check that the seller received the funds
      const sellerBalance = await ethers.provider.getBalance(item.seller);
      const balance = sellerBalance.sub(sellerPrevBalance);

      expect(Number(item.price)).to.equal(Number(balance));

      // Check that the fee account received the fee
      const feeAccountBalance = await ethers.provider.getBalance(owner.address);
      // console.log("feeAccountBalance is ", feeAccountBalance);

      expect(Number(feeAccountBalance.sub(feeAccountBalanceBefore))).to.equal(
        Number(totalPrice.sub(item.price))
      );

      // Check that the buyer received the NFT
      const buyerBalance = await marketplace.balanceOf(user2.address);
      expect(Number(buyerBalance)).to.equal(1);

      //eventdata
      const events = await marketplace.queryFilter("Bought");
      expect(events.length).to.equal(1);
      const eventArgs = events[0].args;
      expect(Number(eventArgs.itemId)).to.equal(1);
      expect(eventArgs.nft).to.equal(marketplace.address);
      expect(Number(eventArgs.tokenId)).to.equal(1);
      expect(Number(eventArgs.price)).to.equal(Number(price));
      expect(eventArgs.seller).to.equal(await user1.getAddress());
      expect(eventArgs.buyer).to.equal(await user2.getAddress());
    });
    it("should revert if the item doesn't exist", async () => {
      // Try to purchase an item that doesn't exist
      const invalidItemId = 0;
      const totalPrice = await marketplace.getTotalPrice(invalidItemId);

      await expect(
        marketplace
          .connect(user2)
          .purchaseItem(invalidItemId, { value: totalPrice })
      ).to.be.revertedWith("item doesn't exist");
    });
    it("should revert if not enough ether to cover item price and market fee", async () => {
      // Create a new NFT
      const tokenURI = "ipfs://QmZtnvma4nEKQgJRHcvfRNpXjYbz9ASUkSfbDT62stfTRg";
      await marketplace.connect(user1).mint(tokenURI);

      await marketplace
        .connect(user1)
        .setApprovalForAll(marketplace.address, true);
      // Make a new item
      const price = ethers.utils.parseEther("1");
      await marketplace.connect(user1).makeItem(marketplace.address, 1, price);

      // Send less Ether than the total price
      const lessThanTotalPrice = ethers.utils.parseEther("0.5");
      await expect(
        marketplace.connect(user2).purchaseItem(1, {value: lessThanTotalPrice})
      ).to.be.revertedWith("not enough ether to cover item price and market fee");
    });
    it("item already sold", async () => {
      
    })
  });

  //getTotalPrice
  describe("getTotalPrice()", function () {
    it("should return the total price including market fee", async function () {
      // Create a new NFT
      const tokenURI = "ipfs://QmZtnvma4nEKQgJRHcvfRNpXjYbz9ASUkSfbDT62stfTRg";
      await marketplace.connect(user1).mint(tokenURI);

      await marketplace
        .connect(user1)
        .setApprovalForAll(marketplace.address, true);
      // Make a new item
      const price = ethers.utils.parseEther("1");
      await marketplace.connect(user1).makeItem(marketplace.address, 1, price);

      // Get the total price of the item
      const totalPrice = await marketplace.getTotalPrice(1);
      //  console.log("totalPrice is ", totalPrice);

      const expectedPrice = ethers.utils.parseEther("1.01");
      //  console.log("expectedPrice is ", expectedPrice);
      expect(Number(totalPrice)).to.equal(Number(expectedPrice));
    });
  });
});
