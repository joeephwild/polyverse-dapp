import { CRYPTO_WALLET, Extension, Mode, RuntimeConnector } from "@dataverse/runtime-connector";
import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { usePolyverseContext } from "../context";

export function useWallet() {
/** Initialize the runtime connector class object */
const runtimeConnector = new RuntimeConnector(Extension);
  const [wallet, setWallet] = useState<CRYPTO_WALLET>();

  const selectWallet = async () => {
    const res = await getCurrentWallet();
    if (res?.wallet) {
      setWallet(res?.wallet);
      return res?.wallet;
    }
    const wallet = await runtimeConnector.selectWallet();
    setWallet(wallet);
    return wallet;
  };

  const connectWallet = async () => {
    let currentWallet;
    if (!wallet) {
      currentWallet = await selectWallet();
    } else {
      currentWallet = wallet;
    }
    const address = await runtimeConnector.connectWallet(currentWallet);
    return address;
  };

  const getCurrentWallet = async () => {
    const res = await runtimeConnector.getCurrentWallet();
    return res;
  };

  const switchNetwork = async (chainId: number) => {
    const res = await runtimeConnector.switchNetwork(chainId);
    return res;
  };

  const sign = async (params: { method: string; params: any[] }) => {
    const res = await runtimeConnector.sign(params);
    return res;
  };

  const contractCall = async (params: {
    contractAddress: string;
    abi: any[];
    method: string;
    params: any[];
    mode?: Mode | undefined;
  }) => {
    const res = await runtimeConnector.contractCall(params);
    return res;
  };

  // const ethereumRequest = async () => {
  //   const res = await runtimeConnector
  // }

  return {
    wallet,
    connectWallet,
    getCurrentWallet,
    switchNetwork,
    sign,
    contractCall,
  };
}
