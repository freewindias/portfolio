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
  salaryDay,
  hideSalaryDay,
  onMonthChange, 
  onYearChange,
  onSalaryDayChange
}: { 
  month: number; 
  year: number; 
  salaryDay: number;
  hideSalaryDay?: boolean;
  onMonthChange: (m: number) => void; 
  onYearChange: (y: number) => void; 
  onSalaryDayChange: (d: number) => void;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex gap-3 items-center">
      <div className="flex flex-col gap-1 items-start">
        <span className="text-[10px] font-medium text-muted-foreground uppercase ml-1">Month</span>
        <Select value={month.toString()} onValueChange={(val) => val && onMonthChange(parseInt(val))}>
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m, index) => (
              <SelectItem key={m} value={(index + 1).toString()}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 items-start">
        <span className="text-[10px] font-medium text-muted-foreground uppercase ml-1">Year</span>
        <Select value={year.toString()} onValueChange={(val) => val && onYearChange(parseInt(val))}>
          <SelectTrigger className="w-[90px] h-9">
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

      {!hideSalaryDay && (
        <div className="flex flex-col gap-1 items-start">
          <span className="text-[10px] font-medium text-muted-foreground uppercase ml-1">Sal. Day</span>
          <Select value={salaryDay.toString()} onValueChange={(val) => val && onSalaryDayChange(parseInt(val))}>
            <SelectTrigger className="w-[80px] h-9">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {days.map((d) => (
                <SelectItem key={d} value={d.toString()}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
