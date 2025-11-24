"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { UploadFloorPlanModal } from "./UploadFloorPlanModal";
import { CreatePOIModal } from "./CreatePOIModal";
import { quickActions } from "@/lib/dashboard/data";

export default function QuickActions() {
  const params = useParams();
  const organizationId = params?.id as string;
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPOIModalOpen, setIsPOIModalOpen] = useState(false);

  const handleActionClick = (action?: string) => {
    if (action === "upload-floor-plan") {
      setIsUploadModalOpen(true);
    } else if (action === "add-medical-poi") {
      setIsPOIModalOpen(true);
    }
  };

  const handleUploadSuccess = () => {
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-card-foreground mb-1">
            Quick Actions
          </h2>
          <p className="text-sm text-muted-foreground">
            Common hospital management tasks
          </p>
        </div>
        <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.id}
              onClick={() => handleActionClick(action.action)}
              className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-border/50 hover:bg-accent cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Image
                  src={action.icon}
                  alt={action.title}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-card-foreground mb-0.5">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UploadFloorPlanModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      <CreatePOIModal
        isOpen={isPOIModalOpen}
        onClose={() => setIsPOIModalOpen(false)}
      />
    </>
  );
}