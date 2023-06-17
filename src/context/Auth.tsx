import React, { useContext, createContext, useState, useEffect } from "react";
import {
  RuntimeConnector,
  Extension,
  WALLET,
} from "@dataverse/runtime-connector";
import {
  Polyverse,
  PolyverseABI,
  PolyverseToken,
  SubscriptionContract,
} from "../constant/Filecoin";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { returnContract } from "../hooks";
import { ethers } from "ethers";
import { CIDString } from "web3.storage";
import { toast } from "react-toastify";

interface TradeVerseNode {
  children: React.ReactNode;
}

interface PolyverseContextType {
  addCreator: (
    data: CIDString | undefined,
    amount: ethers.BigNumber
  ) => Promise<void>;
  createPlan: (_name: string, amount: ethers.BigNumber) => Promise<void>;
  mint: (amount: number) => Promise<void>;
  userBalance: string;
}

const PolyverseContext = createContext<PolyverseContextType | null>(null);

export const PolyverseProvider = ({ children }: TradeVerseNode) => {
  const address = useAddress()
  const [userBalance, setUserBalance] = useState("");
  const runtimeConnector = new RuntimeConnector(Extension);

  //const { contract } = useContract();
  const polyverse = returnContract(Polyverse);
  const PolyverseSubscription = returnContract(SubscriptionContract);
  const Token = returnContract(PolyverseToken);

  const { mutateAsync: addCreator } = useContractWrite(polyverse, "addCreator");

  const createCreator = async (
    _creatorData: CIDString | undefined,
    _subscriptionFee: ethers.BigNumber
  ) => {
    try {
      const data = await addCreator({ args: [_creatorData, _subscriptionFee] });
      console.info("contract call successs", data);
    } catch (error) {
      alert(error);
    }
  };

  const { mutateAsync: createPlan } = useContractWrite(
    PolyverseSubscription,
    "createPlan"
  );

  const createAPlan = async (_name: string, amount: ethers.BigNumber) => {
    try {
      const data = await createPlan({ args: [_name, amount] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const mintPVToken = async (amount: number) => {
    try {
      const price = amount * 0.09;
      const data = await Token?.call(
        "mint", // Name of your function as it is on the smart contract
        [amount],
        {
          value: ethers.utils.parseEther(price.toString()), // send 0.1 ether with the contract call
        }
      );
      toast.success("PVT token minted sucessfully");
      console.info("contract call successs", data);
    } catch (err) {
      toast.error("Pvt mint failed");
      console.error("contract call failure", err);
    }
  };

  const getUserBalance = async () => {
    try {
      const data = await Token?.call(
        "getUserBalance", // Name of your function as it is on the smart contract
        [address]
      );
      console.info("contract call successs", data);
      setUserBalance(data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  useEffect(() => {
    getUserBalance();
  }, [address]);

  return (
    <PolyverseContext.Provider
      value={{
        addCreator: createCreator,
        createPlan: createAPlan,
        mint: mintPVToken,
        userBalance,
      }}
    >
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
