import { ethers } from "ethers";
import React, { useState } from "react";
import Modal from "react-responsive-modal";
import FormField from "./FormField";
import { usePolyverseContext } from "../context/Auth";

interface Props {
  onClose: () => void;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: () => void;
  modalOpen: boolean;
}

const Fund = ({ onClose, openModal, setModalOpen, modalOpen }: Props) => {
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const {mint} = usePolyverseContext()

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAddress(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(event.target.value);
  };

  const handleFormSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
     await mint(inputAmount)
  };

  return (
    <Modal open={modalOpen} onClose={onClose} center>
      <h2>Add Funds</h2>
      <form onSubmit={handleFormSubmit}>
        <FormField
          title="Address"
          value={inputAddress}
          handleChange={handleAddressChange}
          isInput
        />
        <FormField
          title="Amount"
          value={inputAmount}
          handleChange={handleAmountChange}
          isInput
        />
        <button className="border-2 border-blue-700 px-6 py-1.5 rounded-full text-[#000] mt-6 items-center justify flex font-medium text-[16px]">
          Submit
        </button>
      </form>
    </Modal>
  );
};

export default Fund;
