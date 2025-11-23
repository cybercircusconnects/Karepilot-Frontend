export type { Asset, AssetType, AssetStatus } from "@/lib/types/asset-tracking/asset";

export interface StatItem {
  id: string;
  title: string;
  value: number;
  icon: any;
  iconBg: string;
  iconColor: string;
}

export interface FilterOption {
  label: string;
  value: string;
  checked?: boolean;
}
