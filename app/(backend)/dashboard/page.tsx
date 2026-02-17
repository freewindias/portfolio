"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import ContributionChart from "../_components/contribution-chart";
import { SummaryDashboard } from "../_components/expense-tracker/SummaryDashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear + i);

export default function Page() {
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(currentYear);

  const getOrCreatePeriod = useMutation(api.budget.getOrCreatePeriod);
  const data = useQuery(api.budget.getPeriodData, { 
    month, 
    year 
  });

  useEffect(() => {
    getOrCreatePeriod({ month, year });
  }, [month, year, getOrCreatePeriod]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="border border-black p-3 shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 py-0">
          <CardTitle className="text-2xl font-bold tracking-tight">Financial Summary</CardTitle>
          <div className="flex gap-2">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[130px] h-8 text-xs border-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
              <SelectTrigger className="w-[90px] h-8 text-xs border-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y: number) => (
                  <SelectItem key={y} value={y.toString()} className="text-xs">{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {data && <SummaryDashboard categories={data.categories} transactions={[]} />}
        </CardContent>
      </Card>
      
      <div className="border border-black p-3 shadow-none bg-transparent rounded-lg">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Github Activity</h2>
        <ContributionChart />
      </div>
    </div>
  )
}
