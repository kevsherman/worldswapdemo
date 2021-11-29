//ToDo: Ensure wallet connected, etc

const forwarderOrigin = 'http://127.0.0.1:7545'; //set local/testnet/mainnet connection
const web3 = new Web3(forwarderOrigin);
const abiSet = require('../contract_abis');

//token contract
const abi = abiSet['WorldSwapToken'].abi
const contractAddress = abiSet['WorldSwapToken'].contractAddress
const contract = new web3.eth.Contract(abi, contractAddress); 

//metaMarket contract
const metaMarketContract = new web3.eth.Contract(abiSet['MetaMarket'].abi, abiSet['MetaMarket'].contractAddress); 


$(function() {
  const GetUserTokens = async () => {
    //import ABI and contractAddress for each supported token (currently only WorldSwapToken)
    //IN the future, loop through all supported tokens and check wallet for existance
    
    // const abi = abiSet['WorldSwapToken'].abi
    // const contractAddress = abiSet['WorldSwapToken'].contractAddress
    // const contract = new web3.eth.Contract(abi, contractAddress); 

    let accounts = await web3.eth.getAccounts();
    let balance = await contract.methods.balanceOf(accounts[0]).call()
    
    // Loop through the tokens for the account and ...
    // for(var i = 0; i < 1; i++) {
    for(var i = 0; i < Number(balance); i++) {
      let id = await contract.methods.tokenOfOwnerByIndex(accounts[0], i).call();
      let name = await contract.methods.name().call();
      let symbol = await contract.methods.symbol().call();
      let owner = await contract.methods.ownerOf(id).call();
      
      let data = {id: id, name: name, symbol: symbol, owner: owner}
      console.log(data);

      // Build a row for each result with the token details built from the metadata
      // for the MVP, just list the tokenID, but add in details pulled from json metadata
      // make an ajax request for the partial...
      let response = await $.ajax({
        type: "GET", 
        url: "/listings/display_token",
        data: data,
        success: function(data, textStatus, jqXHR){},
        error: function(jqXHR, textStatus, errorThrown){console.log(errorThrown)}
      });

      bindCreateButton(response);

      // Let the user select the token they want to sell
      // Bind each entry to the createListing method via onClick?

    }    
  }
  GetUserTokens();

  const bindCreateButton = data => {
    var results = JSON.parse(data.split('results = ')[1]);
    var listingButton = document.querySelector(results['buttonSelector']);
    
    listingButton.addEventListener("click", createListing, false);
  }
});

async function createListing() {
  //NFT token + contract details
  let uniqueId = this.dataset.uniqueId;
  let tokenId = this.dataset.tokenId;
  let contractName = this.dataset.contractName;

  // User defined price
  let priceField = "#listing-price-input" + uniqueId;
  let price = Number(document.querySelector(priceField).value);

  // Approve the metamarket contract as a transfer agent for the NFT
  let accounts = await web3.eth.getAccounts();
  let approval = await contract.methods.approve(metaMarketContract._address, tokenId).send({from: accounts[0]});

  //Create the listing
  let result = await metaMarketContract.methods.createListing(abiSet[contractName].contractAddress, tokenId, price).send({from: accounts[0], gas: 1000000}).then(console.log);

  //redirect to the listings/show page.
};
