import React, { useContext, createContext, useState, useEffect } from "react";
import {
  RuntimeConnector,
  Extension,
  WALLET,
} from "@dataverse/runtime-connector";
import { Polyverse, PolyverseABI } from "../constant/Filecoin";
import { useContract, useContractWrite } from "@thirdweb-dev/react";

interface TradeVerseNode {
  children: React.ReactNode;
}

interface PolyverseContextType {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addCreator: (data: string, amount: number) => Promise<void>;
}

const PolyverseContext = createContext<PolyverseContextType | null>(null);

export const PolyverseProvider = ({ children }: TradeVerseNode) => {
  const [address, setAddress] = useState("");
  const runtimeConnector = new RuntimeConnector(Extension);
  
  const { contract } = useContract("0x2f40a1f04be1a7d87e3651AD23F62B97B14D9C57");
  const { mutateAsync: addCreator, isLoading } = useContractWrite(contract, "addCreator")

  const createCreator = async (_creatorData: string, _subscriptionFee: number) => {
    try {
      const data = await addCreator({ args: [_creatorData, _subscriptionFee] });
      console.info("contract call successs", data);
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
    <PolyverseContext.Provider value={{ address, setAddress, addCreator: createCreator}}>
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
