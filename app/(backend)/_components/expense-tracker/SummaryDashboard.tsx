"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Doc } from "@/convex/_generated/dataModel";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface SummaryDashboardProps {
  categories: Doc<"budgetCategories">[];
  transactions: Doc<"transactions">[];
}

export function SummaryDashboard({
  categories,
  transactions,
}: SummaryDashboardProps) {
  const calculateTotal = (type: string, field: "planned" | "actual") => {
    const typeCats = categories.filter((c) => c.type === type);
    if (field === "planned") {
      return typeCats.reduce((acc, c) => acc + c.plannedAmount, 0);
    } else {
      if (type === "expense") {
        return transactions.reduce((acc, t) => {
          const cat = typeCats.find(c => c._id === t.categoryId);
          return acc + (cat ? t.amount : 0);
        }, 0);
      }
      return typeCats.reduce((acc, c) => acc + (c.actualAmount ?? 0), 0);
    }
  };

  const summary = [
    { name: "INCOME", planned: calculateTotal("income", "planned"), actual: calculateTotal("income", "actual") },
    { name: "EXPENSE", planned: calculateTotal("expense", "planned"), actual: calculateTotal("expense", "actual") },
    { name: "BILLS", planned: calculateTotal("bills", "planned"), actual: calculateTotal("bills", "actual") },
    { name: "DEBT", planned: calculateTotal("debt", "planned"), actual: calculateTotal("debt", "actual") },
    { name: "SAVINGS", planned: calculateTotal("savings", "planned"), actual: calculateTotal("savings", "actual") },
  ];

  const actualIncome = summary[0].actual;
  const actualExpenses = summary.slice(1).reduce((acc, s) => acc + s.actual, 0);
  const actualMoneyLeft = actualIncome - actualExpenses;

  const plannedIncome = summary[0].planned;
  const plannedExpenses = summary.slice(1).reduce((acc, s) => acc + s.planned, 0);
  const budgetLeft = plannedIncome - plannedExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  const moneyLeftData = [
    { name: "Spent", value: actualExpenses },
    { name: "Balance", value: Math.max(0, actualMoneyLeft) },
  ];

  const budgetLeftData = [
    { name: "Planned Spent", value: plannedExpenses },
    { name: "Remaining", value: Math.max(0, budgetLeft) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="shadow-sm border-black overflow-hidden flex flex-col p-0 gap-0 py-0">
        <CardHeader className="bg-slate-50 p-1.5 border-b border-black">
          <CardTitle className="text-2xl font-bold text-center text-slate-500 uppercase tracking-wider">Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent h-6 border-black border-b-0">
                <TableHead className="h-6 px-3 text-[9px] font-semibold text-black uppercase">Category</TableHead>
                <TableHead className="h-6 px-3 text-[9px] font-semibold text-black uppercase text-right">Planned</TableHead>
                <TableHead className="h-6 px-3 text-[9px] font-semibold text-black uppercase text-right">Actual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.map((s) => (
                <TableRow key={s.name} className="h-7 last:border-0 hover:bg-transparent">
                  <TableCell className="py-0 px-3 text-[10px] font-bold text-slate-700">{s.name}</TableCell>
                  <TableCell className="py-0 px-3 text-[10px] text-right font-bold text-black">{formatCurrency(s.planned)}</TableCell>
                  <TableCell className="py-0 px-3 text-[10px] text-right font-bold text-black">{formatCurrency(s.actual)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-black flex flex-col bg-white overflow-hidden p-0 gap-0 py-0">
        <CardHeader className="bg-slate-50 p-1.5 border-b border-black">
          <CardTitle className="text-2xl font-bold text-center text-slate-500 uppercase tracking-wider">Budget Left</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col items-center justify-center relative pb-4">
          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetLeftData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={0}
                  startAngle={90}
                  endAngle={450}
                  stroke="none"
                  dataKey="value"
                >
                  <Cell fill="#ef4444" /> {/* Spent: Red */}
                  <Cell fill="#3b82f6" /> {/* Remaining: Blue */}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2 h-[180px]">
            <span className="text-xl font-bold text-slate-900">{formatCurrency(budgetLeft)}</span>
          </div>
          <div className="flex gap-4 px-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-slate-600">Left</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-slate-600">Spent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-black flex flex-col bg-white overflow-hidden p-0 gap-0 py-0">
        <CardHeader className="bg-slate-50 p-1.5 border-b border-black">
          <CardTitle className="text-2xl font-bold text-center text-slate-500 uppercase tracking-wider">Actual Money Left</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col items-center justify-center relative pb-4">
          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moneyLeftData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={0}
                  startAngle={90}
                  endAngle={450}
                  stroke="none"
                  dataKey="value"
                >
                  <Cell fill="#ef4444" /> {/* Spent: Red */}
                  <Cell fill="#3b82f6" /> {/* Balance: Blue */}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2 h-[180px]">
            <span className="text-xl font-bold text-slate-900">{formatCurrency(actualMoneyLeft)}</span>
          </div>
          <div className="flex gap-4 px-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-slate-600">Balance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-slate-600">Spent</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
