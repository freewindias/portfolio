"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { createTransaction, deleteTransaction } from "../_actions/budget-actions";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const EXPENSE_CATEGORIES = ["Debt", "Bills", "Savings", "Debit", "Credit"];

const TABLE_LABELS: Record<string, string> = {
  Debt: "DEBT",
  Bills: "BILLS",
  Savings: "SAVINGS",
  Debit: "DEBIT",
  Credit: "CREDIT",
};

interface SubCategory {
  id: string;
  name: string;
  primaryCategory: string;
}

interface TransactionRow {
  id: string;
  subCategoryId: string;
  amount: number;
  description: string;
  date: string | Date;
}

interface Props {
  data: any;
  onDataChange: () => void;
}

export function TransactionTable({ data, onDataChange }: Props) {
  const subCategories: SubCategory[] = (data.subCategories ?? []).filter(
    (s: SubCategory) => EXPENSE_CATEGORIES.includes(s.primaryCategory)
  );

  const incomeIds = (data.subCategories ?? [])
    .filter((s: SubCategory) => s.primaryCategory === "Income")
    .map((s: SubCategory) => s.id);

  const transactions: TransactionRow[] = (data.transactions ?? []).filter(
    (t: TransactionRow) => !incomeIds.includes(t.subCategoryId)
  );

  /* ── Add row state ── */
  const [adding, setAdding] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [newSubCatId, setNewSubCatId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const getSubCat = (id: string) =>
    (data.subCategories ?? []).find((s: SubCategory) => s.id === id);

  const handleAdd = async () => {
    if (!newSubCatId) return toast.error("Select a category");
    const dollars = parseFloat(newAmount);
    if (!dollars || dollars <= 0) return toast.error("Enter a valid amount");

    setSaving(true);
    try {
      await createTransaction({
        periodId: data.id,
        subCategoryId: newSubCatId,
        amount: Math.round(dollars * 100),
        description: newNotes.trim() || "-",
        date: new Date(newDate + "T12:00:00"),
      });
      toast.success("Transaction added");
      setNewSubCatId("");
      setNewAmount("");
      setNewNotes("");
      setAdding(false);
      onDataChange();
    } catch {
      toast.error("Failed to add transaction");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success("Deleted");
      onDataChange();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="border border-border rounded-md overflow-hidden">
      {/* Red header */}
      <div className="bg-red-600 px-4 py-2.5 text-white text-center">
        <span className="text-xs font-bold uppercase tracking-widest">Transaction</span>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-3 py-2 font-medium text-muted-foreground uppercase text-[10px] tracking-wide">Date</th>
            <th className="text-left px-3 py-2 font-medium text-muted-foreground uppercase text-[10px] tracking-wide">Table</th>
            <th className="text-left px-3 py-2 font-medium text-muted-foreground uppercase text-[10px] tracking-wide">Category</th>
            <th className="text-right px-3 py-2 font-medium text-muted-foreground uppercase text-[10px] tracking-wide">Amount</th>
            <th className="text-left px-3 py-2 font-medium text-muted-foreground uppercase text-[10px] tracking-wide">Notes</th>
            <th className="w-6 px-1 py-2" />
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && !adding && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-muted-foreground italic">
                No transactions yet
              </td>
            </tr>
          )}

          {sorted.map((t) => {
            const sub = getSubCat(t.subCategoryId);
            const dateStr = new Date(t.date).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <tr key={t.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors group">
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{dateStr}</td>
                <td className="px-3 py-2.5 font-medium uppercase text-[10px] tracking-wide">
                  {sub ? (TABLE_LABELS[sub.primaryCategory] ?? sub.primaryCategory) : "—"}
                </td>
                <td className="px-3 py-2.5">{sub?.name ?? "—"}</td>
                <td className="px-3 py-2.5 text-right font-semibold">{formatCurrency(t.amount)}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{t.description === "-" ? "" : t.description}</td>
                <td className="px-1 py-2.5 text-center">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            );
          })}

          {/* Inline add row */}
          {adding && (
            <tr className="border-b border-border/40 bg-muted/10">
              <td className="px-2 py-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-transparent border-b border-border focus:outline-none text-xs px-0"
                />
              </td>
              <td className="px-2 py-2" colSpan={2}>
                <select
                  value={newSubCatId}
                  onChange={(e) => setNewSubCatId(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-b border-border focus:outline-none text-xs px-0"
                >
                  <option value="">Select category...</option>
                  {EXPENSE_CATEGORIES.map((cat) => {
                    const cats = subCategories.filter((s) => s.primaryCategory === cat);
                    if (!cats.length) return null;
                    return (
                      <optgroup key={cat} label={TABLE_LABELS[cat] || cat}>
                        {cats.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </td>
              <td className="px-2 py-2 text-right">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  className="w-20 bg-transparent border-b border-border focus:outline-none text-right text-xs px-0"
                />
              </td>
              <td className="px-2 py-2">
                <input
                  placeholder="Notes..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  className="w-full bg-transparent border-b border-border focus:outline-none text-xs px-0 placeholder:text-muted-foreground/50"
                />
              </td>
              <td className="px-2 py-2 text-center">
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="text-green-600 font-bold text-base leading-none hover:text-green-700"
                >
                  ✓
                </button>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t border-border bg-muted/10">
            <td colSpan={6} className="px-3 py-2 text-center">
              <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mx-auto text-xs"
              >
                <span className="text-base font-bold leading-none">+</span>
                Add Transaction
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
