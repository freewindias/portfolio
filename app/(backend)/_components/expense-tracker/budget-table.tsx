"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  createSubCategory,
  updateSubCategory,
  toggleSubCategoryPaid,
  deleteSubCategory,
} from "@/app/(backend)/_actions/budget-actions";
import { Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

export type PrimaryCategory =
  | "Income"
  | "Debt"
  | "Bills"
  | "Savings"
  | "Debit"
  | "Credit";

const HEADER_COLORS: Record<PrimaryCategory, string> = {
  Income: "bg-violet-500",
  Debt: "bg-red-600",
  Bills: "bg-orange-500",
  Savings: "bg-green-600",
  Debit: "bg-blue-500",
  Credit: "bg-indigo-500",
};

const CATEGORY_LABELS: Record<PrimaryCategory, string> = {
  Income: "INCOME",
  Debt: "DEBT",
  Bills: "BILLS",
  Savings: "SAVINGS",
  Debit: "DEBIT CARD EXPENSE",
  Credit: "CREDIT CARD EXPENSE",
};

interface SubCategory {
  id: string;
  name: string;
  plannedAmount: number;
  actualAmount: number;
  primaryCategory: string;
  paid: boolean;
}

interface Transaction {
  id: string;
  subCategoryId: string;
  amount: number;
}

interface BudgetTableProps {
  category: PrimaryCategory;
  periodId: string;
  subCategories: SubCategory[];
  transactions: Transaction[];
  onDataChange: () => void;
}

export function BudgetTable({
  category,
  periodId,
  subCategories,
  transactions,
  onDataChange,
}: BudgetTableProps) {
  const headerColor = HEADER_COLORS[category];
  const label = CATEGORY_LABELS[category];

  // Editing state per row
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPlanned, setEditPlanned] = useState("");
  const [editActualValue, setEditActualValue] = useState(""); // Only for Income

  const [saving, setSaving] = useState(false);

  const filtered = subCategories.filter((s) => s.primaryCategory === category);

  const getActual = (sub: SubCategory) => {
    if (category === "Income") return sub.actualAmount;
    return transactions
      .filter((t) => t.subCategoryId === sub.id)
      .reduce((s, t) => s + t.amount, 0);
  };

  const totalPlanned = filtered.reduce((s, c) => s + c.plannedAmount, 0);
  const totalActual = filtered.reduce((s, c) => s + getActual(c), 0);

  /* ── Inline edit ── */
  const startEdit = (sub: SubCategory) => {
    setEditingId(sub.id);
    setEditName(sub.name);
    setEditPlanned((sub.plannedAmount / 100).toString());
    if (category === "Income")
      setEditActualValue((sub.actualAmount / 100).toString());
  };

  const saveEdit = async (sub: SubCategory) => {
    try {
      const plannedCents = Math.round((parseFloat(editPlanned) || 0) * 100);
      const actualCents =
        category === "Income"
          ? Math.round((parseFloat(editActualValue) || 0) * 100)
          : undefined;

      const finalName = editName.trim() || sub.name || "New Category";

      await updateSubCategory(sub.id, plannedCents, finalName, actualCents);
      setEditingId(null);
      onDataChange();
    } catch {
      toast.error("Failed to update");
    }
  };

  /* ── Add new row ── */
  const handleAdd = async () => {
    setSaving(true);
    try {
      const res = await createSubCategory({
        periodId,
        primaryCategory: category,
        name: "", // Start empty so user can type
        plannedAmount: 0,
        actualAmount: 0,
      });

      if (res.success && res.id) {
        onDataChange();
        setEditingId(res.id);
        setEditName("");
        setEditPlanned("0");
        setEditActualValue("0");
      }
    } catch {
      toast.error("Failed to add");
    } finally {
      setSaving(false);
    }
  };

  /* ── Toggle paid ── */
  const handlePaid = async (id: string, current: boolean) => {
    try {
      await toggleSubCategoryPaid(id, !current);
      onDataChange();
    } catch {
      toast.error("Failed to update");
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id: string) => {
    try {
      await deleteSubCategory(id);
      onDataChange();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="border border-border rounded-md overflow-hidden">
      {/* Solid colored header */}
      <div className={`${headerColor} px-4 py-2.5 text-white text-center`}>
        <span className="text-xs font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-3 py-2 font-medium text-muted-foreground uppercase text-[10px] tracking-wide">
              Category
            </th>
            <th className="text-right px-3 py-2 font-medium text-muted-foreground uppercase text-[10px] tracking-wide">
              Planned
            </th>
            <th className="text-right px-3 py-2 font-medium text-muted-foreground uppercase text-[10px] tracking-wide">
              Actual
            </th>
            {["Debt", "Bills", "Savings"].includes(category) && (
              <th className="text-center px-2 py-2 font-medium text-muted-foreground uppercase text-[10px] tracking-wide">
                Paid
              </th>
            )}
            <th className="w-7 px-1 py-2" />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td
                colSpan={
                  ["Debt", "Bills", "Savings"].includes(category) ? 5 : 4
                }
                className="text-center text-muted-foreground py-4 text-xs italic"
              >
                No entries — click + to add
              </td>
            </tr>
          )}

          {filtered.map((sub) => {
            const actual = getActual(sub);
            const isEditing = editingId === sub.id;
            return (
              <tr
                key={sub.id}
                className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors group"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    saveEdit(sub);
                  }
                }}
              >
                {/* Name */}
                <td
                  className="px-3 py-2"
                  onClick={() => !isEditing && startEdit(sub)}
                >
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(sub)}
                      className="w-full bg-transparent border-b border-border focus:outline-none px-0"
                    />
                  ) : (
                    <span className="cursor-pointer">{sub.name}</span>
                  )}
                </td>

                {/* Planned */}
                <td
                  className="px-3 py-2 text-right"
                  onClick={() => !isEditing && startEdit(sub)}
                >
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editPlanned}
                      onChange={(e) => setEditPlanned(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(sub)}
                      className="w-20 bg-transparent border-b border-border focus:outline-none text-right px-0"
                    />
                  ) : (
                    <span className="cursor-pointer text-muted-foreground">
                      {(sub.plannedAmount / 100).toFixed(2)}
                    </span>
                  )}
                </td>

                {/* Actual */}
                <td
                  className="px-3 py-2 text-right"
                  onClick={() =>
                    !isEditing && category === "Income" && startEdit(sub)
                  }
                >
                  {isEditing && category === "Income" ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editActualValue}
                      onChange={(e) => setEditActualValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(sub)}
                      className="w-20 bg-transparent border-b border-border focus:outline-none text-right px-0"
                    />
                  ) : (
                    <span
                      className={`font-medium ${category === "Income" ? "cursor-pointer" : ""}`}
                    >
                      {formatCurrency(actual)}
                    </span>
                  )}
                </td>

                {/* Paid checkbox */}
                {["Debt", "Bills", "Savings"].includes(category) && (
                  <td className="px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={sub.paid}
                      onChange={() => handlePaid(sub.id, sub.paid)}
                      className="w-3.5 h-3.5 cursor-pointer accent-green-600"
                    />
                  </td>
                )}

                {/* Delete */}
                <td className="px-1 py-2 text-center">
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-border bg-muted/20">
            <td className="px-3 py-2 font-semibold uppercase text-[10px] tracking-wide text-muted-foreground">
              Total
            </td>
            <td className="px-3 py-2 text-right font-semibold text-muted-foreground">
              {formatCurrency(totalPlanned)}
            </td>
            <td className="px-3 py-2 text-right font-bold">
              {formatCurrency(totalActual)}
            </td>
            {["Debt", "Bills", "Savings"].includes(category) && (
              <td className="px-2 py-2" />
            )}
            <td className="px-1 py-2 text-center">
              <button
                onClick={handleAdd}
                disabled={saving}
                className="text-muted-foreground hover:text-foreground transition-colors font-bold text-base leading-none disabled:opacity-50"
                title="Add category"
              >
                +
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
