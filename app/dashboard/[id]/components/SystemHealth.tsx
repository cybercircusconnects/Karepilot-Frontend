"use client";

import { SystemHealthComponent } from "@/components/common/SystemHealthComponent";
import { SystemHealthItem } from "@/lib/types/dashboard/dashboard";

interface SystemHealthProps {
  data: SystemHealthItem[];
  organizationName: string;
}

export default function SystemHealth({ data, organizationName }: SystemHealthProps) {
  return (
    <SystemHealthComponent
      title="System Health"
      subtitle={`Overall status for ${organizationName}`}
      data={data}
    />
  );
}