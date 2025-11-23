export type AssetType = "device" | "equipment" | "staff" | "personnel";
export type AssetStatus = "online" | "offline" | "low-battery";

export interface Asset {
  _id: string;
  organization: {
    _id: string;
    name: string;
  };
  name: string;
  type: AssetType;
  status: AssetStatus;
  building?: {
    _id: string;
    name: string;
    code?: string;
  } | null;
  floor?: {
    _id: string;
    title: string;
    floorLabel?: string;
  } | null;
  location?: string | null;
  department?: {
    _id: string;
    name: string;
  } | null;
  batteryLevel?: number | null;
  lastSeen?: string | null;
  mapCoordinates?: {
    x?: number | null;
    y?: number | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  description?: string | null;
  tags: string[];
  isActive: boolean;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssetStats {
  total: number;
  online: number;
  offline: number;
  lowBattery: number;
  byType: {
    device: number;
    equipment: number;
    staff: number;
    personnel: number;
  };
}

export interface AssetListResponse {
  success: boolean;
  message: string;
  data: {
    assets: Asset[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  };
}

export interface AssetResponse {
  success: boolean;
  message: string;
  data: {
    asset: Asset;
  };
}

export interface AssetStatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: AssetStats;
  };
}

export interface CreateAssetRequest {
  organization: string;
  name: string;
  type: AssetType;
  status?: AssetStatus;
  building?: string | null;
  floor?: string | null;
  location?: string | null;
  department?: string | null;
  batteryLevel?: number | null;
  lastSeen?: Date | null;
  mapCoordinates?: {
    x?: number | null;
    y?: number | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  description?: string | null;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateAssetRequest {
  name?: string;
  type?: AssetType;
  status?: AssetStatus;
  building?: string | null;
  floor?: string | null;
  location?: string | null;
  department?: string | null;
  batteryLevel?: number | null;
  lastSeen?: Date | null;
  mapCoordinates?: {
    x?: number | null;
    y?: number | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  description?: string | null;
  tags?: string[];
  isActive?: boolean;
}

export interface AssetQuery {
  organizationId?: string;
  buildingId?: string;
  floorId?: string;
  departmentId?: string;
  type?: AssetType | AssetType[];
  status?: AssetStatus | AssetStatus[];
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface UpdateAssetLocationRequest {
  building?: string | null;
  floor?: string | null;
  location?: string | null;
  mapCoordinates?: {
    x?: number | null;
    y?: number | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  lastSeen?: Date;
}

export interface UpdateAssetBatteryRequest {
  batteryLevel: number;
}

