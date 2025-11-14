import React, { type Dispatch, type SetStateAction } from "react";
import { ButtonCommon } from "@tnbt-style-custom";
import Modal from "../modal";
import { BsInfoCircleFill } from "react-icons/bs";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  content: string;
  modalType: "success" | "warning" | "info"
}

const iconsDesign = {
  success: (
    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
      <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  ),
  warning: (
    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-green-900/30">
      <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    </div>
  ),
  info: <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-green-900/30">
      <BsInfoCircleFill size={26} color="#0071ce" />
    </div>
  ,
};
export default function StatusModal({ setIsOpen, isOpen, content, modalType }: Props) {
  return (
    <>
      {/*  Message Modal (No Title) */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
        <div className="text-center space-y-4">
          {iconsDesign[modalType]}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{modalType.toUpperCase()}!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{content}</p>
          </div>

          <div className="flex justify-center items-center pt-2 w-full">
            <ButtonCommon onClick={() => setIsOpen(false)} variant="default" className="">
              Close
            </ButtonCommon>
          </div>
        </div>
      </Modal>
    </>
  );
}
