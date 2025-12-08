"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Formik, Form } from "formik";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomSelect } from "@/components/common/CustomSelect";
import { CustomTextarea } from "@/components/common/CustomTextarea";
import { X } from "@/icons/Icons";
import {
  useCreatePointOfInterestMutation,
  useUpdatePointOfInterestMutation,
} from "@/lib/api/pointsOfInterestApi";
import { useGetOrganizationsQuery } from "@/lib/api/organizationsApi";
import { PointOfInterest } from "@/lib/points-of-interest/types";
import { buildings, facilities, floors } from "@/lib/dashboard/data";
import { pointOfInterestValidationSchema } from "@/lib/validations";

interface PointOfInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  pointOfInterest?: PointOfInterest | null;
  organizationId?: string;
  onSuccess?: () => void;
}

const statusOptions = ["Active", "Inactive", "Maintenance"];

const GoogleMap = dynamic(
  () => import("@/components/maps").then((mod) => mod.InteractivePoiMap),
  { ssr: false },
);

export function PointOfInterestModal({
  isOpen,
  onClose,
  pointOfInterest,
  organizationId,
  onSuccess,
}: PointOfInterestModalProps) {
  const isEditMode = Boolean(pointOfInterest);

  const [createPointOfInterest, { isLoading: isCreating }] =
    useCreatePointOfInterestMutation();
  const [updatePointOfInterest, { isLoading: isUpdating }] =
    useUpdatePointOfInterestMutation();

  const { data: organizationsData, isLoading: isOrganizationsLoading } =
    useGetOrganizationsQuery({ limit: 100 });

  const organizationOptions = useMemo(
    () =>
      organizationsData?.data?.organizations?.map((org) => ({
        name: org.name,
        value: org.id,
      })) ?? [],
    [organizationsData],
  );

  const initialValues = useMemo(
    () => ({
      organizationId:
        pointOfInterest?.organization?.id ?? organizationId ?? "",
      name: pointOfInterest?.name ?? "",
      category: pointOfInterest?.category ?? "",
      categoryType: pointOfInterest?.categoryType ?? "",
      building: pointOfInterest?.building ?? "",
      floor: pointOfInterest?.floor ?? "",
      roomNumber: pointOfInterest?.roomNumber ?? "",
      description: pointOfInterest?.description ?? "",
      tags: pointOfInterest?.tags?.join(", ") ?? "",
      amenities: pointOfInterest?.amenities?.join(", ") ?? "",
      phone: pointOfInterest?.contact?.phone ?? "",
      email: pointOfInterest?.contact?.email ?? "",
      operatingHours: pointOfInterest?.contact?.operatingHours ?? "",
      wheelchairAccessible:
        pointOfInterest?.accessibility?.wheelchairAccessible ?? false,
      hearingLoop: pointOfInterest?.accessibility?.hearingLoop ?? false,
      visualAidSupport:
        pointOfInterest?.accessibility?.visualAidSupport ?? false,
      status: pointOfInterest?.status ?? "Active",
      latitude:
        pointOfInterest?.mapCoordinates?.latitude?.toString() ??
        pointOfInterest?.mapCoordinates?.y?.toString() ??
        "",
      longitude:
        pointOfInterest?.mapCoordinates?.longitude?.toString() ??
        pointOfInterest?.mapCoordinates?.x?.toString() ??
        "",
      isActive: pointOfInterest?.isActive ?? true,
    }),
    [pointOfInterest, organizationId],
  );

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) {
      setMarker(null);
      return;
    }

    const lat =
      pointOfInterest?.mapCoordinates?.latitude ??
      pointOfInterest?.mapCoordinates?.y;
    const lng =
      pointOfInterest?.mapCoordinates?.longitude ??
      pointOfInterest?.mapCoordinates?.x;

    if (typeof lat === "number" && typeof lng === "number") {
      setMarker({ lat, lng });
    } else {
      setMarker(null);
    }
  }, [isOpen, pointOfInterest]);

  const handleClose = (resetForm?: () => void) => {
    resetForm?.();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const isMutationLoading = isCreating || isUpdating;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={pointOfInterestValidationSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting, resetForm, setFieldValue }) => {
        try {
          const effectiveOrganizationId =
            values.organizationId || organizationId || "";

          if (!effectiveOrganizationId) {
            toast.error("Organization is required.");
            setSubmitting(false);
            return;
          }

          // Sync location marker to form values if marker is set
          if (marker) {
            setFieldValue("latitude", marker.lat.toString());
            setFieldValue("longitude", marker.lng.toString());
          }

          // Use location marker if available, otherwise fall back to form values
          const finalLat = marker?.lat ?? (values.latitude?.trim() ? parseFloat(values.latitude.trim()) : null);
          const finalLng = marker?.lng ?? (values.longitude?.trim() ? parseFloat(values.longitude.trim()) : null);

          const payload = {
            organizationId: effectiveOrganizationId,
            name: values.name,
            category: values.category,
            categoryType: values.categoryType || undefined,
            building: values.building,
            floor: values.floor,
            roomNumber: values.roomNumber || undefined,
            description: values.description || undefined,
            tags: values.tags
              ? values.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              : [],
            amenities: values.amenities
              ? values.amenities
                  .split(",")
                  .map((amenity) => amenity.trim())
                  .filter(Boolean)
              : [],
            contact:
              values.phone || values.email || values.operatingHours
                ? {
                    phone: values.phone || undefined,
                    email: values.email || undefined,
                    operatingHours: values.operatingHours || undefined,
                  }
                : undefined,
            accessibility: {
              wheelchairAccessible: values.wheelchairAccessible,
              hearingLoop: values.hearingLoop,
              visualAidSupport: values.visualAidSupport,
            },
            status: values.status,
            mapCoordinates:
              finalLat !== null || finalLng !== null
                ? {
                    latitude: finalLat ?? undefined,
                    longitude: finalLng ?? undefined,
                  }
                : undefined,
            isActive: values.isActive,
          };

          if (isEditMode && pointOfInterest) {
            await updatePointOfInterest({
              id: pointOfInterest.id,
              data: payload,
            }).unwrap();
            toast.success("Point of interest updated successfully");
          } else {
            await createPointOfInterest(payload).unwrap();
            toast.success("Point of interest created successfully");
          }

          handleClose(resetForm);
          onSuccess?.();
        } catch (err: any) {
          console.error("POI mutation error:", err);
          toast.error(
            err?.data?.message ||
              "Failed to save point of interest. Please try again.",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        isSubmitting,
        resetForm,
      }) => (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose(resetForm);
            }
          }}
        >
          <Form className="bg-card rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {isEditMode
                    ? "Edit Point of Interest"
                    : "Create Point of Interest"}
                </h2>
                <Button
                  type="button"
                  onClick={() => handleClose(resetForm)}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground transition-colors -mt-1 cursor-pointer p-1 h-auto"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update information about this point of interest"
                  : "Add a new location or service to help visitors navigate"}
              </p>
            </div>

            <div className="px-6 py-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomSelect
                  value={values.organizationId}
                  onChange={(value) => setFieldValue("organizationId", value)}
                  options={organizationOptions}
                  placeholder={
                    isOrganizationsLoading
                      ? "Loading organizations..."
                      : "Select organization"
                  }
                  label="Organization"
                  required
                  error={errors.organizationId}
                  touched={touched.organizationId}
                  disabled={Boolean(organizationId) || isOrganizationsLoading}
                />
                <CustomInput
                  value={values.name}
                  onChange={(value) => setFieldValue("name", value)}
                  placeholder="e.g. Emergency Department"
                  label="POI Name"
                  required
                  error={errors.name}
                  touched={touched.name}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <CustomSelect
                  value={values.category}
                  onChange={(value) => setFieldValue("category", value)}
                  options={facilities}
                  placeholder="Select category"
                  label="Category"
                  required
                  error={errors.category}
                  touched={touched.category}
                />

                <CustomSelect
                  value={values.categoryType}
                  onChange={(value) => setFieldValue("categoryType", value)}
                  options={[
                    "Medical Services",
                    "Passenger Amenities",
                    "Dining",
                    "Leisure",
                    "Security",
                  ]}
                  placeholder="Select category type"
                  label="Category Type"
                  error={errors.categoryType}
                  touched={touched.categoryType}
                />

                <CustomSelect
                  value={values.status}
                  onChange={(value) => setFieldValue("status", value)}
                  options={statusOptions}
                  placeholder="Select status"
                  label="Status"
                  required
                  error={errors.status}
                  touched={touched.status}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <CustomSelect
                  value={values.building}
                  onChange={(value) => setFieldValue("building", value)}
                  options={buildings}
                  placeholder="Select building"
                  label="Building"
                  required
                  error={errors.building}
                  touched={touched.building}
                />

                <CustomSelect
                  value={values.floor}
                  onChange={(value) => setFieldValue("floor", value)}
                  options={floors}
                  placeholder="Select floor"
                  label="Floor"
                  required
                  error={errors.floor}
                  touched={touched.floor}
                />
                <CustomInput
                  value={values.roomNumber}
                  onChange={(value) => setFieldValue("roomNumber", value)}
                  placeholder="e.g. ED-001"
                  label="Room Number"
                  error={errors.roomNumber}
                  touched={touched.roomNumber}
                />
              </div>

              <CustomTextarea
                value={values.description}
                onChange={(value) => setFieldValue("description", value)}
                placeholder="Brief description of the location or service"
                label="Description"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  value={values.tags}
                  onChange={(value) => setFieldValue("tags", value)}
                  placeholder="e.g. emergency, 24/7, trauma"
                  label="Tags"
                />
                <CustomInput
                  value={values.amenities}
                  onChange={(value) => setFieldValue("amenities", value)}
                  placeholder="e.g. WiFi, Waiting Area"
                  label="Amenities"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <CustomInput
                    value={values.phone}
                    onChange={(value) => setFieldValue("phone", value)}
                    placeholder="+1-555-012-4353"
                    label="Phone"
                    type="tel"
                  />

                  <CustomInput
                    value={values.email}
                    onChange={(value) => setFieldValue("email", value)}
                    placeholder="email@example.com"
                    label="Email"
                    type="email"
                    error={errors.email}
                    touched={touched.email}
                  />
                  <CustomInput
                    value={values.operatingHours}
                    onChange={(value) => setFieldValue("operatingHours", value)}
                    placeholder="9:00 AM - 5:00 PM"
                    label="Operating Hours"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="text-sm font-semibold text-card-foreground">
                  Accessibility Features
                </h3>
                <ToggleSwitch
                  checked={values.wheelchairAccessible}
                  onChange={(checked) =>
                    setFieldValue("wheelchairAccessible", checked)
                  }
                  label="Wheelchair Accessible"
                  description="Full wheelchair accessibility"
                />
                <ToggleSwitch
                  checked={values.hearingLoop}
                  onChange={(checked) => setFieldValue("hearingLoop", checked)}
                  label="Hearing Loop"
                  description="Hearing assistance available"
                />
                <ToggleSwitch
                  checked={values.visualAidSupport}
                  onChange={(checked) =>
                    setFieldValue("visualAidSupport", checked)
                  }
                  label="Visual Aid Support"
                  description="Visual aids available"
                />
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <ToggleSwitch
                  checked={values.isActive}
                  onChange={(checked) => setFieldValue("isActive", checked)}
                  label="Active"
                  description="Toggle the active status of this POI"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <label className="block text-xs font-medium mb-2.5 text-muted-foreground">
                  Location Coordinates <span className="text-muted-foreground/70">(Optional)</span>
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Search for a location or click on the map to select coordinates for mobile location display
                </p>
                <div className="border border-border rounded-xl overflow-hidden">
                  <GoogleMap
                    height={300}
                    marker={marker}
                    onMarkerChange={(coords) => {
                      setMarker(coords);
                      if (coords) {
                        setFieldValue("latitude", coords.lat.toString());
                        setFieldValue("longitude", coords.lng.toString());
                      } else {
                        setFieldValue("latitude", "");
                        setFieldValue("longitude", "");
                      }
                    }}
                  />
                </div>
                {marker && (
                  <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Selected:</span> {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMarker(null);
                        setFieldValue("latitude", "");
                        setFieldValue("longitude", "");
                      }}
                      className="h-auto px-2 py-1 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-muted/50">
              <Button
                type="button"
                onClick={() => handleClose(resetForm)}
                variant="outline"
                className="px-5 py-2.5 cursor-pointer text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
                disabled={isSubmitting || isMutationLoading}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-5 flex gap-2 py-2.5 text-sm cursor-pointer font-medium text-white bg-[#3D8C6C] rounded-lg transition-colors hover:bg-[#3D8C6C]/90 disabled:opacity-60"
                disabled={isSubmitting || isMutationLoading}
              >
                {isEditMode ? "Save Changes" : "Create POI"}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export { PointOfInterestModal as CreatePOIModal };

