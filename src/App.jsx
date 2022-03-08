import React, { useState, useEffect } from "react";
import { principalToAccountAddress, principalToAccountAddressArray, to32bits} from './utils.jsx';
import {idlFactory as ledgerIDL} from './candid/ledger.did.js';
import { Actor, HttpAgent } from "@dfinity/agent";
import { Button, Input, message } from "antd";
import { AuthClient } from "@dfinity/auth-client";

const App = () => {
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState(null);
  const [principal, setPrincipal] = useState("")
  
  useEffect(async () => {
    let anonymousAgent = new HttpAgent({ ...{ host: 'https://boundary.ic0.app/' } });
    if (process.env.NODE_ENV !== 'production') {
      await anonymousAgent.fetchRootKey();
    }
    let ledger = await Actor.createActor(ledgerIDL, {
      agent: anonymousAgent,
      canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    });
    setLedger(ledger)
    message.success("Ledger ready, you can query balance now.")
  }, []);

  async function getICPBanlance(){

    let address = principalToAccountAddressArray(principal, 0);

    var args = {'account' : address};

    var icpBalance = await ledger.account_balance(args);
    console.log(icpBalance);
    console.log(icpBalance.e8s);
    var numICPBalance = parseInt(icpBalance.e8s);
    console.log(numICPBalance);
    setBalance(numICPBalance);
  };

  function handleChange(e){
    setPrincipal(e.target.value)
  };


  return (
    <div>
      <h2>
        Principal/CanisterID : <Input onChange={handleChange}></Input>
        <br/> 
        ICP balance : {balance/100000000} 
        <Button type="primary" onClick={getICPBanlance}>
          query balance
        </Button>
      </h2>
    </div>
  );
};

export default App;