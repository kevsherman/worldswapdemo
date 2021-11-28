import MetaMaskOnboarding from "@metamask/onboarding"

$(function() {
  console.log( "ready!" );

  const forwarderOrigin = 'http://127.0.0.1:7545';
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin }); //We create a new MetaMask onboarding object to use in our app
  const connectButton = document.querySelector('.connectMetamask');  // Add event listener to 'Connect Metamask' button
  let { ethereum } = window;  //Destructuring assignment: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const

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
    // debugger;
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
});


// DONE 1. detect the presence of MetaMask, 
// DONE 2. connect to the current account, 

// x. select asset from metamask wallet to sell
// https://blog.etereo.io/how-to-read-the-balance-of-your-metamask-wallet-with-web3-js-6d4c4c364225


// 3. display information from your smart contract, 
// 4. submit a transaction to your contract, 
// 5. monitor the state of the transaction, 
// 6. and update the frontend interface