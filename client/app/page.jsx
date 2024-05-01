"use client";

import { useState, useEffect, useContext } from "react";
import abi from "../../artifacts/contracts/Handle.sol/HandleRegistry.json"
import { BrowserProvider, Contract } from "ethers";

import IPFS from "./components/ipfs";
import Registration from "./components/handleRegistry";
import UI from "./UI";
import { handleContext } from "@/context/context";

export default function Home() {

  const {state, setState} = useContext(handleContext); 
  
  const [account, setAccount] = useState("Not connected");

  useEffect(() => {
    const template = async() => {
      const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      const contractABI = await abi.abi;

      //Metamask
      try {
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts"
        })
        // window.ethereum.on("accountsChanged", () => {
        //   window.location.reload();
        // })
        setAccount(account);
        const browserProvider = new BrowserProvider(ethereum); // to read the blockchain
        const signer = await browserProvider.getSigner(); // to write on the blockchain
        const contract = new Contract(contractAddress, contractABI, signer)
        console.log(contract);
        setState({browserProvider, signer, contract});
        // console.log(state);
      } catch (error) {
        alert(error);
      }
    }
    template();
  }, [])

  return (
    <>
      {/* <Registration state={state} /> */}
      <UI />
    </>
  );
}

