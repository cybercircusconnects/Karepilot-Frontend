import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AssetListResponse,
  AssetResponse,
  AssetStatsResponse,
  CreateAssetRequest,
  UpdateAssetRequest,
  AssetQuery,
  UpdateAssetLocationRequest,
  UpdateAssetBatteryRequest,
} from "../types/asset-tracking/asset";
import { baseQuery } from "./baseConfig";

export const assetTrackingApi = createApi({
  reducerPath: "assetTrackingApi",
  baseQuery,
  tagTypes: ["Assets", "AssetStats"],
  endpoints: (builder) => ({
    getAssets: builder.query<AssetListResponse, AssetQuery>({
      query: (params) => ({
        url: "/users/admin/asset-tracking/assets",
        params,
      }),
      providesTags: ["Assets"],
    }),
    getAssetById: builder.query<AssetResponse, string>({
      query: (id) => `/users/admin/asset-tracking/assets/${id}`,
      providesTags: (result, error, id) => [{ type: "Assets", id }],
    }),
    createAsset: builder.mutation<AssetResponse, CreateAssetRequest>({
      query: (data) => ({
        url: "/users/admin/asset-tracking/assets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assets", "AssetStats"],
    }),
    updateAsset: builder.mutation<
      AssetResponse,
      { id: string; data: UpdateAssetRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/admin/asset-tracking/assets/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Assets", id },
        "Assets",
        "AssetStats",
      ],
    }),
    deleteAsset: builder.mutation<AssetResponse, string>({
      query: (id) => ({
        url: `/users/admin/asset-tracking/assets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assets", "AssetStats"],
    }),
    getAssetStats: builder.query<AssetStatsResponse, { organizationId?: string }>({
      query: (params) => ({
        url: "/users/admin/asset-tracking/assets/stats",
        params,
      }),
      providesTags: ["AssetStats"],
    }),
    updateAssetLocation: builder.mutation<
      AssetResponse,
      { id: string; data: UpdateAssetLocationRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/admin/asset-tracking/assets/${id}/location`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Assets", id },
        "Assets",
        "AssetStats",
      ],
    }),
    updateAssetBattery: builder.mutation<
      AssetResponse,
      { id: string; data: UpdateAssetBatteryRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/admin/asset-tracking/assets/${id}/battery`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Assets", id },
        "Assets",
        "AssetStats",
      ],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetByIdQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useGetAssetStatsQuery,
  useUpdateAssetLocationMutation,
  useUpdateAssetBatteryMutation,
} = assetTrackingApi;

