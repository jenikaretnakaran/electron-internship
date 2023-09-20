
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
// require('@openzeppelin/hardhat-upgrades');
// require("@nomiclabs/hardhat-waffle");
// const privateKey = process.env.REACT_APP_GANACHE_ACCOUNT_PRIVATE_KEY;
// console.log(privateKey);

module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  // defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: `${process.env.REACT_APP_GANACHE_ENDPOINT}`,
      chainId: 1337,
      accounts: [`${process.env.REACT_APP_GANACHE_ACCOUNT_PRIVATE_KEY}`], 
    },
  }
}

// goerli: {
    //   url: process.env.REACT_APP_ALCHEMY_API_URL,
    //   accounts: [`0x${process.env.REACT_APP_GOERLI_PRIVATE_KEY}`],
    // },
    // sepolia: {
    //   url: process.env.REACT_APP_SEPOLIA_ENDPOINT,
    //   accounts: [`0x${process.env.REACT_APP_GOERLI_PRIVATE_KEY}`],
    // },
    // polygon: {
    //   url: process.env.REACT_APP_POLYGON_ENDPOINT,
    //   accounts: [`0x${process.env.REACT_APP_GOERLI_PRIVATE_KEY}`],
    // },

    // accounts: [`${process.env.REACT_APP_GANACHE_ACCOUNT_PRIVATE_KEY}`],