"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function Dropdown({ options, value, onChange, placeholder = "Select", className = "" }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-4 pr-2 py-2.5 border rounded-sm bg-white text-gray-800 border-gold-200 shadow-sm hover:bg-cream-50 focus:outline-none focus:border-maroon-400 transition-colors text-sm"
            >
                <span className="truncate">{selectedLabel}</span>
                <svg
                    className={`w-4 h-4 inline float-right mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9a7b4f"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <ul className="absolute z-50 w-full bg-white border border-gold-200 rounded-sm shadow-lg mt-1 py-1 max-h-56 overflow-y-auto">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors ${value === option.value
                                    ? "bg-maroon-700 text-white"
                                    : "text-gray-700 hover:bg-maroon-600 hover:text-white"
                                }`}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
