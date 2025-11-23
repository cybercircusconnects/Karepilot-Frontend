import { FilterOption } from "./types";

export const typeFilters: FilterOption[] = [
  { label: "All Types", value: "all", checked: true },
  { label: "Devices", value: "device", checked: false },
  { label: "Equipment", value: "equipment", checked: false },
  { label: "Staff", value: "staff", checked: false },
  { label: "Personnel", value: "personnel", checked: false },
];
