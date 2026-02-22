"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface BudgetTableProps {
  title: string;
  type: "income" | "expense" | "bills" | "savings" | "debt";
  periodId: Id<"budgetPeriods">;
  categories: Doc<"budgetCategories">[];
  colorClass: string;
  transactions?: Doc<"transactions">[];
  month: string;
  year: number;
}

import { AmountInput } from "./AmountInput";

export function BudgetTable({
  title,
  type,
  periodId,
  categories,
  colorClass,
  transactions = [],
  month,
  year,
}: BudgetTableProps) {
  const addCategory = useMutation(api.budget.addCategory);
  const updateCategory = useMutation(api.budget.updateCategory).withOptimisticUpdate(
    (localStore, args) => {
      const currentData = localStore.getQuery(api.budget.getPeriodData, { month, year });
      if (currentData) {
        localStore.setQuery(api.budget.getPeriodData, { month, year }, {
          ...currentData,
          categories: currentData.categories.map((c) =>
            c._id === args.id ? { ...c, ...args } : c
          ),
        });
      }
    }
  );
  const removeCategory = useMutation(api.budget.removeCategory);

  const filteredCategories = categories.filter((c) => c.type === type).map(cat => {
    if (type === "expense") {
      const actual = transactions
        .filter(t => t.categoryId === cat._id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...cat, actualAmount: actual };
    }
    return cat;
  });

  const totals = filteredCategories.reduce(
    (acc, c) => {
      acc.planned += c.plannedAmount;
      acc.actual += c.actualAmount ?? 0;
      return acc;
    },
    { planned: 0, actual: 0 }
  );

  const handleAdd = async () => {
    await addCategory({
      periodId,
      type,
      name: "",
      plannedAmount: 0,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={`p-2 font-bold text-center text-white ${colorClass}`}>
        {title.toUpperCase()}
      </div>
      <Table className="border">
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent h-7">
            <TableHead className="h-7 px-3 text-[10px] font-semibold text-slate-500">CATEGORY</TableHead>
            <TableHead className="h-7 px-3 text-[10px] font-semibold text-slate-500 text-right">PLANNED</TableHead>
            <TableHead className="h-7 px-3 text-[10px] font-semibold text-slate-500 text-right uppercase">ACTUAL</TableHead>
            {(type === "bills" || type === "debt") && (
              <TableHead className="h-7 px-3 text-[10px] font-semibold text-slate-500 text-center w-10">PAID</TableHead>
            )}
            <TableHead className="h-7 w-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((cat) => (
            <TableRow key={cat._id} className="h-8 border-slate-100 last:border-0 hover:bg-slate-50/50">
              <TableCell className="p-0 border-r border-slate-100 last:border-0">
                <Input
                  value={cat.name}
                  onChange={(e) =>
                    updateCategory({ id: cat._id, name: e.target.value })
                  }
                  className="h-8 border-none focus:ring-0 focus-visible:ring-0 text-[11px] font-medium"
                  placeholder="Category..."
                />
              </TableCell>
              <TableCell className="p-0 border-r border-slate-100 last:border-0">
                <AmountInput
                  value={cat.plannedAmount}
                  onChange={(val) =>
                    updateCategory({
                      id: cat._id,
                      plannedAmount: val,
                    })
                  }
                  className="h-8 text-right border-none focus:ring-0 focus-visible:ring-0 text-[11px]"
                />
              </TableCell>
              <TableCell className="p-0 border-r border-slate-100 last:border-0">
                {type === "expense" ? (
                  <div className="h-8 flex items-center justify-end px-3 text-[11px] font-bold text-slate-900">
                    {formatCurrency(cat.actualAmount ?? 0)}
                  </div>
                ) : (
                  <AmountInput
                    value={cat.actualAmount ?? 0}
                    onChange={(val) =>
                      updateCategory({
                        id: cat._id,
                        actualAmount: val,
                      })
                    }
                    className="h-8 text-right border-none focus:ring-0 focus-visible:ring-0 text-[11px] font-bold"
                  />
                )}
              </TableCell>
              {(type === "bills" || type === "debt") && (
                <TableCell className="p-0 text-center border-r border-slate-100 last:border-0">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={cat.isPaid}
                      onCheckedChange={(checked) =>
                        updateCategory({ id: cat._id, isPaid: !!checked })
                      }
                      className="scale-75"
                    />
                  </div>
                </TableCell>
              )}
              <TableCell className="p-0 text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-300 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => removeCategory({ id: cat._id })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-slate-50 font-bold h-8 border-t border-slate-200">
            <TableCell className="px-3 text-[11px] text-slate-700 uppercase tracking-tight">TOTAL</TableCell>
            <TableCell className="px-3 text-right text-[11px] text-slate-600 font-medium">
              {formatCurrency(totals.planned)}
            </TableCell>
            <TableCell className="px-3 text-right text-[11px] text-slate-900 font-bold uppercase">
              {formatCurrency(totals.actual)}
            </TableCell>
            {(type === "bills" || type === "debt") && <TableCell className="border-l border-slate-100" />}
            <TableCell className="p-0 text-center border-l border-slate-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                onClick={handleAdd}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
