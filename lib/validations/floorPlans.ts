import * as Yup from "yup";

export interface CreateFloorPlanFormValues {
  organizationId: string;
  buildingId: string;
  floorLabel: string;
  mapName: string;
  mapScale: string;
  description: string;
  latitude?: string;
  longitude?: string;
  tags?: string[];
  selectedFile: File | null;
}

const fileValidation = Yup.mixed<File>()
  .test("fileType", "Unsupported file format. Supported: PDF, PNG, JPG, SVG, DWG, CAD", (value) => {
    if (!value) return true; 
    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "application/acad",
      "application/x-dwg",
    ];
    const validExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".svg", ".dwg", ".cad"];
    const fileName = value.name.toLowerCase();
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext));
    return validTypes.includes(value.type) || hasValidExtension;
  })
  .test("fileSize", "File size must be less than 10MB", (value) => {
    if (!value) return true; 
    return value.size <= 10 * 1024 * 1024; 
  });

export const createFloorPlanSchema = Yup.object().shape({
  organizationId: Yup.string().required("Organization is required"),
  buildingId: Yup.string().required("Building is required"),
  floorLabel: Yup.string().required("Floor is required"),
  mapName: Yup.string()
    .min(2, "Map name must be at least 2 characters")
    .max(120, "Map name cannot exceed 120 characters")
    .required("Map name is required"),
  mapScale: Yup.string()
    .required("Map scale is required")
    .matches(/^1:\d+$/, "Scale must be in format 1:XXX (e.g., 1:100)"),
  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
    .required(),
  latitude: Yup.string()
    .optional()
    .test("is-valid-latitude", "Latitude must be between -90 and 90", (value) => {
      if (!value || value.trim() === "") return true;
      const num = parseFloat(value);
      if (isNaN(num)) return false;
      return num >= -90 && num <= 90;
    }),
  longitude: Yup.string()
    .optional()
    .test("is-valid-longitude", "Longitude must be between -180 and 180", (value) => {
      if (!value || value.trim() === "") return true;
      const num = parseFloat(value);
      if (isNaN(num)) return false;
      return num >= -180 && num <= 180;
    }),
  tags: Yup.array()
    .of(Yup.string().max(40, "Tag cannot exceed 40 characters"))
    .optional(),
  selectedFile: fileValidation.required("Please select a file to upload"),
});

export const updateFloorPlanSchema = Yup.object().shape({
  organizationId: Yup.string().required("Organization is required"),
  buildingId: Yup.string().required("Building is required"),
  floorLabel: Yup.string().required("Floor is required"),
  mapName: Yup.string()
    .min(2, "Map name must be at least 2 characters")
    .max(120, "Map name cannot exceed 120 characters")
    .required("Map name is required"),
  mapScale: Yup.string()
    .required("Map scale is required")
    .matches(/^1:\d+$/, "Scale must be in format 1:XXX (e.g., 1:100)"),
  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
    .required(),
  latitude: Yup.string()
    .optional()
    .test("is-valid-latitude", "Latitude must be between -90 and 90", (value) => {
      if (!value || value.trim() === "") return true;
      const num = parseFloat(value);
      if (isNaN(num)) return false;
      return num >= -90 && num <= 90;
    }),
  longitude: Yup.string()
    .optional()
    .test("is-valid-longitude", "Longitude must be between -180 and 180", (value) => {
      if (!value || value.trim() === "") return true;
      const num = parseFloat(value);
      if (isNaN(num)) return false;
      return num >= -180 && num <= 180;
    }),
  tags: Yup.array()
    .of(Yup.string().max(40, "Tag cannot exceed 40 characters"))
    .optional(),
});

