"use client";

import { useState, useEffect } from "react";
import { getOrCreateBudgetPeriod, getBudgetDashboardData } from "../_actions/budget-actions";
import { PeriodSelector } from "./period-selector";
import { SummaryDashboard } from "./summary-dashboard";
import { BudgetGrid } from "./budget-grid";
import { TransactionTable } from "./transaction-table";
import { Loader2 } from "lucide-react";

type DashboardData = {
  id: string;
  month: number;
  year: number;
  creditCardLimit: number;
  subCategories: any[];
  transactions: any[];
};

export function ExpenseDashboardClient() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const period = await getOrCreateBudgetPeriod(month, year);
        if (!period) throw new Error("Failed to create period");
        const data = await getBudgetDashboardData(period.id);
        setDashboardData(data as DashboardData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [month, year]);

  const refreshData = async () => {
    if (dashboardData) {
      const data = await getBudgetDashboardData(dashboardData.id);
      setDashboardData(data);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paisa Kidar gaya BC</h1>
          <p className="text-xs text-muted-foreground">Monthly Budget in CAD</p>
        </div>
        <PeriodSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : (
        dashboardData && (
          <div className="flex flex-col gap-5">
            <SummaryDashboard data={dashboardData} onDataChange={refreshData} />
            <BudgetGrid data={dashboardData} onDataChange={refreshData} />
            <TransactionTable data={dashboardData} onDataChange={refreshData} />
          </div>
        )
      )}
    </div>
  );
}
