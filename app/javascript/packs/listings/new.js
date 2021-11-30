// const forwarderOrigin = "https://ropsten.infura.io/v3/78937ec9f4a346f6b68eefe92739eec5"; //set local/testnet/mainnet connection
// const web3 = new Web3(new Web3.providers.HttpProvider(forwarderOrigin));
const web3 = new Web3(window.ethereum) 
const abiSet = require('../contract_abis');

//token contract
const abi = abiSet['WorldSwapToken'].abi
const contractAddress = abiSet['WorldSwapToken'].contractAddress
const contract = new web3.eth.Contract(abi, contractAddress); 

//metaMarket contract
const metaMarketContract = new web3.eth.Contract(abiSet['MetaMarket'].abi, abiSet['MetaMarket'].contractAddress); 

$(function() {
  const GetUserTokens = async () => {
    // Import ABI and contractAddress for each supported token (currently only WorldSwapToken)
    // In the future, loop through all supported tokens and check wallet for existance
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    let account = await window.ethereum.selectedAddress;
    let balance = await contract.methods.balanceOf(account).call();
    
    // Loop through the tokens for the account and ...
    for(var i = 0; i < Number(balance); i++) {
      let id = await contract.methods.tokenOfOwnerByIndex(account, i).call();
      let name = await contract.methods.name().call();
      let symbol = await contract.methods.symbol().call();
      let owner = await contract.methods.ownerOf(id).call();
      
      let data = {id: id, name: name, symbol: symbol, owner: owner};
      console.log(data);

      // Build a row for each result with the token details built from the metadata
      // for the MVP, just list the tokenID, but add in details pulled from json metadata
      // make an ajax request for the partial...
      let response = await $.ajax({
        type: "GET", 
        url: "/listings/display_token_to_list",
        data: data,
        success: function(data, textStatus, jqXHR){},
        error: function(jqXHR, textStatus, errorThrown){console.log(errorThrown)}
      });
      bindCreateButton(response);
    }    
  }
  GetUserTokens(); 
});

const bindCreateButton = data => {
  var results = JSON.parse(data.split('results = ')[1]);
  var listingButton = document.querySelector(results['buttonSelector']);
  
  listingButton.addEventListener("click", createListing, false);
}

async function createListing() {
  //NFT token + contract details
  let uniqueId = this.dataset.uniqueId;
  let tokenId = this.dataset.tokenId;
  let contractName = this.dataset.contractName;

  // User defined price
  let priceField = "#listing-price-input" + uniqueId;
  let price = Number(document.querySelector(priceField).value);

  // Approve the metamarket contract as a transfer agent for the NFT
  let account = await window.ethereum.selectedAddress;
  console.log(account);
 
  console.log('processing approval...');
  await contract.methods.approve(metaMarketContract._address, tokenId).send({from: account, gas: 1000000}).then(console.log);

  //Create the listing
  console.log('creating the listing - will be redirected on success...');
  let result = await metaMarketContract.methods.createListing(abiSet[contractName].contractAddress, tokenId, price).send({from: account, gas: 1000000})
    .on('receipt', function(receipt){
      console.log(receipt);
      window.location.replace("/listings"); //redirect to listings index
    })
    .on('error', function(error, receipt) {
      alert(error);
    });
};
