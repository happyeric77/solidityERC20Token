
import { useEffect, useRef} from "react";
import getWeb3 from "./getWeb3";
import myTokenJson from "./contracts/myToken.json";
import myTokenSaleJson from "./contracts/MyTokenSale.json";
import kycContractJson from "./contracts/KycContract.json";


function App() {
  const accounts = useRef();
  const myToken = useRef();
  const myTokenSale = useRef();
  const kycContract = useRef();
  const kycWhitelistRef = useRef();
  const contractOwner = useRef();

  useEffect(()=>{
    try {
      (async () =>{
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        accounts.current = await web3.eth.getAccounts();
        
        myToken.current = new web3.eth.Contract(
          myTokenJson.abi,
          myTokenJson.networks[networkId] && myTokenJson.networks[networkId].address
        );

        myTokenSale.current = new web3.eth.Contract(
          myTokenSaleJson.abi,
          myTokenSaleJson.networks[networkId] && myTokenSaleJson.networks[networkId].address
        );
        
        kycContract.current = new web3.eth.Contract(
          kycContractJson.abi,
          kycContractJson.networks[networkId] && kycContractJson.networks[networkId].address
        );
        contractOwner.current = await kycContract.current.methods.owner().call()
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

  return (
    <div className="App">
      <h1> ColorfulLife Token Sale</h1>
      <h2> KYC whitelisting</h2>
      Address allowed: <input type="text" name="kycaddress" placeholder="0x..." ref={kycWhitelistRef}/>
      <button onClick={handleKyc}>Submit</button>
    </div>
  );
}

export default App;
