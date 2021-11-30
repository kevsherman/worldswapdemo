import MetaMaskOnboarding from "@metamask/onboarding"
//token contract
const abiSet = require('./contract_abis');
const abi = abiSet['WorldSwapToken'].abi
const contractAddress = abiSet['WorldSwapToken'].contractAddress


$(function() {
  console.log( "ready!" );
  const { ethereum } = window;  //Destructuring assignment: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
  const web3 = new Web3(ethereum) 
  const contract = new web3.eth.Contract(abi, contractAddress); 

  // const forwarderOrigin = 'http://127.0.0.1:7545';
  // const onboarding = new MetaMaskOnboarding({ forwarderOrigin }); //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding();
  const connectButton = document.querySelector('.connectMetamask');  // Add event listener to 'Connect Metamask' button
  
  //Check if the Metamask extension is installed:
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //This will start the onboarding proccess
  const onClickInstall = () => {
    connectButton.innerText = 'Onboarding in progress';
    connectButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' });
      connectButton.innerText = 'Metamask Connected!';
      connectButton.disabled = true;
    } catch (error) {
      console.error(error);
    }
  };

  //Now we check to see if MetaMask is installed:
  const MetaMaskClientCheck = () => {
    if (!isMetaMaskInstalled()) {
      connectButton.innerText = 'Click here to install MetaMask!'; //If it isn't installed we ask the user to click to install it
      connectButton.onclick = onClickInstall; //When the button is clicked we call this function
      connectButton.disabled = false; //The button is now disabled
    } else if (!ethereum.selectedAddress){
      connectButton.innerText = 'Connect'; //If it is installed we change our button text      
      connectButton.onclick = onClickConnect; //When the button is clicked we call this function to connect the users MetaMask Wallet      
      connectButton.disabled = false; //The button is now disabled
    } else {
      connectButton.innerText = 'Metamask Connected!';
      connectButton.disabled = true; // You're connected, so disable the button
    }
  };
  MetaMaskClientCheck();

  const onClickSwapToken = () => {
    contract.methods.awardToken(ethereum.selectedAddress, 'sometesturl').send({from: ethereum.selectedAddress}).then(console.log);
  }
  
  const getSwapTokenButton = document.querySelector('.getSwapToken');
  getSwapTokenButton.onclick = onClickSwapToken;
});