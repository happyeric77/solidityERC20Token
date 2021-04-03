
import { useEffect, useRef} from "react";
import getWeb3 from "./getWeb3";
import myTokenJson from "./contracts/myToken.json";
import myTokenSaleJson from "./contracts/MyTokenSale.json";
import kycContractJson from "./contracts/KycContract.json";


function App() {
  const web3 = useRef();
  const accounts = useRef();
  const myToken = useRef();
  const myTokenSale = useRef();
  const kycContract = useRef();
  const kycWhitelistRef = useRef();
  const contractOwner = useRef();
  const tokenSaleAddrRef = useRef();
  const balanceRef = useRef();
  const tokenAmountRef = useRef();

  useEffect(()=>{
    try {
      (async () =>{
        web3.current = await getWeb3();
        const networkId = await web3.current.eth.net.getId();
        accounts.current = await web3.current.eth.getAccounts();
        
        myToken.current = new web3.current.eth.Contract(
          myTokenJson.abi,
          myTokenJson.networks[networkId] && myTokenJson.networks[networkId].address
        );

        myTokenSale.current = new web3.current.eth.Contract(
          myTokenSaleJson.abi,
          myTokenSaleJson.networks[networkId] && myTokenSaleJson.networks[networkId].address
        );
        
        kycContract.current = new web3.current.eth.Contract(
          kycContractJson.abi,
          kycContractJson.networks[networkId] && kycContractJson.networks[networkId].address
        );

        contractOwner.current = await kycContract.current.methods.owner().call()
        displayBalance()     
        eventListener()
      })()
      
    } catch (err) {
      console.log(err)
    }
  },[])

  async function handleKyc(evt) {
    await kycContract.current.methods.setKeyCompleted(kycWhitelistRef.current.value).send({from: accounts.current[0]})
    const ok = await kycContract.current.methods.kycStatus(kycWhitelistRef.current.value).call()
    if (ok) { alert(`KYC of ${kycWhitelistRef.current.value} has been set.`)} else {alert("Fail: App.handleKyc")}
  }

  async function handleBuyTokenAddress() {
    const networkId = await web3.current.eth.net.getId();
    tokenSaleAddrRef.current.innerHTML = "Address: " + myTokenSaleJson.networks[networkId].address
  }

  async function displayBalance() {
    const balance = await myToken.current.methods.balanceOf(accounts.current[0]).call()
    balanceRef.current.innerHTML = "Your CLF balance: " + balance
  }

  async function eventListener() {
    myToken.current.events.Transfer({filter: {to: accounts.current[0]}}).on("data", (data)=>{
      alert(`Received ${data.returnValues.value} from ${data.returnValues.from}`)
      displayBalance()
    })
  }

  async function handleBuyToken() {
    const amount = tokenAmountRef.current.value;
    const networkId = await web3.current.eth.net.getId();
    web3.current.eth.sendTransaction({from: accounts.current[0], to: myTokenSaleJson.networks[networkId].address, value: amount})
  }

  return (
    <div className="App">
      <h1> ColorfulLife Token Sale </h1>
      <div ref={balanceRef}></div>

      <h2> KYC whitelisting</h2>
      Address allowed: <input type="text" name="kycaddress" placeholder="0x..." ref={kycWhitelistRef}/>
      <button onClick={handleKyc}>Submit</button> 

      <h2>Buy Token</h2>
      <div>
        <h3>Buy Token by sending wei to contract</h3>
        <button onClick={handleBuyTokenAddress}>Click to get address</button>
        <div ref={tokenSaleAddrRef}>Address: </div>
        <h3>Or</h3>
        <input ref={tokenAmountRef} placeholder="In wei" />
        <button onClick={handleBuyToken}> Buy </button>
      </div>
    </div>
  );
}

export default App;
