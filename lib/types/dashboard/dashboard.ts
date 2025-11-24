export interface DashboardStats {
  activePatients: number;
  activePatientsChange: number;
  emergencyAlerts: number;
  emergencyAlertsChange: number;
  equipmentTracked: number;
  equipmentTrackedChange: number;
  navigationRequests: number;
  navigationRequestsChange: number;
}

export interface SystemHealthItem {
  name: string;
  health: number;
  status: "Healthy" | "Warning" | "Critical";
  time: string;
}

export interface DashboardActivity {
  id: string;
  text: string;
  author: string;
  time: string;
  color: string;
  type: string;
  createdAt: string;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    stats: DashboardStats;
    systemHealth: SystemHealthItem[];
    recentActivities: DashboardActivity[];
  };
}

