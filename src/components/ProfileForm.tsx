import React, { useState } from "react";
import FormField from "./FormField";
import { usePolyverseContext } from "../context/Auth";
import { pen, upload } from "../assets";
import { AiOutlineCamera } from "react-icons/ai";
import { useAddress } from "@thirdweb-dev/react";

const ProfileForm = () => {
  const address = useAddress();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { addCreator } = usePolyverseContext()
  const [profileImage, setProfileImage] = useState("")
  const [name, setName] = useState("")


  const category = [
    {
      title: "",
      value: "",
    },
    {
      title: "Creator",
      value: "Creator",
    },
    {
      title: "Follower",
      value: "Follower",
    },
  ];

  const handleImageUpload = async (e: any) => {
    e.preventDefault();
    addCreator("hhhgghgjg", 8)

  };

  return (
    <div className="max-w-[458px] rounded-[10px] items-center justify-center flex flex-col px-6 py-[10px] bg-[#fff]">
      {/* image upload */}
      <form action="" className="w-full">
        <div className="flex flex-col mt-[20px] space-y-4 items-center">
          <div className="relative cursor-pointer">
            <img src={upload} alt="upload" />

            <AiOutlineCamera
              size={25}
              className="absolute inset-9 text-white"
            />
          </div>

          <div className="flex cursor-pointer items-center space-x-[30px] ">
            <span className="text-[#3A3A3A] text-[18px] font-bold">
              {address?.slice(0, 9)}...
            </span>
            <img src={pen} alt="pen" />
          </div>
        </div>

        {/* form section */}
        <div className="flex  w-full  flex-wrap mt-[30px] item-center space-y-5">
          <FormField title="Profile Image" isFile />
          <FormField title="Name" isInput />
          <FormField title="Category" item={category} isCategory />
          <FormField title="Subscription Fee" type="number" isInput />
          <FormField title="Bio" isTextArea />
          <div className="flex items-center justify-center w-full">
            <button onClick={handleImageUpload} className="bg-gradient-to-r from-[#513EFF] to-[#52E5FF] px-8 py-2.5 rounded-full border border-black">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
