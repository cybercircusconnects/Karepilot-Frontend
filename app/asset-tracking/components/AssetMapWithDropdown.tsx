import { FilterOption } from "@/lib/asset-tracking/types";
import { Asset } from "@/lib/types/asset-tracking/asset";
import { FilterDropdown } from "./FilterDropdown";
import { getAssetStatusColor } from "@/lib/utils/assetFormatter";

interface AssetMapWithDropdownProps {
  selectedBuilding: string;
  onBuildingChange: (value: string) => void;
  buildingFilters: FilterOption[];
  assets: Asset[];
  isLoading?: boolean;
}

export function AssetMapWithDropdown({
  selectedBuilding,
  onBuildingChange,
  buildingFilters,
  assets,
  isLoading = false,
}: AssetMapWithDropdownProps) {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "low-battery":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredAssets = selectedBuilding === "all" 
    ? assets 
    : assets.filter(asset => asset.building?._id === selectedBuilding);

  const getAssetPosition = (index: number, total: number) => {
    const positions = [
      { top: "20%", left: "10%" },
      { top: "15%", right: "15%" },
      { bottom: "20%", left: "33%" },
      { top: "50%", right: "10%" },
      { bottom: "12%", right: "25%" },
      { top: "30%", left: "50%" },
      { bottom: "30%", left: "20%" },
      { top: "60%", left: "40%" },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            Real-time Asset Map
          </h3>
          <p className="text-sm text-muted-foreground">
            Live tracking of assets across hospital buildings
          </p>
        </div>
      </div>

      <div className="relative bg-muted/30 rounded-lg h-[400px] border border-border overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 bg-muted-foreground/40 rounded"></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Loading asset map...
              </p>
            </div>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-muted-foreground/40 rounded"></div>
              </div>
              <p className="text-sm text-muted-foreground">
                No assets to display
              </p>
            </div>
          </div>
        ) : (
          <>
            {filteredAssets.slice(0, 8).map((asset, index) => {
              const position = getAssetPosition(index, filteredAssets.length);
              return (
                <div
                  key={asset._id}
                  className={`absolute w-6 h-6 ${getStatusColor(asset.status)} rounded-full flex items-center justify-center animate-pulse shadow-lg`}
                  style={position}
                  title={`${asset.name} - ${asset.status}`}
                >
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
              );
            })}
          </>
        )}
        
        <FilterDropdown
          label="All Buildings"
          options={buildingFilters}
          selectedValue={selectedBuilding}
          onSelectionChange={onBuildingChange}
          className="absolute top-6 left-6 z-10 w-[180px]"
        />
      </div>
    </div>
  );
}
