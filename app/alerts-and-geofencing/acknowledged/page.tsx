import { Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AlertsPageContent, AlertStatsCardsSkeleton } from "../components";

function AcknowledgedAlertsPageContent() {
  return <AlertsPageContent filterStatus="acknowledged" />;
}

export default function page() {
  return (
    <Suspense
      fallback={
        <DashboardLayout
          showBackButton={true}
          backLink="/users-and-roles"
          pageTitle="Alerts & Geofencing"
          organizationName="Central Medical Hospital"
          showOrganizationHeader={true}
        >
          <div className="space-y-6">
            <AlertStatsCardsSkeleton />
          </div>
        </DashboardLayout>
      }
    >
      <AcknowledgedAlertsPageContent />
    </Suspense>
  );
}