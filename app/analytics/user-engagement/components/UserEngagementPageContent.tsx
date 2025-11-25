"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import StatsGrid from "@/components/common/StatsGrid";
import StatsGridSkeleton from "@/components/common/StatsGridSkeleton";
import { navigationTabs } from "@/lib/analytics/data";
import NavigationTabs from "@/components/common/NavigationTabs";
import { DateRangePicker } from "../../components/DateRangePicker";
import { UserActivityChart } from "../component/UserActivityChart";
import { UserDemographics } from "../component/UserDemographics";
import { AnalyticsHeader } from "../../components/AnalyticsHeader";
import { useGetUserEngagementQuery } from "@/lib/api/analyticsApi";
import { AnalyticsQuery } from "@/lib/types/analytics/analytics";
import { DashboardIcon, activeIcon, hospitalsIcon } from "@/icons/Assets";
import toast from "react-hot-toast";

export function UserEngagementPageContent() {
  const [dateRange, setDateRange] = useState<AnalyticsQuery["dateRange"]>("Last 7 days");
  const [queryParams, setQueryParams] = useState<AnalyticsQuery>({
    dateRange: "Last 7 days",
  });

  const {
    data: engagementData,
    isLoading,
    isError,
    refetch,
  } = useGetUserEngagementQuery(queryParams);

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

  const userEngagementStats = engagementData?.data
    ? [
        {
          id: 1,
          title: "Active Users",
          value: engagementData.data.stats.activeUsers.toLocaleString(),
          change: `${engagementData.data.stats.activeUsersChange > 0 ? "+" : ""}${engagementData.data.stats.activeUsersChange}%`,
          note: "from last week",
          icon: DashboardIcon,
        },
        {
          id: 2,
          title: "User Retention",
          value: engagementData.data.stats.userRetention.toLocaleString(),
          change: `${engagementData.data.stats.userRetentionChange > 0 ? "+" : ""}${engagementData.data.stats.userRetentionChange}%`,
          note: "from last week",
          icon: activeIcon,
        },
        {
          id: 3,
          title: "Avg Session",
          value: `${engagementData.data.stats.avgSession}m`,
          change: `Avg: ${engagementData.data.stats.avgSessionChange > 0 ? "+" : ""}${engagementData.data.stats.avgSessionChange}%`,
          note: "from last week",
          icon: hospitalsIcon,
        },
        {
          id: 4,
          title: "Total Sessions",
          value: engagementData.data.stats.totalSessions.toLocaleString(),
          change: `Avg: ${engagementData.data.stats.totalSessionsChange > 0 ? "+" : ""}${engagementData.data.stats.totalSessionsChange}%`,
          note: "from last week",
          icon: hospitalsIcon,
        },
      ]
    : [];

  if (isError) {
    toast.error("Failed to load user engagement data");
  }

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
          <StatsGridSkeleton count={4} />
        ) : (
          <StatsGrid stats={userEngagementStats} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full overflow-x-hidden">
          <div className="lg:col-span-2 w-full min-w-0">
            <UserActivityChart
              data={engagementData?.data?.userActivity || []}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-1 w-full min-w-0">
            <UserDemographics
              data={engagementData?.data?.userDemographics || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

