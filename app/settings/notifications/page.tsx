import { DashboardLayout } from "@/components/DashboardLayout";
import NavigationTabs from "@/components/common/NavigationTabs";
import { NotificationSettings } from "./components/NotificationSettings";
import { settingsTabs } from "@/lib/settings/data";

export default function page() {
  return (
    <DashboardLayout
      pageTitle="Settings"
      showOrganizationHeader={true}
      showBackButton={true}
      backLink="/"
      organizationName="Central Medical Hospital"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences and manage your account for your
            organization
          </p>
        </div>

        <NavigationTabs
          tabs={settingsTabs}
          maxWidth="max-w-[350px]"
          responsive={true}
        />

        <NotificationSettings
          title="Notification Settings"
          subtitle="Configure how you receive alerts and notifications"
        />
      </div>
    </DashboardLayout>
  );
}
