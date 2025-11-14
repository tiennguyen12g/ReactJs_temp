import React, { type SetStateAction } from "react";
import Modal from "../modal";
import { ButtonCommon } from "@/style_components/StyleComponents";
interface Props {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  content: string;
  size?: "md" | "sm" | "lg" | "xl";
  animation?: 'scale' | 'slide' | 'fade' | 'bounce';
  showCloseBtn?: boolean;

}
export default function CommonModal({ setIsOpen, isOpen, content, size = "md", animation= "scale", showCloseBtn = true }: Props) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal" size={size} animation={animation}>
        <p>{content}</p>
        <div className="w-full flex justify-center items-center mt-3"><ButtonCommon onClick={() => setIsOpen(false)}>Close</ButtonCommon></div>
      </Modal>
    </>
  );
}
