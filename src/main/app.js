import React, { useEffect, useState } from 'react';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import HDWalletProvider from "@truffle/hdwallet-provider"
import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3'
import { POSClient, use } from "@maticnetwork/maticjs"
import config from './config.json'
import MaticPoSClient from "@maticnetwork/maticjs";
import Network from "@maticnetwork/meta/network";
import Matic from "@maticnetwork/maticjs";

// install web3 plugin
use(Web3ClientPlugin)

const provider = window.ethereum

// 1. deploy contract to Polygon
// 2. Get ETH to Polygon - meaning ETHs are blocked and same number is minted on Polygon.
// 3. Burn Polygon tokens and unblock ETH
// 4. Deploy into Polygon Chain A mintable token contract on the Polygon chain or

const App = () => {
  
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
    // getPOSClient();
  }, []);
  
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [Networkid, setNetworkid] = useState(0);
  const [maticProvider, setMaticProvider] = useState();
  const [ethereumprovider, setEthereumProvider] = useState();
  
  // Interact with Metamask and load Network config.
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask! Install <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/related'>here</a>!"
      );
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    const maticProvider = new WalletConnectProvider({
      host: config.MATIC_RPC,
      callbacks: {
        onConnect: console.log("matic connected"),
        onDisconnect: console.log("matic disconnected!"),
      },
    });

    const ethereumProvider = new WalletConnectProvider({
      host: config.ETHEREUM_RPC,
      callbacks: {
        onConnect: console.log("mainchain connected"),
        onDisconnect: console.log("mainchain disconnected"),
      },
    });

    setMaticProvider(maticProvider);
    setEthereumProvider(ethereumProvider);

    const web3 = window.web3;
    
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    
    const networkId = await web3.eth.net.getId();
    setNetworkid(networkId);

    if (networkId === config.ETHEREUM_CHAINID) {
      setLoading(false);
    } else if (networkId === config.MATIC_CHAINID) {
      setLoading(false);
    } else {
      window.alert(" switch to  Matic or Ethereum network");
    }
  };


  const posClientParent = () => {
    const maticPoSClient = new MaticPoSClient({
      network: config.NETWORK,
      version: config.VERSION,
      maticProvider: maticProvider,
      parentProvider: window.web3,
      parentDefaultOptions: { from: account },
      maticDefaultOptions: { from: account },
    });
    return maticPoSClient;
  };
  // const deposit = () => {
  //   const result = await posClient.depositEther(100);
  //   const txHash = await result.getTransactionHash();
  //   const txReceipt = await result.getReceipt();
  // }

  // const burn = () => {
  //   const erc20Token = posClient.erc20("<token address>");
  //   // start withdraw process for 100 amount
  //   const result = await erc20Token.withdrawStart(100);
  //   const txHash = await result.getTransactionHash();
  //   const txReceipt = await result.getReceipt();
  // }

  // const exit = () => {
  //   // token address can be null for native tokens like ethereum or matic
  //   const erc20RootToken = posClient.erc20("<token address>", true);
  //   const result = await erc20Token.withdrawExit("<burn tx hash>");
  //   const txHash = await result.getTransactionHash();
  //   const txReceipt = await result.getReceipt();
  // }

  return(<div>
      <div>ETHVALUE</div>
      <div>
        <button>
          Deposit
        </button>
      </div>
      <div>polygonValue</div>
  </div>);
}

export default App;

