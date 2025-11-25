"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import StatsGrid, { StatItem } from "@/components/common/StatsGrid";
import RecentActivity from "@/components/common/RecentActivity";
import VenueTypeDistribution from "./VenueTypeDistribution";
import { OrganizationNav } from "./OrganizationNav";
import { OrganizationHeader } from "@/components/common/OrganizationHeader";
import StatsGridSkeleton from "@/components/common/StatsGridSkeleton";
import { QueryErrorState } from "@/components/common/QueryErrorState";
import { useGetOrganizationsOverviewQuery } from "@/lib/api/organizationsApi";
import {
  overviewStatMeta,
  venueTypeMeta,
} from "@/lib/organization/data";
import { ActivityItem } from "@/lib/dashboard/types";

const ACTIVITY_COLORS: Record<string, string> = {
  created: "bg-blue-500",
  updated: "bg-green-500",
  deactivated: "bg-red-500",
};

const formatPercentage = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  const formatted =
    Number.isInteger(value) ? value.toString() : value.toFixed(1);
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatted}%`;
};

const formatRelativeTime = (input: string) => {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const absSeconds = Math.abs(diffSeconds);

  let value = diffSeconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";

  if (absSeconds >= 60 && absSeconds < 3600) {
    value = Math.round(diffSeconds / 60);
    unit = "minute";
  } else if (absSeconds >= 3600 && absSeconds < 86400) {
    value = Math.round(diffSeconds / 3600);
    unit = "hour";
  } else if (absSeconds >= 86400 && absSeconds < 604800) {
    value = Math.round(diffSeconds / 86400);
    unit = "day";
  } else if (absSeconds >= 604800 && absSeconds < 2629800) {
    value = Math.round(diffSeconds / 604800);
    unit = "week";
  } else if (absSeconds >= 2629800 && absSeconds < 31557600) {
    value = Math.round(diffSeconds / 2629800);
    unit = "month";
  } else if (absSeconds >= 31557600) {
    value = Math.round(diffSeconds / 31557600);
    unit = "year";
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(value, unit);
};

const getActivityText = (
  name: string,
  organizationType: string,
  activityType: string,
) => {
  switch (activityType) {
    case "deactivated":
      return `${organizationType} deactivated: ${name}`;
    case "updated":
      return `${organizationType} updated: ${name}`;
    case "created":
    default:
      return `New ${organizationType.toLowerCase()} added: ${name}`;
  }
};

const RecentActivitySkeleton = () => (
  <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="space-y-2">
        <div className="h-5 bg-muted rounded w-48" />
        <div className="h-4 bg-muted rounded w-60" />
      </div>
      <div className="h-9 bg-muted rounded w-32" />
    </div>
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-border pb-4"
        >
          <div className="w-3 h-3 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-72" />
            <div className="h-3 bg-muted rounded w-40" />
          </div>
          <div className="w-5 h-5 bg-muted rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export function OrganizationsPageContent() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetOrganizationsOverviewQuery();

  const isBusy = isLoading || isFetching;

  const stats: StatItem[] = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    const { summary } = data.data;

    return [
      {
        id: overviewStatMeta.total.id,
        title: overviewStatMeta.total.title,
        value: summary.total.count,
        change: formatPercentage(summary.total.change),
        note: "from last week",
        icon: overviewStatMeta.total.icon,
      },
      {
        id: overviewStatMeta.active.id,
        title: overviewStatMeta.active.title,
        value: summary.active.count,
        change: formatPercentage(summary.active.change),
        note: "from last week",
        icon: overviewStatMeta.active.icon,
      },
      {
        id: overviewStatMeta.hospitals.id,
        title: overviewStatMeta.hospitals.title,
        value: summary.hospitals.count,
        change: formatPercentage(summary.hospitals.change),
        note: "from last week",
        icon: overviewStatMeta.hospitals.icon,
      },
      {
        id: overviewStatMeta.otherVenues.id,
        title: overviewStatMeta.otherVenues.title,
        value: summary.otherVenues.count,
        change: formatPercentage(summary.otherVenues.change),
        note: "from last week",
        icon: overviewStatMeta.otherVenues.icon,
      },
    ];
  }, [data]);

  const distribution = useMemo(() => {
    const counts = new Map<string, number>(
      data?.data?.distribution.map((item) => [
        item.organizationType,
        item.count,
      ]) ?? [],
    );

    return Object.entries(venueTypeMeta).map(([type, meta]) => ({
      id: meta.id,
      title: meta.title,
      count: isBusy ? "—" : counts.get(type) ?? 0,
      description: meta.description,
      icon: meta.icon,
      iconColor: meta.iconColor,
    }));
  }, [data, isBusy]);

  const activities: ActivityItem[] = useMemo(() => {
    if (!data?.data?.recentActivity) {
      return [];
    }

    return data.data.recentActivity.map((activity) => {
      const timestamp = activity.updatedAt || activity.createdAt;
      return {
        id: activity.id,
        text: getActivityText(
          activity.name,
          activity.organizationType,
          activity.activityType,
        ),
        author: activity.actor
          ? `${activity.actor.firstName} ${activity.actor.lastName}`.trim()
          : "System",
        time: formatRelativeTime(timestamp),
        color: ACTIVITY_COLORS[activity.activityType] ?? "bg-blue-500",
      };
    });
  }, [data]);

  return (
    <DashboardLayout pageTitle="Organizations">
      <OrganizationHeader showButton={false} />
      <OrganizationNav />

      {isBusy ? (
        <StatsGridSkeleton />
      ) : isError ? (
        <QueryErrorState error={error} onRetry={refetch} />
      ) : (
        <StatsGrid stats={stats} />
      )}

      {!isError && (
        <>
          <VenueTypeDistribution venues={distribution} />
          {isBusy ? (
            <RecentActivitySkeleton />
          ) : (
            <RecentActivity
              title="Recent Organization Activity"
              subtitle="Latest updates and changes"
              buttonText="View Analytics"
              activities={activities}
              maxItems={4}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}

