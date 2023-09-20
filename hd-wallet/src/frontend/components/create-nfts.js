import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import {  create as ipfsHttpClient } from 'ipfs-http-client';
import { Spinner } from 'react-bootstrap'

// create an IPFS client instance

const CreateNFTs = (marketplace) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false);

  const projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
  const projectSecretKey = process.env.REACT_APP_IPFS_PROJECT_KEY;
  const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);
  const uploadBaseURI = process.env.REACT_APP_IPFS_TYPE === 'local'? 'http://localhost:5001': 'https://ipfs.infura.io:5001/api/v0';
  const fetchBaseURI = process.env.REACT_APP_IPFS_TYPE === 'local'? 'https://gateway.ipfs.io/ipfs/': 'https://skywalker.infura-ipfs.io/ipfs/';

  const ipfsClient = process.env.REACT_APP_IPFS_TYPE === 'local'? ipfsHttpClient(uploadBaseURI) : ipfsHttpClient({
    url: uploadBaseURI,
    headers: {
      authorization,
    },
  });

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await ipfsClient.add(file);
        console.log(result)
        setImage(`${fetchBaseURI}${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const createNFT = async () => {
    if (!image || !price || !name || !description){
      console.log("Enter all the details")
      return
    }
    try{
      setLoading(true);
      const result = await ipfsClient.add(JSON.stringify({image, price, name, description}))
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error);
      setLoading(false);
    }
  }

  const mintThenList = async (result) => {
    console.log(result);
    const uri = `${fetchBaseURI}${result.path}`
    try{
       // mint nft 
        await marketplace.marketplace.mint(uri);
        // get tokenId of new nft 
        const id = await marketplace.marketplace.tokenCount()
        // approve marketplace to spend nft
        await(await marketplace.marketplace.setApprovalForAll(marketplace.marketplace.address, true)).wait()
        // add nft to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString())
        await(await marketplace.marketplace.makeItem(marketplace.marketplace.address, id, listingPrice)).wait()
        setLoading(false);
    }
    catch(err){
      console.log("Error while minting: ", err);
      setLoading(false);
    }
   
  }

  return (
    <div className="create-nft-container">
      {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Minting...</p>
            </div>
          ) }
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};


export default CreateNFTs;