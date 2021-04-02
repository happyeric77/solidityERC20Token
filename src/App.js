
import { useEffect} from "react";
import getWeb3 from "./getWeb3";

function App() {

  useEffect(()=>{
    try {
      (async () =>{
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
      })() 
    } catch (err) {
      console.log(err)
    }
  },[])


  return (
    <div className="App">
      Test
    </div>
  );
}

export default App;
