import React, { useState } from "react";
import {
  TableWithDragColumn,
  TableWithResizeColumn,
  TableCommon,
  Select,
  Dropdown,
  Input,
  Search,
  SelectGray,
  ButtonBorderGradient,
  GradientButton,
} from "./style_components/StyleComponents";
import { type TableHeader } from "./style_components/tables/TableWithDragColumn";
import TestSeriUi from "./components/ui/Test";
import { DeleteIcon, EditIcon, CloseIcon } from "./style_components/CommonIcons";
import { FaUserCircle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

export default function Test() {
  const [selected, setSelected] = useState<any[]>([]);
  const handleGetSelected = (data: any[]) => {
    console.log("data", data);
    setSelected(data);
  };
  const [country, setCountry] = useState<string>("");
  const [email, setEmail] = useState();
  const [value, setValue] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const handleSearch = (value: any) => {
    console.log("value", value);
  };
  const performSearch = (value: any) => {
    console.log("value", value);
  };
  return (
    <div>
      {/* Header */}
      <div className="flex gap-1 mx-3 my-2">
        <DeleteIcon size={30} className="text-[#fdb7b7] hover:text-[#f01c1c]" />
        <EditIcon size={30} className="text-[#fdb7b7] hover:text-[#f01c1c]" />
        <CloseIcon size={30} className="text-[#fdb7b7] hover:text-[#f01c1c]" />
        <CloseIcon size={30} className="text-orange-500 hover:text-orange-700" />
      </div>
      <TestSeriUi />
      <h3 className="text-[26px] font-[700]">5. Table</h3>
      <Select value={country} onChange={setCountry} className="w-120" options={selectData} />
      <SelectGray value={country} onChange={setCountry} className="w-120" options={selectData} />
      <Dropdown label="Actions" items={["Edit", "Delete", "Share"]} onSelect={(item) => console.log(item)} />
      <h3 className="text-[26px] font-[700]">5. My custom button</h3>
      <div>
        
        <ButtonBorderGradient variant="purpleBlue">Purple</ButtonBorderGradient>
        <ButtonBorderGradient variant="cyanBlue">Purple</ButtonBorderGradient>
        <ButtonBorderGradient variant="greenBlue">Purple</ButtonBorderGradient>
        <ButtonBorderGradient variant="purplePink">Purple</ButtonBorderGradient>
        <ButtonBorderGradient variant="tealLime">Purple</ButtonBorderGradient>
        <ButtonBorderGradient variant="redYellow">Purple</ButtonBorderGradient>
      </div>
      <div>
        // Custom gradients with hover effect
<GradientButton variant="purple">Purple Button</GradientButton>
<GradientButton variant="orange">Orange Button</GradientButton>
<GradientButton variant="blue">Blue Button</GradientButton>

// Tailwind variants
<GradientButton variant="purpleBlue">Purple to Blue</GradientButton>
<GradientButton variant="cyanBlue">Cyan to Blue</GradientButton>
        <GradientButton variant="greenBlue">Purple</GradientButton>
        <GradientButton variant="purplePink">Purple</GradientButton>
        <GradientButton variant="tealLime">Purple</GradientButton>
        <GradientButton variant="redYellow">Purple</GradientButton>
      </div>
      <h3 className="text-[26px] font-[700]">5. Search</h3>
      // Basic usage
      <Search placeholder="Search..." onSearch={(value) => console.log("Searching:", value)} />
      // Controlled with custom debounce
      <Search value={searchTerm} onChange={setSearchTerm as any} onSearch={handleSearch} debounceMs={300} fullWidth />
      <h3 className="text-[26px] font-[700]">5.Input</h3>
      // Basic usage
      <Input placeholder="Enter your name" onChange={(value) => console.log(value)} />
      // With debounce
      <Input
        placeholder="Search..."
        onDebounceChange={(value) => {
          // This fires 500ms after user stops typing
          performSearch(value);
        }}
        debounceMs={900}
      />
      // With label and error
      <Input label="Email" type="email" value={email} onChange={setEmail as any} error={"jhgjg"} required />
      // With icons
      <Input leftIcon={<FaUserCircle />} rightIcon={<FaCheck />} placeholder="Username" />
      // With clear button
      <Input showClearButton placeholder="Type something..." onChange={setValue as any} />
            <h3 className="text-[26px] font-[700]">5. Table</h3>
            <TableCommon 
            data={commonTableData} 
            pageSize={5} 
            initialColumnWidths={{0: "150px", 1: "260px", 2: "140px"}}
            />
      <div className="overflow-hidden rounded-lg border border-gray-300 z-[11] my-[10px]">
        <TableWithResizeColumn
          data={tableData}
          stickyColumns={[0, 1, 2]} // make first and second columns sticky
          initialColumnWidths={{ 0: "180px", 1: "260px", 2: "140px" }}
          cellPadding="px-4 py-2"
          maxHeight="480px"
          pageSize={5}
          onSelectionChange={(ids) => handleGetSelected(ids)}
        />
      </div>
      {/* Using div wrap table to hide the scroll bar display outside of table when apply border radius for table */}
      <div className="overflow-hidden rounded-lg border border-gray-300 z-[11] my-[10px]">
        <TableWithDragColumn
          data={tableData}
          stickyColumns={[0, 1, 2]} // make first and second columns sticky
          initialColumnWidths={{ 0: "180px", 1: "260px", 2: "140px" }}
          cellPadding="px-4 py-2"
          maxHeight="480px"
          pageSize={5}
          isShowPagination={true}
          onSelectionChange={(ids) => handleGetSelected(ids)}
        />
      </div>
    </div>
  );
}
const data = {
  header: ["Name", "Email", "Role", "Status", "Created"],
  rows: [
    ["Tien", "tien@example.com", "Owner", "Active", "2025-01-01"],
    ["John", "john@example.com", "User", "Pending", "2025-02-21"],
    ["Lisa", "lisa@example.com", "Admin", "Active", "2025-03-10"],

    ["Tien", "tien@example.com", "Owner", "Active", "2025-01-01"],
    ["John", "john@example.com", "User", "Pending", "2025-02-21"],
    ["Lisa", "lisa@example.com", "Admin", "Active", "2025-03-10"],
    ["Tien", "tien@example.com", "Owner", "Active", "2025-01-01"],
    ["John", "john@example.com", "User", "Pending", "2025-02-21"],
    ["Lisa", "lisa@example.com", "Admin", "Active", "2025-03-10"],
    ["Tien", "tien@example.com", "Owner", "Active", "2025-01-01"],
    ["John", "john@example.com", "User", "Pending", "2025-02-21"],
    ["Lisa", "lisa@example.com", "Admin", "Active", "2025-03-10"],
    ["Tien", "tien@example.com", "Owner", "Active", "2025-01-01"],
    ["John", "john@example.com", "User", "Pending", "2025-02-21"],
    ["Lisa", "lisa@example.com", "Admin", "Active", "2025-03-10"],
  ],
  // optional row ids (if you want persistent stable ids)
  // rowIds: ["r1","r2","r3", ...]
};
const commonTableData = {
    headers: [
    { key: "name", label: "Name", sticky: true,width:120, align: "center" },
    { key: "role", label: "Role", width: 120, align: "right" },
    { key: "status", label: "Status", width: 120, align: "left" },
    { key: "age", label: "Age", width: 80 },
    { key: "birthday", label: "Birthday", width: 140 },
    { key: "company", label: "Company", width: 200 },
  ] as TableHeader[],
  rows: [
        {
      id: "1",
      name: "John Doe",
      role: "Owner",
      status: "Active",
      age: 34,
      birthday: "1990-01-12",
      company: "Acme Inc.",
      country: "USA",
      phone: "+1 555-1203",
      relationship: "Married",
      email: "john.doe@example.com",
      address: "123 Silicon Valley, CA",
      joined: "2020-05-21",
    },
    {
      id: "2",
      name: "Alice Johnson",
      role: "User",
      status: "Pending",
      age: 29,
      birthday: "1995-07-08",
      company: "Meta Labs",
      country: "Canada",
      phone: "+1 444-8811",
      relationship: "Single",
      email: "alice.j@example.com",
      address: "44 Toronto Ave",
      joined: "2022-10-10",
    },
    {
      id: "3",
      name: "Mike Smith",
      role: "Admin",
      status: "Active",
      age: 41,
      birthday: "1983-03-17",
      company: "TikVision",
      country: "Germany",
      phone: "+49 103-3344",
      relationship: "Married",
      email: "mike.smith@example.com",
      address: "99 Berlin Street",
      joined: "2019-08-12",
    },
  ]
}
export const tableData = {
  headers: [
    { key: "select", label: "", type: "checkbox", sticky: true, width: 50 },
    { key: "name", label: "Name", sticky: true, width: 160, align: "center" },
    { key: "role", label: "Role", width: 120 },
    { key: "status", label: "Status", width: 120 },
    { key: "age", label: "Age", width: 80 },
    { key: "birthday", label: "Birthday", width: 140 },
    { key: "company", label: "Company", width: 200 },
    { key: "country", label: "Country", width: 140 },
    { key: "phone", label: "Phone", width: 160 },
    { key: "relationship", label: "Relationship", width: 160 },
    { key: "email", label: "Email", width: 240 },
    { key: "address", label: "Address", width: 260 },
    { key: "joined", label: "Joined Date", width: 140 },
  ] as TableHeader[],

  rows: [
    {
      id: "1",
      name: "John Doe",
      role: "Owner",
      status: "Active",
      age: 34,
      birthday: "1990-01-12",
      company: "Acme Inc.",
      country: "USA",
      phone: "+1 555-1203",
      relationship: "Married",
      email: "john.doe@example.com",
      address: "123 Silicon Valley, CA",
      joined: "2020-05-21",
    },
    {
      id: "2",
      name: "Alice Johnson",
      role: "User",
      status: "Pending",
      age: 29,
      birthday: "1995-07-08",
      company: "Meta Labs",
      country: "Canada",
      phone: "+1 444-8811",
      relationship: "Single",
      email: "alice.j@example.com",
      address: "44 Toronto Ave",
      joined: "2022-10-10",
    },
    {
      id: "3",
      name: "Mike Smith",
      role: "Admin",
      status: "Active",
      age: 41,
      birthday: "1983-03-17",
      company: "TikVision",
      country: "Germany",
      phone: "+49 103-3344",
      relationship: "Married",
      email: "mike.smith@example.com",
      address: "99 Berlin Street",
      joined: "2019-08-12",
    },
    {
      id: "4",
      name: "Emma Watson",
      role: "Supervisor",
      status: "Pending",
      age: 31,
      birthday: "1993-11-22",
      company: "FutureTech",
      country: "UK",
      phone: "+44 220-2211",
      relationship: "Engaged",
      email: "emma.w@example.com",
      address: "Ampere Rd, London",
      joined: "2021-02-03",
    },
    {
      id: "5",
      name: "Bruce Wayne",
      role: "VIP",
      status: "Active",
      age: 38,
      birthday: "1986-09-15",
      company: "Wayne Enterprises",
      country: "USA",
      phone: "+1 999-1010",
      relationship: "Single",
      email: "bruce.w@example.com",
      address: "Wayne Manor, Gotham",
      joined: "2018-01-01",
    },
    {
      id: "6",
      name: "John Doe",
      role: "Owner",
      status: "Active",
      age: 34,
      birthday: "1990-01-12",
      company: "Acme Inc.",
      country: "USA",
      phone: "+1 555-1203",
      relationship: "Married",
      email: "john.doe@example.com",
      address: "123 Silicon Valley, CA",
      joined: "2020-05-21",
    },
    {
      id: "7",
      name: "Alice Johnson",
      role: "User",
      status: "Pending",
      age: 29,
      birthday: "1995-07-08",
      company: "Meta Labs",
      country: "Canada",
      phone: "+1 444-8811",
      relationship: "Single",
      email: "alice.j@example.com",
      address: "44 Toronto Ave",
      joined: "2022-10-10",
    },
    {
      id: "8",
      name: "Mike Smith",
      role: "Admin",
      status: "Active",
      age: 41,
      birthday: "1983-03-17",
      company: "TikVision",
      country: "Germany",
      phone: "+49 103-3344",
      relationship: "Married",
      email: "mike.smith@example.com",
      address: "99 Berlin Street",
      joined: "2019-08-12",
    },
    {
      id: "9",
      name: "Emma Watson",
      role: "Supervisor",
      status: "Pending",
      age: 31,
      birthday: "1993-11-22",
      company: "FutureTech",
      country: "UK",
      phone: "+44 220-2211",
      relationship: "Engaged",
      email: "emma.w@example.com",
      address: "Ampere Rd, London",
      joined: "2021-02-03",
    },
    {
      id: "10",
      name: "Bruce Wayne",
      role: "VIP",
      status: "Active",
      age: 38,
      birthday: "1986-09-15",
      company: "Wayne Enterprises",
      country: "USA",
      phone: "+1 999-1010",
      relationship: "Single",
      email: "bruce.w@example.com",
      address: "Wayne Manor, Gotham",
      joined: "2018-01-01",
    },
    {
      id: "11",
      name: "John Doe",
      role: "Owner",
      status: "Active",
      age: 34,
      birthday: "1990-01-12",
      company: "Acme Inc.",
      country: "USA",
      phone: "+1 555-1203",
      relationship: "Married",
      email: "john.doe@example.com",
      address: "123 Silicon Valley, CA",
      joined: "2020-05-21",
    },
    {
      id: "12",
      name: "Alice Johnson",
      role: "User",
      status: "Pending",
      age: 29,
      birthday: "1995-07-08",
      company: "Meta Labs",
      country: "Canada",
      phone: "+1 444-8811",
      relationship: "Single",
      email: "alice.j@example.com",
      address: "44 Toronto Ave",
      joined: "2022-10-10",
    },
    {
      id: "13",
      name: "Mike Smith",
      role: "Admin",
      status: "Active",
      age: 41,
      birthday: "1983-03-17",
      company: "TikVision",
      country: "Germany",
      phone: "+49 103-3344",
      relationship: "Married",
      email: "mike.smith@example.com",
      address: "99 Berlin Street",
      joined: "2019-08-12",
    },
    {
      id: "14",
      name: "Emma Watson",
      role: "Supervisor",
      status: "Pending",
      age: 31,
      birthday: "1993-11-22",
      company: "FutureTech",
      country: "UK",
      phone: "+44 220-2211",
      relationship: "Engaged",
      email: "emma.w@example.com",
      address: "Ampere Rd, London",
      joined: "2021-02-03",
    },
    {
      id: "15",
      name: "Bruce Wayne",
      role: "VIP",
      status: "Active",
      age: 38,
      birthday: "1986-09-15",
      company: "Wayne Enterprises",
      country: "USA",
      phone: "+1 999-1010",
      relationship: "Single",
      email: "bruce.w@example.com",
      address: "Wayne Manor, Gotham",
      joined: "2018-01-01",
    },
  ],
};

const selectData = [
  { key: "vn", label: "Vietnam" },
  { key: "us", label: "USA" },
  { key: "jp", label: "Japan" },
  { key: "vn1", label: "Vietnam" },
  { key: "us1", label: "USA" },
  { key: "jp1", label: "Japan" },
  { key: "vn2", label: "Vietnam" },
  { key: "us2", label: "USA" },
  { key: "jp2", label: "Japan" },
  { key: "vn3", label: "Vietnam" },
  { key: "us3", label: "USA" },
  { key: "jp3", label: "Japan" },
];
