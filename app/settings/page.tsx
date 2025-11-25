import { DashboardLayout } from "@/components/DashboardLayout";
import NavigationTabs from "@/components/common/NavigationTabs";
import { ProfileSettings } from "@/components/common/ProfileSettings";
import { UserPreferences } from "@/components/common/UserPreferences";
import { settingsTabs, userPreferences } from "@/lib/settings/data";

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileSettings
            title="Profile Settings"
            subtitle="Update your profile information"
          />

          <UserPreferences
            title="User Preferences"
            subtitle="Customize your interface and default settings"
            preferences={userPreferences}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
