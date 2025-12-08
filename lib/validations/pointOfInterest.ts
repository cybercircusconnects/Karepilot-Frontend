import * as Yup from "yup";

export const pointOfInterestValidationSchema = Yup.object({
  organizationId: Yup.string().required("Organization is required"),
  name: Yup.string().required("Name is required"),
  category: Yup.string().required("Category is required"),
  building: Yup.string().required("Building is required"),
  floor: Yup.string().required("Floor is required"),
  status: Yup.string().required("Status is required"),
  email: Yup.string().email("Enter a valid email").optional(),
  latitude: Yup.string()
    .nullable()
    .optional()
    .test("is-valid-latitude", "Latitude must be between -90 and 90", (value) => {
      if (!value || value.trim() === "") return true;
      const num = parseFloat(value);
      if (isNaN(num)) return false;
      return num >= -90 && num <= 90;
    }),
  longitude: Yup.string()
    .nullable()
    .optional()
    .test("is-valid-longitude", "Longitude must be between -180 and 180", (value) => {
      if (!value || value.trim() === "") return true;
      const num = parseFloat(value);
      if (isNaN(num)) return false;
      return num >= -180 && num <= 180;
    }),
});