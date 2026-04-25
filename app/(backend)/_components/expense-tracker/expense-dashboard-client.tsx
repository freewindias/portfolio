"use client";

import { useState, useEffect } from "react";
import {
  getOrCreateBudgetPeriod,
  getBudgetDashboardData,
  updateBudgetPeriodSettings,
  deleteBudgetPeriod,
} from "@/app/(backend)/_actions/budget-actions";
import { PeriodSelector } from "./period-selector";
import { SummaryDashboard } from "./summary-dashboard";
import { BudgetGrid } from "./budget-grid";
import { TransactionTable } from "./transaction-table";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type DashboardData = {
  id: string;
  month: number;
  year: number;
  salaryDay: number;
  creditCardLimit: number;
  availableCreditLimit: number;
  subCategories: any[];
  transactions: any[];
};

export function ExpenseDashboardClient() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  const handleDeletePeriod = async () => {
    if (!dashboardData) return;
    if (
      !window.confirm(
        "Are you sure you want to delete all data for this month? This action cannot be undone.",
      )
    )
      return;

    setLoading(true);
    try {
      await deleteBudgetPeriod(dashboardData.id);
      toast.success("Period data deleted");
      // loadData will re-run or we can call it explicitly
      await loadData();
    } catch (error) {
      toast.error("Failed to delete period data");
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (dashboardData) {
      const data = await getBudgetDashboardData(dashboardData.id);
      setDashboardData(data as DashboardData);
    }
  };

  const handleSalaryDayChange = async (day: number) => {
    if (!dashboardData) return;
    try {
      await updateBudgetPeriodSettings(dashboardData.id, { salaryDay: day });
      refreshData();
    } catch (error) {
      console.error("Failed to update salary day", error);
    }
  };

  const getPeriodRange = () => {
    if (!dashboardData) return "";
    const { month, year, salaryDay } = dashboardData;
    const startDate = new Date(year, month - 1, salaryDay);
    const endDate = new Date(year, month, salaryDay - 1);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`;
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-2 border-b border-border">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">
            Paisa Kidar gaya BC
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Monthly Budget in CAD
            </span>
            {dashboardData && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {getPeriodRange()}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dashboardData && (
            <button
              onClick={handleDeletePeriod}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 transition-colors rounded-md"
              title="Delete all data for this month"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Delete Data</span>
            </button>
          )}
          <PeriodSelector
            month={month}
            year={year}
            salaryDay={dashboardData?.salaryDay ?? 1}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onSalaryDayChange={handleSalaryDayChange}
          />
        </div>
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
