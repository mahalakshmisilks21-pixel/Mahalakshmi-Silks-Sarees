"use client";

import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    dark?: boolean;
    className?: string;
    dateFormat?: string;
    isClearable?: boolean;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
    dark = false,
    className = "",
    dateFormat = "dd-MM-yyyy",
    isClearable = false,
    ...props
}: DatePickerProps) {
    const dateValue = value ? (typeof value === "string" ? new Date(value) : value) : null;

    const handleChange = (date: Date | null) => {
        if (onChange) {
            if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                onChange(`${year}-${month}-${day}`);
            } else {
                onChange("");
            }
        }
    };

    return (
        <ReactDatePicker
            selected={dateValue}
            onChange={handleChange}
            dateFormat={dateFormat}
            placeholderText={placeholder}
            isClearable={isClearable}
            className={`custom-datepicker-input ${dark ? "dark-mode" : "light-mode"} ${className}`}
            calendarClassName="custom-datepicker-calendar"
            showPopperArrow={false}
            autoComplete="off"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            todayButton="Today"
            popperPlacement="bottom-start"
            popperProps={{ strategy: "fixed" }}
            {...props}
        />
    );
}
