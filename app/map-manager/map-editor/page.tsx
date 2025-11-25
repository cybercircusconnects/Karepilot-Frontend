import { DashboardLayout } from "@/components/DashboardLayout";
import { MapEditorPageContent } from "./components/MapEditorPageContent";

export default function page() {
  return (
    <DashboardLayout
      showBackButton={true}
      backLink="/map-manager"
      breadcrumbs={[
        { label: "Map Manager", href: "/map-manager" },
        { label: "Map Editor" }
      ]}
      organizationName="Central Medical Hospital"
      showOrganizationHeader={true}
    >
      <MapEditorPageContent />
    </DashboardLayout>
  );
}
