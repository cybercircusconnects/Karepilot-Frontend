import { createApi } from "@reduxjs/toolkit/query/react";
import { DashboardResponse } from "../types/dashboard/dashboard";
import { baseQuery } from "./baseConfig";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardResponse, string>({
      query: (organizationId) => `/users/admin/dashboard/${organizationId}`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;

