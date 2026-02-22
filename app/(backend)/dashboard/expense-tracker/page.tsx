"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { BudgetTable } from "@/app/(backend)/_components/expense-tracker/BudgetTable";
import { TransactionTable } from "@/app/(backend)/_components/expense-tracker/TransactionTable";
import { SummaryDashboard } from "@/app/(backend)/_components/expense-tracker/SummaryDashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear + i);

export default function ExpenseTrackerPage() {
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(currentYear);

  const getOrCreatePeriod = useMutation(api.budget.getOrCreatePeriod);
  const data = useQuery(api.budget.getPeriodData, { month, year });

  useEffect(() => {
    getOrCreatePeriod({ month, year });
  }, [month, year, getOrCreatePeriod]);

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { period, categories, transactions } = data;
  const expenseCategories = categories.filter(c => c.type === "expense");
  const expenseTransactions = transactions.filter(t => 
    expenseCategories.some(cat => cat._id === t.categoryId)
  );

  return (
    <div className="container mx-auto p-4 space-y-8 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paisa Kidar gaya BC</h1>
          <p className="text-muted-foreground">Monthly Budget in CAD</p>
        </div>
        <div className="flex gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[150px] border-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
            <SelectTrigger className="w-[100px] border-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <SummaryDashboard categories={categories} transactions={transactions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BudgetTable
          title="Income"
          type="income"
          periodId={period._id}
          categories={categories}
          colorClass="bg-violet-400"
          month={month}
          year={year}
        />
        <BudgetTable
          title="Debt"
          type="debt"
          periodId={period._id}
          categories={categories}
          colorClass="bg-red-600"
          month={month}
          year={year}
        />
        <BudgetTable
          title="Bills"
          type="bills"
          periodId={period._id}
          categories={categories}
          colorClass="bg-orange-400"
          month={month}
          year={year}
        />
        <BudgetTable
          title="Savings"
          type="savings"
          periodId={period._id}
          categories={categories}
          colorClass="bg-green-600"
          month={month}
          year={year}
        />
        <div className="lg:col-span-2">
           <BudgetTable
            title="Expense"
            type="expense"
            periodId={period._id}
            categories={categories}
            colorClass="bg-blue-400"
            transactions={transactions}
            month={month}
            year={year}
          />
        </div>
      </div>

      <TransactionTable
        periodId={period._id}
        categories={expenseCategories}
        transactions={expenseTransactions}
        month={month}
        year={year}
      />
    </div>
  );
}
