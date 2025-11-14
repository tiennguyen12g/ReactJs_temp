import React, { useState } from "react";
import { Select, SelectGray, Dropdown } from "@tnbt-style-custom";
export default function SelectExample() {
  const [country, setCountry] = useState<string>("");
  return (
    <div className="flex gap-3">
      <Select value={country} onChange={setCountry} className="w-120" options={selectData} />
      <SelectGray value={country} onChange={setCountry} className="w-120" options={selectData} />
      <Dropdown label="Actions" items={["Edit", "Delete", "Share"]} onSelect={(item) => console.log(item)} />
    </div>
  );
}
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
