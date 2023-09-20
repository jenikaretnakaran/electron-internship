# SIP-Electron

Marketplace DApp with an integrated wallet

## 🛠 Built With

<div align="left">
<a href="https://www.electronjs.org/docs/latest" target="_blank" rel="noreferrer">Electron Js | </a>
<a href="https://react.dev/learn" target="_blank" rel="noreferrer">React Js |</a>
<a href="https://docs.soliditylang.org/en/develop/" target="_blank" rel="noreferrer">Solidity |</a>
<a href="https://nodejs.org/en/docs" target="_blank" rel="noreferrer">Node Js |</a>
<a href="https://hardhat.org/docs" target="_blank" rel="noreferrer">Hardhat |</a>
<a href="https://trufflesuite.com/docs/ganache/" target="_blank" rel="noreferrer">Ganache |</a>
<a href="https://docs.ipfs.tech/" target="_blank" rel="noreferrer">IPFS |</a>
<a href="https://getbootstrap.com/docs/4.1/getting-started/introduction/" target="_blank" rel="noreferrer">Bootstrap |</a>
<a href="https://app.infura.io/" target="_blank" rel="noreferrer">Infura |</a>
<a href="https://dashboard.alchemy.com/" target="_blank" rel="noreferrer">Alchemy</a>
</div>

## ⚙️ Run Locally

Clone the repository and switch to dev2 branch

```bash
git clone https://github.com/Kerala-Blockchain-Academy/sip-electron.git
cd hd-wallet
git checkout dev2
```

Install node packages

```bash
npm install
```
For testing on local network, run Ganache network on your system.

Getting Started with Hardhat(for local development):

In one of the terminal windows, start the hardhat node:

```bash
npx hardhat node
```

This starts hardhat with predefined accounts.

In another terminal window, deploy the contract on the hardhat network(or any other network) from deploy.js script.

For Hardhat:
```bash
npx hardhat run src/backend/scripts/deploy.js --network localhost
```
For Ganache local network:
```bash
npx hardhat run src/backend/scripts/deploy.js --network ganache
```
For Goerli testnet:
```bash
npx hardhat run src/backend/scripts/deploy.js --network goerli
```
For Sepolia testnet:
```bash
npx hardhat run src/backend/scripts/deploy.js --network sepolia
```

For Polygon Mumbai testnet:
```bash
npx hardhat run src/backend/scripts/deploy.js --network polygon
```

#### Setting up IPFS network (on local node)/ Infura

Option 1: IPFS on local node <br /> 
Install IPFS, and keep it openin the background before running the react app.


Option 2: IPFS on infura network <br />
Create an account on Infura, create a project, and copy the Api_key and the Secret_key.


Create a .env file in your root project folder, and set the following variables:

```bash
REACT_APP_IPFS_PROJECT_ID="<Your-Infura-Project-Api-Key>"
REACT_APP_IPFS_PROJECT_KEY="<Your-Infura-Project-Secret-Key>"
REACT_APP_IPFS_TYPE=<local/infura>
REACT_APP_ALCHEMY_API_URL=<Your-Goerli-Project-Url-From-Alchemy>
REACT_APP_POLYGON_ENDPOINT=<Your-Polygon-Project-Url-From-Alchemy>
REACT_APP_SEPOLIA_ENDPOINT=<Your-Sepolia-Project-Endpoint>
REACT_APP_GANACHE_ENDPOINT="http://127.0.0.1:7545"
REACT_APP_NETWORK="ganache"
REACT_APP_GANACHE_ACCOUNT_PRIVATE_KEY="<Your-Ganache-Account-Private-Key-For-Local-Deployment>"
```

Run the following command to start your react project on browser using local ipfs network:

```bash
REACT_APP_IPFS_TYPE=local npm start
```
In case you want to use IPFS from infura service, replace "local" with "infura" in the above statement.

By default, the application uses Ganache as the network provider. You can change the network provider too.
E.g, to use Goerli as a network provider, use the following command:

```bash
REACT_APP_ALCHEMY_API_URL=<Your-Goerli-Project-Url-From-Alchemy> REACT_APP_IPFS_TYPE=infura npm start
```

This runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

To run the app on electron window, open another terminal window, and provide the following command.

```bash
REACT_APP_ALCHEMY_API_URL=<Your-Goerli-Project-Url-From-Alchemy> REACT_APP_IPFS_TYPE=infura npm start
```

## 📜 License

Distributed under the MIT License.

## 🎗️ Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/<feature_name>`)
3. Commit your Changes (`git commit -m '<feature_name>_added'`)
4. Push to the Branch (`git push origin feature/<feature_name>`)
5. Open a Pull Request
