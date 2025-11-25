"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import StatsGrid from "@/components/common/StatsGrid";
import StatsGridSkeleton from "@/components/common/StatsGridSkeleton";
import { DateRangePicker } from "./DateRangePicker";
import { navigationTabs } from "@/lib/analytics/data";
import NavigationTabs from "@/components/common/NavigationTabs";
import { UserGrowthChart } from "./UserGrowthChart";
import FeatureUsageChart from "./FeatureUsageChart";
import { QuickInsights } from "./insightCards";
import { AnalyticsHeader } from "./AnalyticsHeader";
import { useGetAnalyticsOverviewQuery } from "@/lib/api/analyticsApi";
import { AnalyticsQuery } from "@/lib/types/analytics/analytics";
import { DashboardIcon, activeIcon, hospitalsIcon } from "@/icons/Assets";
import toast from "react-hot-toast";

export function AnalyticsPageContent() {
  const [dateRange, setDateRange] = useState<AnalyticsQuery["dateRange"]>("Last 7 days");
  const [queryParams, setQueryParams] = useState<AnalyticsQuery>({
    dateRange: "Last 7 days",
  });

  const {
    data: analyticsData,
    isLoading,
    isError,
    refetch,
  } = useGetAnalyticsOverviewQuery(queryParams);

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

  const analyticsStats = analyticsData?.data
    ? [
        {
          id: 1,
          title: "Total Users",
          value: analyticsData.data.stats.totalUsers.toLocaleString(),
          change: `${analyticsData.data.stats.totalUsersChange > 0 ? "+" : ""}${analyticsData.data.stats.totalUsersChange}%`,
          note: "from last week",
          icon: DashboardIcon,
        },
        {
          id: 2,
          title: "Total Sessions",
          value: analyticsData.data.stats.totalSessions.toLocaleString(),
          change: `Bounce rate ${analyticsData.data.stats.totalSessionsChange > 0 ? "+" : ""}${analyticsData.data.stats.totalSessionsChange}%`,
          note: "from last week",
          icon: activeIcon,
        },
        {
          id: 3,
          title: "Conversion Rate",
          value: `${analyticsData.data.stats.conversionRate}%`,
          change: `Avg. ${analyticsData.data.stats.conversionRateChange > 0 ? "+" : ""}${analyticsData.data.stats.conversionRateChange}%`,
          note: "from last week",
          icon: hospitalsIcon,
        },
      ]
    : [];

  if (isError) {
    toast.error("Failed to load analytics data");
  }

  return (
    <DashboardLayout
      pageTitle=""
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
          defaultRange={dateRange || "Last 7 days"}
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
            stats={analyticsStats}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="w-full min-w-0">
            <UserGrowthChart
              data={analyticsData?.data?.userGrowth || []}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full min-w-0">
            <FeatureUsageChart
              data={analyticsData?.data?.featureUsage || []}
              geoChartData={analyticsData?.data?.geoChartData || []}
              isLoading={isLoading}
            />
          </div>
        </div>

        <QuickInsights
          insights={analyticsData?.data?.insights || []}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}

