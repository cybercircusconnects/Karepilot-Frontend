import { Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VenueAnalyticsPageContent } from "./components/VenueAnalyticsPageContent";

export default function page() {
  return (
    <Suspense fallback={
      <DashboardLayout
        pageTitle="Analytics & Reports"
        showOrganizationHeader={true}
        showBackButton={true}
        backLink="/"
        organizationName="Central Medical Hospital"
      >
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
          <div className="bg-background border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <VenueAnalyticsPageContent />
    </Suspense>
  );
}
