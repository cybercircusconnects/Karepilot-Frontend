"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapEditorContent } from "./MapEditorContent";

function MapEditorContentWrapper() {
  const searchParams = useSearchParams();
  const floorPlanId = searchParams.get("floorPlan") || undefined;

  return <MapEditorContent floorPlanId={floorPlanId} />;
}

export function MapEditorPageContent() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-120px)]">Loading...</div>}>
      <MapEditorContentWrapper />
    </Suspense>
  );
}

