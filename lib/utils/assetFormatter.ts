import { Asset } from "@/lib/types/asset-tracking/asset";

export function formatTimeAgo(dateString: string | null | undefined): string {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
}

export function formatAssetLocation(asset: Asset): string {
  if (asset.location) {
    return asset.location;
  }
  return "Unknown location";
}

export function formatBuildingFloor(asset: Asset): string {
  const parts: string[] = [];
  
  if (asset.building?.name) {
    parts.push(asset.building.name);
  }
  
  if (asset.floor?.title || asset.floor?.floorLabel) {
    parts.push(asset.floor.title || asset.floor.floorLabel || "");
  }
  
  return parts.length > 0 ? parts.join(" • ") : "No location";
}

export function getAssetStatusColor(status: string): string {
  switch (status) {
    case "online":
      return "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-300";
    case "offline":
      return "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-300";
    case "low-battery":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-300";
  }
}

export function getBatteryColor(level: number | null | undefined): string {
  if (!level && level !== 0) return "bg-gray-500";
  if (level > 50) return "bg-green-500";
  if (level > 20) return "bg-yellow-500";
  return "bg-red-500";
}

