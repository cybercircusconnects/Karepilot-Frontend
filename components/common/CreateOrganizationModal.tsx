"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Country, City } from "country-state-city";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { X, Building2 } from "@/icons/Icons";
import { CustomInput } from "./CustomInput";
import { CustomSelect } from "./CustomSelect";
import { VenueTemplateSelector } from "./VenueTemplateSelector";
import { ToggleSwitch } from "./ToggleSwitch";
import timezones from "timezones-list";
import {
  CreateOrganizationFormValues,
  createOrganizationSchema,
  OrganizationFormMode,
  updateOrganizationSchema,
} from "@/lib/validations";
import {
  useCreateOrganizationMutation,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
} from "@/lib/api/organizationsApi";
import { useGetAllVenueTemplatesQuery } from "@/lib/api/venueTemplatesApi";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId?: string | null;
  mode?: OrganizationFormMode;
  onSuccess?: () => void;
}

const defaultInitialValues: CreateOrganizationFormValues = {
  organizationType: "Hospital",
  name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  timezone: "America/New_York",
  address: "",
  venueTemplate: "",
  isActive: true,
};

const organizationTypeOptions = [
  "Hospital",
  "Airport",
  "Shopping Mall",
  "Open Place",
  "Corporate",
];

export function CreateOrganizationModal({
  isOpen,
  onClose,
  organizationId,
  mode = "create",
  onSuccess,
}: CreateOrganizationModalProps) {
  const isEditMode = mode === "edit" && !!organizationId;
  const isViewMode = mode === "view" && !!organizationId;

  const [createOrganization, { isLoading: isCreating }] =
    useCreateOrganizationMutation();
  const [updateOrganization, { isLoading: isUpdating }] =
    useUpdateOrganizationMutation();

  const {
    data: organizationData,
    isLoading: isLoadingOrganization,
  } = useGetOrganizationByIdQuery(organizationId as string, {
    skip: !organizationId || mode === "create",
  });

  const {
    data: templatesData,
    isLoading: isLoadingTemplates,
  } = useGetAllVenueTemplatesQuery(
    {
      page: 1,
      limit: 100,
    },
    {
      skip: !isOpen,
    },
  );

  const venueTemplates = templatesData?.data?.venueTemplates ?? [];

  const countries = useMemo(() => {
    const allCountries = Country.getAllCountries();
    return allCountries
      .map((country) => ({
        name: country.name,
        code: country.isoCode,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const countryMap = useMemo(() => {
    const map = new Map<string, string>();
    countries.forEach((country) => map.set(country.name, country.code));
    return map;
  }, [countries]);

  const countryOptions = useMemo(
    () => countries.map((country) => country.name),
    [countries],
  );

  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [currentCountryForCities, setCurrentCountryForCities] = useState<string>("");
  const countryRef = useRef<string>("");

  const loadCitiesForCountry = (countryName: string, currentCity?: string) => {
    if (!countryName) {
      setCityOptions([]);
      setCurrentCountryForCities("");
      countryRef.current = "";
      return;
    }

    const countryCode = countryMap.get(countryName);
    if (!countryCode) {
      console.warn(`Country code not found for: ${countryName}`);
      setCityOptions([]);
      setCurrentCountryForCities(countryName);
      countryRef.current = countryName;
      return;
    }

    if (currentCountryForCities === countryName && cityOptions.length > 0) {
      return;
    }

    setIsLoadingCities(true);
    setCurrentCountryForCities(countryName);
    countryRef.current = countryName;

    setTimeout(() => {
      try {
        const cities = City.getCitiesOfCountry(countryCode) ?? [];
        
        if (cities.length === 0) {
          console.warn(`No cities found for country code: ${countryCode} (${countryName})`);
        }

        const uniqueCities = Array.from(
          new Set(cities.map((city) => city.name.trim()))
        ).sort((a, b) => a.localeCompare(b));

        if (currentCity && !uniqueCities.includes(currentCity)) {
          uniqueCities.unshift(currentCity);
        }

        setCityOptions(uniqueCities);
      } catch (error) {
        console.error("Error loading cities:", error);
        setCityOptions([]);
      } finally {
        setIsLoadingCities(false);
      }
    }, 0);
  };

  const createdByInfo = organizationData?.data?.organization?.createdBy;
  const updatedByInfo = organizationData?.data?.organization?.updatedBy;

  const initialValues = useMemo(() => {
    if ((isEditMode || isViewMode) && organizationData?.data?.organization) {
      const org = organizationData.data.organization;
      return {
        organizationType: org.organizationType || "Hospital",
        name: org.name || "",
        email: org.email || "",
        phone: org.phone || "",
        country: org.country || defaultInitialValues.country,
        city: org.city || "",
        timezone: org.timezone || defaultInitialValues.timezone,
        address: org.address || "",
        venueTemplate:
          (typeof org.venueTemplate === "string"
            ? org.venueTemplate
            : org.venueTemplate?._id) || "",
        isActive: org.isActive ?? true,
      } satisfies CreateOrganizationFormValues;
    }

    return defaultInitialValues;
  }, [isEditMode, isViewMode, organizationData]);

  // Load cities when modal opens with initial country
  useEffect(() => {
    if (isOpen) {
      if (initialValues.country) {
        loadCitiesForCountry(initialValues.country, initialValues.city);
      } else {
        setCityOptions([]);
        setCurrentCountryForCities("");
        countryRef.current = "";
      }
    } else {
      setCityOptions([]);
      setCurrentCountryForCities("");
      countryRef.current = "";
      setIsLoadingCities(false);
    }
  }, [isOpen, initialValues.country, initialValues.city]);

  const timezoneOptions = useMemo(() => {
    const mapped = timezones.map((tz) => ({
      name: tz.label,
      value: tz.tzCode,
    }));

    if (
      initialValues.timezone &&
      !mapped.some((option) => option.value === initialValues.timezone)
    ) {
      mapped.unshift({
        name: initialValues.timezone,
        value: initialValues.timezone,
      });
    }

    return mapped;
  }, [initialValues.timezone]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (values: CreateOrganizationFormValues) => {
    const payload = { ...values } as Record<string, any>;

    Object.keys(payload).forEach((key) => {
      if (payload[key] === "" || payload[key] === null) {
        delete payload[key];
      }
    });

    try {
      if (isEditMode && organizationId) {
        await updateOrganization({
          id: organizationId,
          data: payload,
        }).unwrap();
        toast.success("Organization updated successfully");
      } else {
        await createOrganization(payload as CreateOrganizationFormValues).unwrap();
        toast.success("Organization created successfully");
      }
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error("Organization mutation error:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to save organization";
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  const modalTitle = isViewMode
    ? "View Organization"
    : isEditMode
    ? "Edit Organization"
    : "Create New Organization";

  const modalDescription = isViewMode
    ? "Organization details overview"
    : isEditMode
    ? "Update organization information"
    : "Set up a new venue for indoor navigation and positioning";

  const isMutationLoading = isCreating || isUpdating;
  const validationSchema = isViewMode
    ? undefined
    : isEditMode
    ? updateOrganizationSchema
    : createOrganizationSchema;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                {modalTitle}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {modalDescription}
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground transition-colors -mt-1 cursor-pointer p-1 h-auto"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {(isLoadingOrganization && (isEditMode || isViewMode)) ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Loading organization details...
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue }) => {
              return (
                <Form className="flex flex-col flex-1 overflow-hidden">
                  <div className="px-6 py-6 overflow-y-auto flex-1">
                    <VenueTemplateSelector
                      templates={venueTemplates}
                      selectedTemplateId={values.venueTemplate}
                      onTemplateSelect={(templateId) =>
                        setFieldValue("venueTemplate", templateId)
                      }
                      loading={isLoadingTemplates}
                      disabled={isViewMode}
                    />

                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">
                        Organization Details
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field name="organizationType">
                            {({ field, meta }: any) => (
                              <div>
                                <CustomSelect
                                  value={field.value}
                                  onChange={(value) =>
                                    setFieldValue("organizationType", value)
                                  }
                                  options={organizationTypeOptions}
                                  placeholder="Select organization type"
                                  label="Organization Type"
                                  required
                                  disabled={isViewMode}
                                  error={meta.error}
                                  touched={meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <p className="text-red-500 text-xs mt-1 font-medium">
                                    {meta.error}
                                  </p>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="name">
                            {({ field, meta }: any) => (
                              <div>
                                <CustomInput
                                  value={field.value}
                                  onChange={(value) => setFieldValue("name", value)}
                                  placeholder="e.g. CityCare Hospital"
                                  label="Organization Name"
                                  required
                                  disabled={isViewMode}
                                  error={meta.error}
                                  touched={meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <p className="text-red-500 text-xs mt-1 font-medium">
                                    {meta.error}
                                  </p>
                                )}
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field name="email">
                            {({ field, meta }: any) => (
                              <div>
                                <CustomInput
                                  value={field.value}
                                  onChange={(value) => setFieldValue("email", value)}
                                  placeholder="e.g. info@organization.com"
                                  label="Contact Email"
                                  required
                                  disabled={isViewMode}
                                  error={meta.error}
                                  touched={meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <p className="text-red-500 text-xs mt-1 font-medium">
                                    {meta.error}
                                  </p>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="phone">
                            {({ field, meta }: any) => (
                              <div>
                                <CustomInput
                                  value={field.value}
                                  onChange={(value) => setFieldValue("phone", value)}
                                  placeholder="e.g. +1-212-555-0199"
                                  label="Contact Phone"
                                  required
                                  disabled={isViewMode}
                                  error={meta.error}
                                  touched={meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <p className="text-red-500 text-xs mt-1 font-medium">
                                    {meta.error}
                                  </p>
                                )}
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field name="country">
                            {({ field, meta }: any) => (
                              <div>
                                <CustomSelect
                                  value={field.value}
                                  onChange={(value) => {
                                    setFieldValue("country", value);
                                    setFieldValue("city", "");
                                    loadCitiesForCountry(value);
                                  }}
                                  options={countryOptions}
                                  placeholder="Select country"
                                  label="Country"
                                  required
                                  disabled={isViewMode}
                                  error={meta.error}
                                  touched={meta.touched}
                                  searchable={true}
                                />
                                {meta.touched && meta.error && (
                                  <p className="text-red-500 text-xs mt-1 font-medium">
                                    {meta.error}
                                  </p>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="city">
                            {({ field, meta }: any) => (
                              <div>
                                <CustomSelect
                                  value={field.value}
                                  onChange={(value) => setFieldValue("city", value)}
                                  options={cityOptions}
                                  placeholder={
                                    isLoadingCities
                                      ? "Loading cities..."
                                      : cityOptions.length > 0
                                      ? "Select city"
                                      : "Select a country first"
                                  }
                                  label="City"
                                  required
                                  disabled={isLoadingCities || cityOptions.length === 0 || isViewMode}
                                  error={meta.error}
                                  touched={meta.touched}
                                  searchable={true}
                                />
                                {meta.touched && meta.error && (
                                  <p className="text-red-500 text-xs mt-1 font-medium">
                                    {meta.error}
                                  </p>
                                )}
                              </div>
                            )}
                          </Field>
                        </div>

                      <Field name="address">
                        {({ field, meta }: any) => (
                          <div>
                            <CustomInput
                              value={field.value}
                              onChange={(value) => setFieldValue("address", value)}
                              placeholder="e.g. 123 Main Street, New York, NY"
                              label="Full Address"
                              required
                              disabled={isViewMode}
                              error={meta.error}
                              touched={meta.touched}
                            />
                            {meta.touched && meta.error && (
                              <p className="text-red-500 text-xs mt-1 font-medium">
                                {meta.error}
                              </p>
                            )}
                          </div>
                        )}
                      </Field>

                      <Field name="timezone">
                        {({ field, meta }: any) => (
                          <div>
                            <CustomSelect
                              value={field.value}
                              onChange={(value) => setFieldValue("timezone", value)}
                              options={timezoneOptions}
                              placeholder="Select timezone"
                              label="Timezone"
                              required
                              disabled={isViewMode}
                              error={meta.error}
                              touched={meta.touched}
                            />
                            {meta.touched && meta.error && (
                              <p className="text-red-500 text-xs mt-1 font-medium">
                                {meta.error}
                              </p>
                            )}
                          </div>
                        )}
                      </Field>

                      <Field name="isActive">
                        {({ field }: any) => (
                          <ToggleSwitch
                            checked={field.value}
                            onChange={(checked) => {
                              if (!isViewMode) {
                                setFieldValue("isActive", checked);
                              }
                            }}
                            label="Organization Status"
                            description={
                              field.value
                                ? "The organization is active and accessible."
                                : "The organization is inactive and hidden from most workflows."
                            }
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                </div>

                {(createdByInfo || updatedByInfo) && (
                  <div className="border border-border rounded-xl p-4 bg-muted/30 space-y-2 text-xs text-muted-foreground">
                    {createdByInfo && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          Created by:
                        </span>
                        <span>
                          {createdByInfo.firstName} {createdByInfo.lastName} (
                          {createdByInfo.email})
                        </span>
                      </div>
                    )}
                    {updatedByInfo && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          Last updated by:
                        </span>
                        <span>
                          {updatedByInfo.firstName} {updatedByInfo.lastName} (
                          {updatedByInfo.email})
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-muted/50">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    className="px-5 py-2.5 cursor-pointer text-sm font-medium text-muted-foreground bg-transparent border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {isViewMode ? "Close" : "Cancel"}
                  </Button>

                  {!isViewMode && (
                    <Button
                      type="submit"
                      disabled={isMutationLoading}
                      className="px-5 flex gap-2 py-2.5 text-sm cursor-pointer font-medium text-white bg-[#3D8C6C] rounded-lg transition-colors hover:bg-[#3D8C6C]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Building2 className="w-4 h-4" />
                      {isMutationLoading
                        ? isEditMode
                          ? "Saving..."
                          : "Creating..."
                        : isEditMode
                        ? "Save Changes"
                        : "Create Organization"}
                    </Button>
                  )}
                </div>
              </Form>
              );
            }}
          </Formik>
        )}
      </div>
    </div>
  );
}
