import './App.css';
import  { Routes, Route } from 'react-router-dom';
import {useNavigate} from 'react-router'
import Navigation from './components/navbar';
import Home from './components/home';
import CreateNFTs from './components/create-nfts';
import GetNFTs from './components/my-listed-nfts';
import MyOrders from './components/my-orders';
import GenerateWallet from './components/wallet';
import MarketplaceAbi from '../frontend/contractsData/Marketplace.json'
import MarketplaceAddress from '../frontend/contractsData/Marketplace-address.json'
import { useState , useEffect} from 'react'
import { ethers } from "ethers"
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Spinner } from 'react-bootstrap';


function App() {
  const [marketplace, setMarketplace] = useState({})
  const [contractLoading, setContractLoading] = useState(true);
  const [showWalletScreen, setShowWalletScreen] = useState(false);
  const navigate = useNavigate();

  const handleConnectWalletClick = async () => {
    setShowWalletScreen(true);
    navigate('/hd-wallet')
  }

  const handleBackButtonClick = () => {
    setShowWalletScreen(false);
    navigate('/')
  }

  const loadcontract = async (signer) =>{
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace);
    setContractLoading(false);
  }

  useEffect(() => {
    /*
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    */
    let provider, signer;

    if(process.env.REACT_APP_NETWORK === "ganache") { // If using Ganache
      provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_GANACHE_ENDPOINT);
      signer = provider.getSigner();
    } 
    else if (process.env.REACT_APP_NETWORK === "goerli") { // If using Goerli
      provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ALCHEMY_API_URL);
      signer = new ethers.Wallet(process.env.REACT_APP_GOERLI_PRIVATE_KEY, provider);
    }
    else if (process.env.REACT_APP_NETWORK === "sepolia") { // If using Sepolia
      provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_SEPOLIA_ENDPOINT);
      signer = new ethers.Wallet(process.env.REACT_APP_SEPOLIA_PRIVATE_KEY, provider);
    }
    else if (process.env.REACT_APP_NETWORK === "polygon") { // If using Polygon
      provider = new ethers.providers.JsonRpcProvider(process.envREACT_APP_POLYGON_ENDPOINT);
      signer = new ethers.Wallet(process.env.REACT_APP_POLYGON_PRIVATE_KEY, provider);
    }
    else{
      provider = new ethers.providers.JsonRpcProvider();
      signer = provider.getSigner();
    }
    console.log(signer);
    loadcontract(signer);
  }, []);

  return (
      <div className="App">
      <Navigation handleConnectWalletClick={handleConnectWalletClick} showWalletScreen={showWalletScreen} handleBackButtonClick={handleBackButtonClick} />
        <div>
        {marketplace && !contractLoading && (
        <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace}/>
              } />
              <Route path="/create" element={
                <CreateNFTs marketplace={marketplace}/>
              } />
              <Route path="/my-listed-items" element={
                <GetNFTs />
              } />
              <Route path="/my-purchases" element={
                <MyOrders />
              } />
              <Route path="/hd-wallet" element={
                <GenerateWallet />
              } />
        </Routes>
        )}
        </div>
      </div>
  );
}

export default App;
