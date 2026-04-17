"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { updateBudgetPeriodSettings } from "@/app/(backend)/dashboard/expense-tracker/_actions/budget-actions";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_ORDER = ["Income", "Debit", "Credit", "Bills", "Debt", "Savings"] as const;

interface SubCategory { id: string; name: string; primaryCategory: string; plannedAmount: number; actualAmount: number; }
interface Transaction { id: string; subCategoryId: string; amount: number; }

function DonutStat({
  title,
  value,
  center,
  data,
  colors,
  legend,
  editable,
  onEdit,
}: {
  title: string;
  value?: string;
  center?: string;
  data: { name: string; value: number }[];
  colors: string[];
  legend: { label: string; color: string }[];
  editable?: boolean;
  onEdit?: () => void;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const safeData = total === 0 ? [{ name: "Empty", value: 1 }] : data;
  const safeColors = total === 0 ? ["#e5e7eb"] : colors;

  return (
    <div className="border border-border rounded-lg p-3 flex flex-col gap-2 min-h-[200px]">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {editable && (
          <button onClick={onEdit} className="text-muted-foreground hover:text-foreground transition-colors">
            <Pencil className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="flex-1 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={130}>
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={58}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {safeData.map((_, i) => (
                <Cell key={i} fill={safeColors[i % safeColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {center && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold">{center}</span>
          </div>
        )}
      </div>
      <div className="flex gap-3 justify-center">
        {legend.map((l) => (
          <span key={l.label} className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SummaryDashboard({ data, onDataChange }: { data: any; onDataChange: () => void }) {
  const [editingLimit, setEditingLimit] = useState(false);
  const [limitInput, setLimitInput] = useState("");
  const [availableLimitInput, setAvailableLimitInput] = useState("");
  const [saving, setSaving] = useState(false);

  const subCategories: SubCategory[] = data.subCategories ?? [];
  const transactions: Transaction[] = data.transactions ?? [];

  const getActual = (cat: string) => {
    const subs = subCategories.filter((s) => s.primaryCategory === cat);
    if (cat === "Income") {
      return subs.reduce((s, c) => s + (Number(c.actualAmount) || 0), 0);
    }
    const ids = subs.map((s) => s.id);
    return transactions.filter((t) => ids.includes(t.subCategoryId)).reduce((s, t) => s + t.amount, 0);
  };
  const getPlanned = (cat: string) =>
    subCategories.filter((s) => s.primaryCategory === cat).reduce((s, c) => s + c.plannedAmount, 0);

  const totalIncomePlanned = getPlanned("Income");
  const totalIncomeActual = getActual("Income");
  const totalExpensesPlanned = ["Debit", "Credit", "Bills", "Debt", "Savings"].reduce((s, c) => s + getPlanned(c), 0);
  const totalExpensesActual = ["Debit", "Credit", "Bills", "Debt", "Savings"].reduce((s, c) => s + getActual(c), 0);

  const budgetLeftPlanned = totalIncomePlanned - totalExpensesPlanned;
  const budgetLeftActual = totalIncomeActual - totalExpensesActual;

  const creditLimit = data.creditCardLimit ?? 0;
  const limitUsed = data.availableCreditLimit ?? 0; // Repurposing availableCreditLimit for limitUsed
  const creditActual = getActual("Credit");
  const totalCreditSpent = creditActual + limitUsed;
  const creditAvailable = Math.max(0, creditLimit - totalCreditSpent);

  const handleSaveLimit = async () => {
    const valLimit = parseFloat(limitInput);
    const valAvail = parseFloat(availableLimitInput);
    if (isNaN(valLimit) || valLimit < 0) return toast.error("Invalid total limit");
    
    setSaving(true);
    try {
      await updateBudgetPeriodSettings(data.id, { 
        creditCardLimit: Math.round(valLimit * 100),
        availableCreditLimit: isNaN(valAvail) ? 0 : Math.round(valAvail * 100)
      });
      toast.success("Credit settings updated");
      setEditingLimit(false);
      onDataChange();
    } catch {
      toast.error("Failed to update credit settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Summary Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/40 px-3 py-2 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-center text-muted-foreground">Summary</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-3 py-1.5 text-muted-foreground font-medium">Category</th>
              <th className="text-right px-2 py-1.5 text-muted-foreground font-medium">Planned</th>
              <th className="text-right px-3 py-1.5 text-muted-foreground font-medium">Actual</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORY_ORDER.map((cat) => (
              <tr key={cat} className="border-b border-border/30 last:border-0">
                <td className="px-3 py-1.5 uppercase text-muted-foreground font-medium text-[10px] tracking-wide">
                  {cat === "Debit" ? "Debit Exp." : cat === "Credit" ? "Credit Exp." : cat}
                </td>
                <td className="px-2 py-1.5 text-right font-medium">{formatCurrency(getPlanned(cat))}</td>
                <td className="px-3 py-1.5 text-right">{formatCurrency(getActual(cat))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Budget Left Donut */}
      <DonutStat
        title="Budget Left"
        center={formatCurrency(budgetLeftPlanned)}
        data={[
          { name: "Left", value: Math.max(0, budgetLeftPlanned) },
          { name: "Spent", value: totalExpensesPlanned },
        ]}
        colors={["#3b82f6", "#ef4444"]}
        legend={[{ label: "Left", color: "#3b82f6" }, { label: "Spent", color: "#ef4444" }]}
      />

      {/* Actual Money Left */}
      <DonutStat
        title="Actual Money Left"
        center={formatCurrency(budgetLeftActual)}
        data={[
          { name: "Balance", value: Math.max(0, budgetLeftActual) },
          { name: "Spent", value: totalExpensesActual },
        ]}
        colors={["#3b82f6", "#ef4444"]}
        legend={[{ label: "Balance", color: "#3b82f6" }, { label: "Spent", color: "#ef4444" }]}
      />

      {/* Credit Card Limit Donut */}
      {editingLimit ? (
        <div className="border border-border rounded-lg p-3 flex flex-col gap-2 min-h-[200px] items-center justify-center">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Credit Settings</h3>
          
          <div className="w-full flex flex-col gap-1">
            <label className="text-[9px] uppercase font-medium text-muted-foreground ml-1">Total Limit</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Total Limit"
              className="w-full border border-border rounded px-2 py-1 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              defaultValue={creditLimit > 0 ? (creditLimit / 100).toFixed(2) : ""}
              onChange={(e) => setLimitInput(e.target.value)}
              autoFocus
            />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label className="text-[9px] uppercase font-medium text-muted-foreground ml-1">Limit Used</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 300"
              className="w-full border border-border rounded px-2 py-1 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              defaultValue={limitUsed > 0 ? (limitUsed / 100).toFixed(2) : ""}
              onChange={(e) => setAvailableLimitInput(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-1">
            <button onClick={handleSaveLimit} disabled={saving} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90">
              <Check className="h-3 w-3" /> Save
            </button>
            <button onClick={() => setEditingLimit(false)} className="flex items-center gap-1 text-xs px-3 py-1.5 border border-border rounded hover:bg-muted">
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <DonutStat
          title="Credit Card Limit"
          center={formatCurrency(creditLimit)}
          data={[
            { name: "Available", value: creditAvailable },
            { name: "Spent", value: totalCreditSpent },
          ]}
          colors={["#3b82f6", "#ef4444"]}
          legend={[{ label: "Available", color: "#3b82f6" }, { label: "Spent", color: "#ef4444" }]}
          editable
          onEdit={() => { 
            setLimitInput((creditLimit / 100).toFixed(2)); 
            setAvailableLimitInput((limitUsed / 100).toFixed(2));
            setEditingLimit(true); 
          }}
        />
      )}
    </div>
  );
}
