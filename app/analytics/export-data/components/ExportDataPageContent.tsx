"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { AnalyticsHeader } from "../../components/AnalyticsHeader";
import { QuickExport } from "./QuickExport";
import { CustomExport } from "./CustomExport";
import { RecentReports } from "@/components/common/RecentReports";
import {
  quickExportData,
  dataCategories,
  dateRanges,
  exportFormats,
  recentReports,
} from "@/lib/analytics/data";

export function ExportDataPageContent() {
  const handleExportData = () => {
    console.log("Export Data clicked");
  };

  const handleGenerateReport = () => {
    console.log("Generate Report clicked");
  };

  const breadcrumbs = [
    { label: "Analytics & Reports", href: "/analytics" },
    { label: "Data Export" },
  ];

  return (
    <DashboardLayout
      pageTitle="Analytics & Reports"
      showOrganizationHeader={true}
      showBackButton={true}
      backLink="/analytics"
      organizationName="Central Medical Hospital"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <AnalyticsHeader
          title="Data Export"
          subtitle="Export analytics data in various formats for your organization"
          onExportData={handleExportData}
          onGenerateReport={handleGenerateReport}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickExport
            title="Quick Export"
            subtitle="Export commonly used data sets with predefined formats"
            exports={quickExportData}
          />

          <CustomExport
            title="Custom Export"
            subtitle="Create custom data exports with specific parameters"
            dataCategories={dataCategories}
            dateRangeOptions={dateRanges}
            formatOptions={exportFormats}
          />
        </div>

        <RecentReports
          title="Recent Reports"
          subtitle="Download or manage your recent data exports"
          reports={recentReports}
        />
      </div>
    </DashboardLayout>
  );
}

