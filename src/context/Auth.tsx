import React, { useContext, createContext, useState, useEffect } from "react";
import {
  RuntimeConnector,
  Extension,
  WALLET,
} from "@dataverse/runtime-connector";
import { Polyverse, PolyverseABI } from "../constant/Filecoin";

interface TradeVerseNode {
  children: React.ReactNode;
}

interface PolyverseContextType {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  createCreator: (data: string, amount: number) => Promise<void>;
}

const PolyverseContext = createContext<PolyverseContextType | null>(null);

export const PolyverseProvider = ({ children }: TradeVerseNode) => {
  const [address, setAddress] = useState("");
  const runtimeConnector = new RuntimeConnector(Extension);

  useEffect(() => {
    const getAddress = async () => {
      const wallet = await runtimeConnector.connectWallet(WALLET.METAMASK);
      setAddress(wallet.address);
      await runtimeConnector.switchNetwork(314159);
      await runtimeConnector.checkCapability();
    };
    getAddress();
  }, []);

  const createCreator = async (data: string, amount: number) => {
    try {
      await runtimeConnector.connectWallet(WALLET.METAMASK);
      await runtimeConnector.contractCall({
        contractAddress: Polyverse,
        abi: PolyverseABI,
        method: "addCreator",
        params: [data, amount],
      });
    } catch (error) {
      alert(error);
    }
  };


  useEffect(() => {
    // Your initialization logic or API calls can be placed here
    // For example, fetching data from an API
    // Once you have the data, you can update the state using `setAddress`
    // setAddress(data);
  }, []);

  return (
    <PolyverseContext.Provider value={{ address, setAddress, createCreator }}>
      {children}
    </PolyverseContext.Provider>
  );
};

export const usePolyverseContext = (): PolyverseContextType => {
  const contextValue = useContext(PolyverseContext);
  if (contextValue === null) {
    throw new Error("useErrandContext must be used within a PolyverseProvider");
  }
  return contextValue;
};
