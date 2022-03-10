import React, { useState, useEffect } from "react";
import { fromHexString, principalToAccountAddressArray} from './utils.jsx';
import {idlFactory as ledgerIDL} from './candid/ledger.did.js';
import { Actor, HttpAgent } from "@dfinity/agent";
import { Button, Input, message } from "antd";
import "./App.css"

const App = () => {
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState(null);
  const [principal, setPrincipal] = useState("")
  const [loading, setLoading] = useState(false)
  
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
    if(ledger == null){
      message.info("Please wait for the ledger actor to be created")
    }
    setLoading(true)
    let address
    if(principal.length == 64){
      address = fromHexString(principal)
    } else {
      try{
        address = principalToAccountAddressArray(principal, 0);
      } catch (err) {
        message.error("Please check your principal/canisterID")
        setLoading(false)
        return
      }
    }
    var args = {'account' : address};

    var icpBalance = await ledger.account_balance(args);
    var numICPBalance = parseInt(icpBalance.e8s);
    setBalance(numICPBalance);
    setLoading(false)
  };

  function handleChange(e){
    setPrincipal(e.target.value)
  };


  return (
    <div className="App">
      <meta name="twitter:card" content="123" />
      <meta name="twitter:site" content="ZimHook" />
      <meta name="twitter:title" content="Top 10 Things Ever" />
      <meta name="twitter:description" content="HHHHHHHHHHH" />
      <meta name="twitter:creator" content="@ZimHook" />
      <meta name="twitter:image" content="https://storageapi.fleek.co/zimhook-team-bucket/SHIKU/rc-upload-1646823800475-125cea30c461da3b74.jpg" />
      <meta name="twitter:domain" content="YourDomain.com"></meta>
      <h2 className="content">
        Principal/CanisterID/Address : <Input className="input" onChange={handleChange}></Input>
        <br/> 
        ICP Balance : {balance/100000000} 
        <br/> 
        <Button loading={loading} type="primary" onClick={getICPBanlance}>
          Query Balance
        </Button>
      </h2>
    </div>
  );
};

export default App;