export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
  status: "Active" | "Acknowledged" | "Resolved";
  location: string;
  timestamp: string;
  type: "Unauthorized Entry" | "Low Battery" | "Emergency Exit" | "System Alert";
}


export interface GeofenceZone {
  id: string;
  name: string;
  location: string;
  description: string;
  alertType: "Restricted" | "Alert" | "Notification";
  alertDescription: string;
  isActive: boolean;
  floor?: string;
}

export interface AlertStats {
  activeAlerts: number;
  critical: number;
  geofenceZones: number;
  zoneTriggers: number;
}

export interface AlertOverviewStats {
  active: number;
  acknowledged: number;
  resolved: number;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  sound: boolean;
}

export interface CreateGeofenceZoneData {
  name: string;
  type: string;
  description: string;
  notifications: NotificationSettings;
}

export interface CreateAlertData {
  name: string;
  description: string;
  alertType: string;
  priority: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  floor: string;
  room: string;
}
