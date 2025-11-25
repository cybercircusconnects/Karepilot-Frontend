"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  navigationTabs,
} from "@/lib/analytics/data";
import NavigationTabs from "@/components/common/NavigationTabs";
import { DateRangePicker } from "../../components/DateRangePicker";
import { AnalyticsHeader } from "../../components/AnalyticsHeader";
import { PerformanceStatistics } from "@/components/common/PerformanceStatistics";
import { MostPopularDestinations } from "./MostPopularDestinations";
import { UsagePatterns } from "./UsagePatterns";
import { VenuePerformanceStatistics } from "./VenuePerformanceStatistics";
import { useGetVenueAnalyticsQuery } from "@/lib/api/analyticsApi";
import { useGetOrganizationsQuery } from "@/lib/api/organizationsApi";
import { AnalyticsQuery } from "@/lib/types/analytics/analytics";
import toast from "react-hot-toast";
import { Building2, ChevronDown } from "@/icons/Icons";

export function VenueAnalyticsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const urlOrganizationId = searchParams.get("organizationId") || undefined;
  
  const [dateRange, setDateRange] = useState<AnalyticsQuery["dateRange"]>("Last 7 days");
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        orgDropdownRef.current &&
        !orgDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOrgDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: organizationsData, isLoading: isLoadingOrgs } = useGetOrganizationsQuery({
    page: 1,
    limit: 100,
    isActive: true,
  });

  const organizations = useMemo(() => {
    return organizationsData?.data?.organizations || [];
  }, [organizationsData]);

  const defaultOrganizationId = useMemo(() => {
    if (urlOrganizationId) return urlOrganizationId;
    return organizations.length > 0 ? organizations[0].id : undefined;
  }, [urlOrganizationId, organizations]);

  const handleOrganizationChange = (orgId: string) => {
    router.push(`/analytics/venue-analytics?organizationId=${orgId}`);
    setIsOrgDropdownOpen(false);
  };

  const [queryParams, setQueryParams] = useState<AnalyticsQuery & { id?: string }>({
    dateRange: "Last 7 days",
    id: defaultOrganizationId,
    organizationId: defaultOrganizationId,
  });

  useEffect(() => {
    if (defaultOrganizationId) {
      setQueryParams(prev => ({
        ...prev,
        dateRange: prev.dateRange,
        id: defaultOrganizationId,
        organizationId: defaultOrganizationId,
      }));
    }
  }, [defaultOrganizationId]);

  const {
    data: venueData,
    isLoading,
    isError,
    refetch,
  } = useGetVenueAnalyticsQuery(queryParams, {
    skip: !defaultOrganizationId,
  });

  const handleDateRangeChange = (range: string) => {
    setDateRange(range as AnalyticsQuery["dateRange"]);
    setQueryParams(prev => ({
      ...prev,
      dateRange: range as AnalyticsQuery["dateRange"],
    }));
  };

  const selectedOrg = organizations.find((org) => org.id === defaultOrganizationId);

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

  const venuePerformanceStats = venueData?.data
    ? [
        {
          id: 1,
          value: venueData.data.stats.navigationRequests.toLocaleString(),
          label: "Navigation Requests",
          color: "#f97316",
        },
        {
          id: 2,
          value: venueData.data.stats.poiInteractions.toLocaleString(),
          label: "POI Interactions",
          color: "#10b981",
        },
        {
          id: 3,
          value: venueData.data.stats.mapViews.toLocaleString(),
          label: "Map Views",
          color: "#3b82f6",
        },
        {
          id: 4,
          value: venueData.data.stats.emergencyAlerts.toLocaleString(),
          label: "Emergency Alerts",
          color: "#ef4444",
        },
        {
          id: 5,
          value: venueData.data.stats.assetTracking.toLocaleString(),
          label: "Asset Tracking",
          color: "#10b981",
        },
      ]
    : [];

  useEffect(() => {
    if (isError && defaultOrganizationId) {
      toast.error("Failed to load venue analytics data");
    }
  }, [isError, defaultOrganizationId]);

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

        {organizations.length > 1 && (
          <div className="relative" ref={orgDropdownRef}>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Select Organization
            </label>
            <button
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="flex items-center justify-between gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg text-card-foreground hover:bg-muted/80 transition-colors w-full sm:w-auto min-w-[250px] cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Building2 className="w-4 h-4 text-[#3D8C6C] shrink-0" />
                <span className="text-sm font-medium truncate text-left">
                  {selectedOrg?.name || "Select Organization"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${
                  isOrgDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOrgDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full sm:w-auto min-w-[250px] bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                <div className="p-2">
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => handleOrganizationChange(org.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors ${
                        defaultOrganizationId === org.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex-1 text-left">
                        <div className="text-card-foreground font-medium">{org.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {[org.city, org.country].filter(Boolean).join(", ") || "No location"}
                        </div>
                      </div>
                      {defaultOrganizationId === org.id && (
                        <div className="w-2 h-2 rounded-full bg-[#3D8C6C] shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <NavigationTabs
          tabs={navigationTabs}
          maxWidth="max-w-[550px]"
          responsive={true}
        />

        {isLoadingOrgs ? (
          <div className="bg-background border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground">Loading organizations...</p>
          </div>
        ) : organizations.length === 0 ? (
          <div className="bg-background border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No organizations found. Please create an organization first.
            </p>
          </div>
        ) : !defaultOrganizationId ? (
          <div className="bg-background border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Please select an organization to view venue analytics.
            </p>
          </div>
        ) : (
          <>
            <PerformanceStatistics
              stats={venuePerformanceStats}
              showBorder={false}
              gridClassName="grid grid-cols-2 lg:grid-cols-5 gap-4"
              isLoading={isLoading}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full overflow-x-hidden">
              <div className="w-full min-w-0">
                <MostPopularDestinations
                  title="Most Popular Destinations"
                  subtitle="Top visited POIs and areas"
                  destinations={venueData?.data?.popularDestinations || []}
                  isLoading={isLoading}
                />
              </div>

              <div className="w-full min-w-0">
                <UsagePatterns
                  title="Usage Patterns"
                  subtitle="Peak hours and usage distribution"
                  data={venueData?.data?.usagePatterns}
                  isLoading={isLoading}
                />
              </div>
            </div>
            <VenuePerformanceStatistics
              data={venueData?.data}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

