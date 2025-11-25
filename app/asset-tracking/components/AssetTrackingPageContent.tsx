"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import StatsGridWithIcons from "@/components/common/StatsGridWithIcons";
import { 
  useGetAssetsQuery,
  useGetAssetStatsQuery,
} from "@/lib/api/assetTrackingApi";
import { useGetAllBuildingsQuery } from "@/lib/api/buildingsApi";
import { typeFilters } from "@/lib/asset-tracking/data";
import { PieChart, CheckCircle, Battery, Circle } from "@/icons/Icons";
import { AssetType } from "@/lib/types/asset-tracking/asset";
import {
  AssetTrackingHeader,
  AssetMapWithDropdown,
  AssetListWithDropdown,
} from "./index";

export function AssetTrackingPageContent() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [organizationId, setOrganizationId] = useState<string | undefined>();

  const { data: buildingsData } = useGetAllBuildingsQuery(
    organizationId
      ? {
          organizationId,
          isActive: true,
          page: 1,
          limit: 100,
        }
      : { isActive: true, page: 1, limit: 100 }
  );

  const buildingFilters = useMemo(() => {
    const buildings = buildingsData?.data?.buildings || [];
    return [
      { label: "All Buildings", value: "all", checked: true },
      ...buildings.map((building) => {
        const buildingId = building.id || (building as any)._id || "";
        return {
          label: building.name,
          value: buildingId,
          checked: false,
        };
      }),
    ];
  }, [buildingsData]);

  const assetQuery = useMemo(() => {
    const query: any = {
      isActive: true,
      page: 1,
      limit: 100,
    };

    if (organizationId) {
      query.organizationId = organizationId;
    }

    if (selectedType !== "all") {
      query.type = selectedType as AssetType;
    }

    if (selectedBuilding !== "all") {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(selectedBuilding);
      if (isValidObjectId) {
        query.buildingId = selectedBuilding;
      } else {
        console.warn("Invalid building ID format:", selectedBuilding);
      }
    }

    return query;
  }, [organizationId, selectedType, selectedBuilding]);

  const { data: assetsData, isLoading: assetsLoading } = useGetAssetsQuery(assetQuery);
  const { data: statsData, isLoading: statsLoading } = useGetAssetStatsQuery({ organizationId });

  const stats = useMemo(() => {
    if (!statsData?.data?.stats) return [];

    const { stats: assetStats } = statsData.data;

    return [
      {
        id: "total-assets",
        title: "Total Assets",
        value: assetStats.total,
        icon: PieChart,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        id: "online",
        title: "Online",
        value: assetStats.online,
        icon: CheckCircle,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        id: "low-battery",
        title: "Low Battery",
        value: assetStats.lowBattery,
        icon: Battery,
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
      },
      {
        id: "offline",
        title: "Offline",
        value: assetStats.offline,
        icon: Circle,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
      },
    ];
  }, [statsData]);

  const assets = assetsData?.data?.assets || [];

  return (
    <DashboardLayout
      showBackButton={true}
      backLink="/"
      pageTitle="Asset Tracking"
      organizationName="Central Medical Hospital"
      showOrganizationHeader={true}
    >
      <div className="space-y-6">
        <AssetTrackingHeader />

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <StatsGridWithIcons stats={stats} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AssetMapWithDropdown 
              selectedBuilding={selectedBuilding}
              onBuildingChange={setSelectedBuilding}
              buildingFilters={buildingFilters}
              assets={assets}
              isLoading={assetsLoading}
            />
          </div>

          <div className="lg:col-span-1">
            <AssetListWithDropdown 
              assets={assets}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              typeFilters={typeFilters}
              isLoading={assetsLoading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

