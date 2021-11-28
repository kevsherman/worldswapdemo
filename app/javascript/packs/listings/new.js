//ToDo: Ensure wallet connected, etc

$(function() {
  const GetUserTokens = async () => {
    const forwarderOrigin = 'http://127.0.0.1:7545'; //set local/testnet/mainnet connection
    let web3 = new Web3(forwarderOrigin);

    //import ABI and contractAddress for each supported token (currently only WorldSwapToken)
    //IN the future, loop through all supported tokens and check wallet for existance
    const abiSet = require('../contract_abis');
    let abi = abiSet[0].abi
    let contractAddress = abiSet[0].contractAddress
    const contract = new web3.eth.Contract(abi, contractAddress); 

    let accounts = await web3.eth.getAccounts();
    let balance = await contract.methods.balanceOf(accounts[0]).call()
    
    // Loop through the tokens for the account and ...
    for(var i = 0; i < Number(balance); i++) {
      let id = await contract.methods.tokenOfOwnerByIndex(accounts[0], i).call();
      let name = await contract.methods.name().call();
      let symbol = await contract.methods.symbol().call();
      
      let data = {id: id, name: name, symbol: symbol}
      console.log(data);

      // Build a row for each result with the token details built from the metadata
      // for the MVP, just list the tokenID, but add in details pulled from json metadata
      // make an ajax request for the partial...
      $.ajax({
        type: "GET", 
        url: "/listings/display_token",
        data: data,
        success: function(data, textStatus, jqXHR){console.log(data)},
        error: function(jqXHR, textStatus, errorThrown){console.log(errorThrown)}
      });

      // Let the user select the token they want to sell
      // Bind each entry to the createListing method?
      

    }    

  }
  GetUserTokens();
});