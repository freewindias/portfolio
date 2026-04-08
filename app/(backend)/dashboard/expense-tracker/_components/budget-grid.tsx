"use client";

import { BudgetTable, PrimaryCategory } from "./budget-table";

const CATEGORIES: PrimaryCategory[] = ["Income", "Debt", "Bills", "Savings", "Debit", "Credit"];

interface BudgetGridProps {
  data: any;
  onDataChange: () => void;
}

export function BudgetGrid({ data, onDataChange }: BudgetGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {CATEGORIES.map((cat) => (
        <BudgetTable
          key={cat}
          category={cat}
          periodId={data.id}
          subCategories={data.subCategories ?? []}
          transactions={data.transactions ?? []}
          onDataChange={onDataChange}
        />
      ))}
    </div>
  );
}
