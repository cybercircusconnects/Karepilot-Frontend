import { Asset } from "@/lib/types/asset-tracking/asset";
import { AssetCard } from "./AssetCard";

interface AssetListProps {
  assets: Asset[];
}

export function AssetList({ assets }: AssetListProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No assets found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <AssetCard key={asset._id} asset={asset} />
      ))}
    </div>
  );
}
