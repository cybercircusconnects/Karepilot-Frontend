import { FilterOption } from "@/lib/asset-tracking/types";
import { Asset } from "@/lib/types/asset-tracking/asset";
import { FilterDropdown } from "./FilterDropdown";
import { AssetList } from "./AssetList";

interface AssetListWithDropdownProps {
  assets: Asset[];
  selectedType: string;
  onTypeChange: (value: string) => void;
  typeFilters: FilterOption[];
  isLoading?: boolean;
}

export function AssetListWithDropdown({ 
  assets, 
  selectedType, 
  onTypeChange, 
  typeFilters,
  isLoading = false,
}: AssetListWithDropdownProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-col mb-5">
        <div className="flex">
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            Asset List
          </h3>
        </div>
        <FilterDropdown
          label="All Types"
          options={typeFilters}
          selectedValue={selectedType}
          onSelectionChange={onTypeChange}
        />
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <AssetList assets={assets} />
        )}
      </div>
    </div>
  );
}
