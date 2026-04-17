"use client";

import { useState, useEffect } from "react";
import {
  getOrCreateBudgetPeriod,
  getBudgetDashboardData,
  updateBudgetPeriodSettings,
} from "../../dashboard/expense-tracker/_actions/budget-actions";
import { SummaryDashboard } from "@/app/(backend)/_components/expense-tracker/summary-dashboard";
import { PeriodSelector } from "@/app/(backend)/_components/expense-tracker/period-selector";
import { Loader2 } from "lucide-react";

export function CurrentMonthSummary() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const period = await getOrCreateBudgetPeriod(month, year);
      if (!period) throw new Error("Failed to create period");
      const data = await getBudgetDashboardData(period.id);
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  const refreshData = async () => {
    if (dashboardData) {
      const data = await getBudgetDashboardData(dashboardData.id);
      setDashboardData(data);
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

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Financial Summary
        </h2>
        <PeriodSelector
          month={month}
          year={year}
          salaryDay={dashboardData.salaryDay ?? 1}
          hideSalaryDay={true}
          onMonthChange={setMonth}
          onYearChange={setYear}
          onSalaryDayChange={handleSalaryDayChange}
        />
      </div>
      <SummaryDashboard data={dashboardData} onDataChange={refreshData} />
    </div>
  );
}
