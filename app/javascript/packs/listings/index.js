// const forwarderOrigin = "https://ropsten.infura.io/v3/78937ec9f4a346f6b68eefe92739eec5"; //set local/testnet/mainnet connection
// const web3 = new Web3(new Web3.providers.HttpProvider(forwarderOrigin));
const web3 = new Web3(window.ethereum);
const abiSet = require('../contract_abis');

//metaMarket contract
const metaMarketContract = new web3.eth.Contract(abiSet['MetaMarket'].abi, abiSet['MetaMarket'].contractAddress); 

$(function() {
  const GetListedTokens = async () => {
    // pull the list of all tokens from the MetaMarket account
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    let account = await window.ethereum.selectedAddress;
    let totalListings = await metaMarketContract.methods.totalListings().call();
    
    // Loop through the tokens for the account and ...
    for(var i = 1; i <= Number(totalListings); i++) {
      var data;
      var currentListing = await metaMarketContract.methods.listings(i).call();

      if(currentListing.seller.toLowerCase() == account){
        var contract = new web3.eth.Contract(abiSet['WorldSwapToken'].abi, abiSet['WorldSwapToken'].contractAddress); //update to fetch any contract type via the currentListing.tokenContractAddress
        var name = await contract.methods.name().call();
        var symbol = await contract.methods.symbol().call();
        data = {tokenId: currentListing.tokenContractId, name: name, symbol: symbol, price: currentListing.price };
     
        // make an ajax request to render the partial...
        let response = await $.ajax({
          type: "GET", 
          url: "/listings/display_token_for_sale",
          data: data,
          success: function(data, textStatus, jqXHR){console.log('success')},
          error: function(jqXHR, textStatus, errorThrown){console.log(errorThrown)}
        });
      }  
    }    
  }
  GetListedTokens(); 
});