import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface SummaryDashboardProps {
  categories: Doc<"budgetCategories">[];
  transactions: Doc<"transactions">[];
}

export function SummaryDashboard({
  categories,
  transactions,
}: SummaryDashboardProps) {
  const settings = useQuery(api.settings.getSettings);
  const updateCreditSettings = useMutation(api.settings.updateCreditSettings);
  
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [limitInput, setLimitInput] = useState("");
  const [spentInput, setSpentInput] = useState("");

  const handleSaveLimit = async () => {
    const parsedLimit = parseFloat(limitInput);
    const parsedSpent = parseFloat(spentInput);
    
    await updateCreditSettings({ 
      limit: !isNaN(parsedLimit) ? parsedLimit : undefined,
      previousCreditSpent: !isNaN(parsedSpent) ? parsedSpent : undefined,
    });
    
    setIsEditingLimit(false);
  };
  const calculateTotal = (type: string, field: "planned" | "actual") => {
    let typeCats = categories.filter((c) => c.type === type);
    
    // Virtual "expense" type handles both debit and credit card expenses
    if (type === "expense") {
      typeCats = categories.filter((c) => 
        c.type === "debit card expense" || c.type === "credit card expense"
      );
    }
    
    if (field === "planned") {
      return typeCats.reduce((acc, c) => acc + c.plannedAmount, 0);
    } else {
      if (type === "expense" || type === "debit card expense" || type === "credit card expense") {
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
    { name: "DEBIT EXP.", planned: calculateTotal("debit card expense", "planned"), actual: calculateTotal("debit card expense", "actual") },
    { name: "CREDIT EXP.", planned: calculateTotal("credit card expense", "planned"), actual: calculateTotal("credit card expense", "actual") },
    { name: "BILLS", planned: calculateTotal("bills", "planned"), actual: calculateTotal("bills", "actual") },
    { name: "DEBT", planned: calculateTotal("debt", "planned"), actual: calculateTotal("debt", "actual") },
    { name: "SAVINGS", planned: calculateTotal("savings", "planned"), actual: calculateTotal("savings", "actual") },
  ];

  const actualIncome = summary[0].actual;
  const nonCreditExpenses = summary.filter(s => s.name !== "INCOME" && s.name !== "CREDIT EXP.");
  const actualExpenses = nonCreditExpenses.reduce((acc, s) => acc + s.actual, 0);
  const actualMoneyLeft = actualIncome - actualExpenses;

  const plannedIncome = summary[0].planned;
  const plannedExpenses = nonCreditExpenses.reduce((acc, s) => acc + s.planned, 0);
  const budgetLeft = plannedIncome - plannedExpenses;

  const plannedCredit = settings?.creditLimit || 0;
  const previousCreditSpent = settings?.previousCreditSpent || 0;
  const actualCreditTransactions = calculateTotal("credit card expense", "actual");
  const actualCreditSpent = actualCreditTransactions + previousCreditSpent;
  const availableCredit = plannedCredit - actualCreditSpent;

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

  const creditLeftData = [
    { name: "Spent", value: actualCreditSpent },
    { name: "Available", value: Math.max(0, availableCredit) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card className="shadow-sm border-black overflow-hidden flex flex-col p-0 gap-0 py-0">
        <CardHeader className="bg-slate-50 p-1.5 border-b border-black">
          <CardTitle className="text-xl font-bold text-center text-slate-500 uppercase tracking-wider">Summary</CardTitle>
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
          <CardTitle className="text-xl font-bold text-center text-slate-500 uppercase tracking-wider">Budget Left</CardTitle>
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
          <CardTitle className="text-xl font-bold text-center text-slate-500 uppercase tracking-wider">Actual Money Left</CardTitle>
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

      <Card className="shadow-sm border-black flex flex-col bg-white overflow-hidden p-0 gap-0 py-0">
        <CardHeader className="bg-slate-50 p-1.5 border-b border-black flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-center text-slate-500 uppercase tracking-wider flex-1">Credit Card Limit</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-slate-400 hover:text-slate-900"
            onClick={() => {
              setLimitInput((settings?.creditLimit || 0).toString());
              setSpentInput((settings?.previousCreditSpent || 0).toString());
              setIsEditingLimit(true);
            }}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </CardHeader>
        {isEditingLimit && (
           <div className="bg-slate-100 p-2 flex gap-2 border-b border-black items-center">
             <Input 
               type="number" 
               value={limitInput} 
               onChange={(e) => setLimitInput(e.target.value)}
               className="h-7 text-xs w-24"
               placeholder="Limit..."
             />
             <Input 
               type="number" 
               value={spentInput} 
               onChange={(e) => setSpentInput(e.target.value)}
               className="h-7 text-xs w-24"
               placeholder="Spent..."
             />
             <Button size="icon" className="h-7 w-7 bg-green-600 hover:bg-green-700" onClick={handleSaveLimit}>
               <Save className="h-3.5 w-3.5" />
             </Button>
             <Button size="icon" variant="outline" className="h-7 w-7 bg-white" onClick={() => setIsEditingLimit(false)}>
               <X className="h-3.5 w-3.5" />
             </Button>
           </div>
        )}
        <CardContent className="p-0 flex flex-col items-center justify-center relative pb-4">
          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={creditLeftData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={0}
                  startAngle={90}
                  endAngle={450}
                  stroke="none"
                  dataKey="value"
                >
                  <Cell fill="#ef4444" /> {/* Spent: Red */}
                  <Cell fill="#3b82f6" /> {/* Available: Blue */}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2 h-[180px]">
            <span className="text-xl font-bold text-slate-900">{formatCurrency(availableCredit)}</span>
          </div>
          <div className="flex gap-4 px-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-slate-600">Available</span>
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
