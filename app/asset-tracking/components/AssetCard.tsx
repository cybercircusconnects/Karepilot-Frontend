import { Asset } from "@/lib/types/asset-tracking/asset";
import { Building2 } from "@/icons/Icons";
import {
  formatTimeAgo,
  formatAssetLocation,
  formatBuildingFloor,
  getAssetStatusColor,
  getBatteryColor,
} from "@/lib/utils/assetFormatter";

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const location = formatAssetLocation(asset);
  const buildingFloor = formatBuildingFloor(asset);
  const batteryLevel = asset.batteryLevel ?? 0;
  const lastSeen = formatTimeAgo(asset.lastSeen);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-card-foreground mb-2">
              {asset.name}
            </h4>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${getAssetStatusColor(
            asset.status
          )}`}
        >
          {asset.status === "low-battery"
            ? "Low Battery"
            : asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm font-medium text-card-foreground">
              {location}
            </p>
            <p className="text-xs text-muted-foreground">
              {buildingFloor}
            </p>
          </div>
        </div>

        {asset.batteryLevel !== null && asset.batteryLevel !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Battery</span>
              <span className="text-xs font-medium text-card-foreground">
                {batteryLevel}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getBatteryColor(
                  batteryLevel
                )}`}
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Last seen: {lastSeen}
        </p>
      </div>
    </div>
  );
}
