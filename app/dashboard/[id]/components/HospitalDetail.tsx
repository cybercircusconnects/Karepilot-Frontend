"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { QueryErrorState } from "@/components/common/QueryErrorState";
import QuickActions from "./QuickActions";
import RecentActivity from "../../../../components/common/RecentActivity";
import SystemHealth from "./SystemHealth";
import StatsGrid from "@/components/common/StatsGrid";
import { useGetDashboardDataQuery } from "@/lib/api/dashboardApi";
import { useGetOrganizationByIdQuery } from "@/lib/api/organizationsApi";
import {
  activePatientsIcon,
  emergencyAlertsIcon,
  equipmentTrackedIcon,
  navigationRequestsIcon,
} from "@/icons/Assets";
import StatsGridSkeleton from "@/components/common/StatsGridSkeleton";
import { SystemHealthSkeleton } from "@/components/common/SystemHealthSkeleton";
import { RecentActivitySkeleton } from "@/components/common/RecentActivitySkeleton";

export default function HospitalDetail() {
  const params = useParams();
  const organizationId = params?.id as string | undefined;

  const {
    data: organizationData,
    isLoading: isLoadingOrg,
    isError: isOrgError,
    error: orgError,
    refetch: refetchOrg,
  } = useGetOrganizationByIdQuery(organizationId || "", {
    skip: !organizationId,
  });

  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    isError: isDashboardError,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useGetDashboardDataQuery(organizationId || "", {
    skip: !organizationId,
  });

  const organization = organizationData?.data?.organization;
  const dashboard = dashboardData?.data;

  // Transform dashboard stats to StatItem format
  const hospitalStats = useMemo(() => {
    if (!dashboard?.stats) return [];

    const { stats } = dashboard;

    return [
      {
        id: 1,
        title: "Active Patients",
        value: stats.activePatients.toLocaleString(),
        change: `${stats.activePatientsChange >= 0 ? "+" : ""}${stats.activePatientsChange}%`,
        note: "from last week",
        icon: activePatientsIcon,
      },
      {
        id: 2,
        title: "Emergency Alerts",
        value: stats.emergencyAlerts.toLocaleString(),
        change: `${stats.emergencyAlertsChange >= 0 ? "+" : ""}${stats.emergencyAlertsChange}%`,
        note: "from last week",
        icon: emergencyAlertsIcon,
      },
      {
        id: 3,
        title: "Equipment Tracked",
        value: stats.equipmentTracked.toLocaleString(),
        change: `${stats.equipmentTrackedChange >= 0 ? "+" : ""}${stats.equipmentTrackedChange}%`,
        note: "from last week",
        icon: equipmentTrackedIcon,
      },
      {
        id: 4,
        title: "Navigation Requests",
        value: stats.navigationRequests.toLocaleString(),
        change: `${stats.navigationRequestsChange >= 0 ? "+" : ""}${stats.navigationRequestsChange}%`,
        note: "from last week",
        icon: navigationRequestsIcon,
      },
    ];
  }, [dashboard?.stats]);

  // Transform recent activities
  const recentActivities = useMemo(() => {
    if (!dashboard?.recentActivities) return [];

    return dashboard.recentActivities.map((activity) => ({
      id: activity.id,
      text: activity.text,
      author: activity.author,
      time: activity.time,
      color: activity.color,
    }));
  }, [dashboard?.recentActivities]);

  // Get organization location string
  const organizationLocation = useMemo(() => {
    if (!organization) return "";
    const parts = [organization.city, organization.country].filter(Boolean);
    return parts.join(", ");
  }, [organization]);

  if (isLoadingOrg || isLoadingDashboard) {
    return (
      <DashboardLayout
        showBackButton={true}
        showOrganizationHeader={true}
        organizationName="Loading..."
        pageTitle="Dashboard"
        backLink="/"
      >
        <div className="mx-auto">
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-6 animate-pulse">
              <div className="flex-1">
                <div className="h-8 bg-muted rounded w-64 mb-2"></div>
                <div className="h-4 bg-muted rounded w-48 mb-2"></div>
                <div className="h-4 bg-muted rounded w-96"></div>
              </div>
            </div>
            <StatsGridSkeleton />
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
              <SystemHealthSkeleton />
            </div>
            <RecentActivitySkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isOrgError || isDashboardError) {
    return (
      <DashboardLayout
        showBackButton={true}
        showOrganizationHeader={true}
        organizationName="Error"
        pageTitle="Dashboard"
        backLink="/"
      >
        <div className="mx-auto">
          <QueryErrorState
            error={orgError || dashboardError}
            title="Failed to load dashboard"
            onRetry={() => {
              if (isOrgError) refetchOrg();
              if (isDashboardError) refetchDashboard();
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (!organization) {
    return (
      <DashboardLayout
        showBackButton={true}
        showOrganizationHeader={true}
        organizationName="Not Found"
        pageTitle="Dashboard"
        backLink="/"
      >
        <div className="mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Organization not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      showBackButton={true}
      showOrganizationHeader={true}
      organizationName={organization.name}
      pageTitle="Dashboard"
      backLink="/"
    >
      <div className="mx-auto">
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {organization.name}
              </h1>
              <p className="text-sm text-muted-foreground mb-2">
                {organizationLocation}
                {organization.organizationType && (
                  <span className="p-2 bg-muted rounded-2xl text-foreground ml-1">
                    {organization.organizationType}
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor patient flow, equipment, and medical facility navigation
              </p>
            </div>
          </div>
          {isLoadingDashboard ? (
            <StatsGridSkeleton />
          ) : (
            <StatsGrid stats={hospitalStats} />
          )}
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickActions />
            {isLoadingDashboard ? (
              <SystemHealthSkeleton />
            ) : (
              <SystemHealth
                data={dashboard?.systemHealth || []}
                organizationName={organization.name}
              />
            )}
          </div>
          {isLoadingDashboard ? (
            <RecentActivitySkeleton />
          ) : (
            <RecentActivity
              title="Recent Activity"
              subtitle={`Latest updates for ${organization.name}`}
              buttonText="View All"
              activities={recentActivities}
              maxItems={6}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
