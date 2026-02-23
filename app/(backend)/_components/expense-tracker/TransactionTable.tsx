"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Plus, Trash2 } from "lucide-react";
import { AmountInput } from "./AmountInput";

interface TransactionTableProps {
  periodId: Id<"budgetPeriods">;
  categories: Doc<"budgetCategories">[];
  transactions: Doc<"transactions">[];
  month: string;
  year: number;
}

export function TransactionTable({
  periodId,
  categories,
  transactions,
  month,
  year,
}: TransactionTableProps) {
  const addTransaction = useMutation(api.transactions.addTransaction);
  const updateTransaction = useMutation(api.transactions.updateTransaction).withOptimisticUpdate(
    (localStore, args) => {
      const currentData = localStore.getQuery(api.budget.getPeriodData, { month, year });
      if (currentData) {
        localStore.setQuery(api.budget.getPeriodData, { month, year }, {
          ...currentData,
          transactions: currentData.transactions.map((t) =>
            t._id === args.id ? { ...t, ...args } : t
          ),
        });
      }
    }
  );
  const removeTransaction = useMutation(api.transactions.removeTransaction);

  const handleAdd = async () => {
    if (categories.length === 0) return;
    await addTransaction({
      periodId,
      date: new Date().toISOString().split("T")[0],
      categoryId: categories[0]._id,
      amount: 0,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="p-2 font-bold text-center text-white bg-red-600">
        TRANSACTION
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">DATE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead className="text-right w-32">AMOUNT</TableHead>
            <TableHead>NOTES</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t._id}>
              <TableCell className="p-1">
                <Input
                  type="date"
                  value={t.date}
                  onChange={(e) =>
                    updateTransaction({ id: t._id, date: e.target.value })
                  }
                  className="h-8 border-none focus:ring-1"
                />
              </TableCell>
              <TableCell className="p-1">
                <Select
                  value={t.categoryId}
                  onValueChange={(val) =>
                    updateTransaction({ id: t._id, categoryId: val as Id<"budgetCategories"> })
                  }
                >
                  <SelectTrigger className="h-8 border-none focus:ring-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="p-1">
                <AmountInput
                  value={t.amount}
                  onChange={(val) =>
                    updateTransaction({
                      id: t._id,
                      amount: val,
                    })
                  }
                  className="h-8 text-right border-none focus:ring-1"
                />
              </TableCell>
              <TableCell className="p-1">
                <Input
                  value={t.notes || ""}
                  onChange={(e) =>
                    updateTransaction({ id: t._id, notes: e.target.value })
                  }
                  className="h-8 border-none focus:ring-1"
                  placeholder="Notes..."
                />
              </TableCell>
              <TableCell className="p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeTransaction({ id: t._id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={5} className="p-1 text-center">
              <Button
                variant="ghost"
                className="w-full h-8 text-muted-foreground"
                onClick={handleAdd}
                disabled={categories.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Transaction
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
