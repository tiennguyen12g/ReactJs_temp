import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  label: string;
  items: string[];
  onSelect: (item: string) => void;
  className?: string;
}

export default function Dropdown({ label, items, onSelect, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <button 
        onClick={() => setOpen(!open)} 
        className="px-4 py-2 rounded-lg bg-gradient-to-tr from-orange-400 via-orange-500 to-red-500 hover:from-orange-500 hover:via-orange-600 hover:to-red-600 text-white font-semibold shadow-md transition active:scale-95"
      >
        {label}
      </button>

      {open && (
        <div className="absolute mt-2 w-40 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg shadow-xl z-[200] overflow-hidden">
          {items.map((item) => (
            <div
              key={item}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              className="px-4 py-2 text-gray-900 cursor-pointer hover:bg-gradient-to-r hover:from-orange-200 hover:to-orange-300 transition font-medium"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
{
  /*<Dropdown label="Actions" items={["Edit", "Delete", "Share"]} onSelect={(item) => console.log(item)} /> */
}
