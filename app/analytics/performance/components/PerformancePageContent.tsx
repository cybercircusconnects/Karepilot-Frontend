"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import StatsGrid from "@/components/common/StatsGrid";
import StatsGridSkeleton from "@/components/common/StatsGridSkeleton";
import { navigationTabs, performanceLines } from "@/lib/analytics/data";
import NavigationTabs from "@/components/common/NavigationTabs";
import { DateRangePicker } from "../../components/DateRangePicker";
import { ChartContainer } from "@/components/common/ChartContainer";
import { LineChartComponent } from "@/components/common/LineChartComponent";
import { SystemHealthComponent } from "@/components/common/SystemHealthComponent";
import { PerformanceStatistics } from "@/components/common/PerformanceStatistics";
import { AnalyticsHeader } from "../../components/AnalyticsHeader";
import { useGetPerformanceQuery } from "@/lib/api/analyticsApi";
import { AnalyticsQuery } from "@/lib/types/analytics/analytics";
import { CheckCircleIcon, ClockIcon, AlertTriangleIcon } from "@/icons/Icons";
import toast from "react-hot-toast";

export function PerformancePageContent() {
  const [dateRange, setDateRange] = useState<AnalyticsQuery["dateRange"]>("Last 7 days");
  const [queryParams, setQueryParams] = useState<AnalyticsQuery>({
    dateRange: "Last 7 days",
  });

  const {
    data: performanceData,
    isLoading,
    isError,
    refetch,
  } = useGetPerformanceQuery(queryParams);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range as AnalyticsQuery["dateRange"]);
    setQueryParams({
      ...queryParams,
      dateRange: range as AnalyticsQuery["dateRange"],
    });
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    }
  };

  const handleExportData = () => {
    toast.success("Export data functionality coming soon");
  };

  const handleGenerateReport = () => {
    toast.success("Generate report functionality coming soon");
  };

  const performanceStats = performanceData?.data
    ? [
        {
          id: 1,
          title: "System Uptime",
          value: `${performanceData.data.stats.systemUptime}%`,
          change: `${performanceData.data.stats.systemUptimeChange > 0 ? "+" : ""}${performanceData.data.stats.systemUptimeChange}% higher`,
          note: "from yesterday",
          icon: "",
          iconComponent: CheckCircleIcon,
          showIcon: true,
          iconColor: "#10b981",
          iconBackgroundColor: "#dcfce7",
        },
        {
          id: 2,
          title: "Avg Response Time",
          value: `${performanceData.data.stats.avgResponseTime}s`,
          change: `${performanceData.data.stats.avgResponseTimeChange > 0 ? "+" : ""}${performanceData.data.stats.avgResponseTimeChange}% higher`,
          note: "from last week",
          icon: "",
          iconComponent: ClockIcon,
          showIcon: true,
          iconColor: "#3b82f6",
          iconBackgroundColor: "#dbeafe",
        },
        {
          id: 3,
          title: "Error Rate",
          value: `${performanceData.data.stats.errorRate}%`,
          change: `Avg: ${performanceData.data.stats.errorRateChange > 0 ? "+" : ""}${performanceData.data.stats.errorRateChange}%`,
          note: "from last week",
          icon: "",
          iconComponent: AlertTriangleIcon,
          showIcon: true,
          iconColor: "#ef4444",
          iconBackgroundColor: "#fef2f2",
        },
      ]
    : [];

  const performanceStatisticsData = performanceData?.data
    ? [
        {
          id: 1,
          value: `${performanceData.data.stats.avgResponseTime}`,
          label: "Requests/min",
          color: "#f97316",
        },
        {
          id: 2,
          value: `${100 - performanceData.data.stats.errorRate}`,
          label: "Alerts Resolved",
          color: "#10b981",
        },
        {
          id: 3,
          value: `${performanceData.data.stats.avgResponseTime * 2}h`,
          label: "Maintenance Time",
          color: "#3b82f6",
        },
        {
          id: 4,
          value: "24/7",
          label: "Monitoring",
          color: "#10b981",
        },
      ]
    : [];

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load performance data");
    }
  }, [isError]);

  return (
    <DashboardLayout
      pageTitle="Analytics & Reports"
      showOrganizationHeader={true}
      showBackButton={true}
      backLink="/"
      organizationName="Central Medical Hospital"
    >
      <div className="space-y-6 w-full max-w-full overflow-x-hidden">
        <AnalyticsHeader
          onExportData={handleExportData}
          onGenerateReport={handleGenerateReport}
        />
        <DateRangePicker
          onDateRangeChange={handleDateRangeChange}
          onRefresh={handleRefresh}
          defaultRange="Last 7 days"
        />

        <NavigationTabs
          tabs={navigationTabs}
          maxWidth="max-w-[550px]"
          responsive={true}
        />

        {isLoading ? (
          <StatsGridSkeleton count={3} />
        ) : (
          <StatsGrid
            stats={performanceStats}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full overflow-x-hidden">
          <div className="w-full min-w-0">
            <SystemHealthComponent
              title="System Health"
              subtitle="Real-time system performance metrics"
              data={performanceData?.data?.systemHealth || []}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full min-w-0">
            <ChartContainer
              title="Performance Trends"
              subtitle="System performance over time"
            >
              {isLoading ? (
                <div className="h-[320px] flex items-center justify-center">
                  <div className="text-muted-foreground">Loading chart data...</div>
                </div>
              ) : (
                <LineChartComponent
                  data={(performanceData?.data?.performanceTrends || []) as Array<Record<string, string | number>>}
                  lines={performanceLines}
                  height={320}
                />
              )}
            </ChartContainer>
          </div>
        </div>
        <PerformanceStatistics
          title="Performance Statistics"
          stats={performanceStatisticsData}
          showBorder={true}
        />
      </div>
    </DashboardLayout>
  );
}

