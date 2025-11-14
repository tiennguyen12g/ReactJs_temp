import React, { useState } from "react";
import ButtonBlurExample from "./examples/ButtonBlurExample";
import TestSeriUi from "./components/ui/Test";
import { DeleteIcon, EditIcon, CloseIcon } from "./style_components/CommonIcons";
import TableExample from "./style_components/tables/TableExample";
import InputExample from "./style_components/inputs/InputExample";
import SearchExample from "./style_components/searchs/SearchExample";
import SelectExample from "./style_components/selects/SelectExample";
import ButtonExample from "./style_components/buttons/ButtonExample";
import CommerceButton from "./components/ui/commerce";
import SuccessModalView from "./components/ui/success-modal";
import CustomModalExample from "./components/ui/custom_modals/CustomModalExample";
export default function Test() {
  return (
    <div>
      <h3 className="text-[26px] font-[700]">1. Modal</h3>
      <CustomModalExample />
      <TestSeriUi />
      <h3 className="text-[26px] font-[700]">4. Common button</h3>
      <div className="flex gap-1 mx-3 my-2">
        <DeleteIcon size={30} className="text-[#fdb7b7] hover:text-[#f01c1c]" />
        <EditIcon size={30} className="text-[#fdb7b7] hover:text-[#f01c1c]" />
        <CloseIcon size={30} className="text-red-300 hover:text-red-500" />
        <CloseIcon size={30} className="text-orange-500 hover:text-orange-700" />
      </div>
      <h3 className="text-[26px] font-[700]">5. Table</h3>
      <ButtonExample />
      <h3 className="text-[26px] font-[700] mt-8">6. Button Blur With Compatible Background(Glassmorphism)</h3>
      <ButtonBlurExample />
      <h3 className="text-[26px] font-[700]">7. Select + Dropdown</h3>
      <SelectExample />
      <h3 className="text-[26px] font-[700]">8. Search</h3>
      <SearchExample />
      <h3 className="text-[26px] font-[700]">9.Input</h3>
      <InputExample />
      <h3 className="text-[26px] font-[700]">10. Table</h3>
      <TableExample />
    </div>
  );
}
