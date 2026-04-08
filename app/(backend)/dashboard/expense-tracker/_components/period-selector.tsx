"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function PeriodSelector({ 
  month, 
  year, 
  onMonthChange, 
  onYearChange 
}: { 
  month: number; 
  year: number; 
  onMonthChange: (m: number) => void; 
  onYearChange: (y: number) => void; 
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  return (
    <div className="flex gap-3 items-center">
      <Select value={month.toString()} onValueChange={(val) => val && onMonthChange(parseInt(val))}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m, index) => (
            <SelectItem key={index} value={(index + 1).toString()}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year.toString()} onValueChange={(val) => val && onYearChange(parseInt(val))}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
