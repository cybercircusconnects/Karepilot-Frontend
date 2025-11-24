import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mapEditorReducer from './slices/mapEditorSlice';
import { authApi } from '../api/authApi';
import { settingsApi } from '../api/settingsApi';
import { departmentsApi } from '../api/departmentsApi';
import { rolesApi } from '../api/rolesApi';
import { usersApi } from '../api/usersApi';
import { venueTemplatesApi } from '../api/venueTemplatesApi';
import { organizationsApi } from '../api/organizationsApi';
import { pointsOfInterestApi } from '../api/pointsOfInterestApi';
import { floorPlansApi } from '../api/floorPlansApi';
import { mapSettingsApi } from '../api/mapSettingsApi';
import { buildingsApi } from '../api/buildingsApi';
import { mapEditorPOIApi } from '../api/mapEditorPOIApi';
import { mapEditorEntranceApi } from '../api/mapEditorEntranceApi';
import { mapEditorElevatorApi } from '../api/mapEditorElevatorApi';
import { mapEditorPathApi } from '../api/mapEditorPathApi';
import { mapEditorRestrictedZoneApi } from '../api/mapEditorRestrictedZoneApi';
import { mapEditorLabelApi } from '../api/mapEditorLabelApi';
import { mapEditorMeasurementApi } from '../api/mapEditorMeasurementApi';
import { mapEditorAnnotationApi } from '../api/mapEditorAnnotationApi';
import { mapEditorPreferencesApi } from '../api/mapEditorPreferencesApi';
import { assetTrackingApi } from '../api/assetTrackingApi';
import { dashboardApi } from '../api/dashboardApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mapEditor: mapEditorReducer,
    [authApi.reducerPath]: authApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [venueTemplatesApi.reducerPath]: venueTemplatesApi.reducer,
    [organizationsApi.reducerPath]: organizationsApi.reducer,
    [pointsOfInterestApi.reducerPath]: pointsOfInterestApi.reducer,
    [floorPlansApi.reducerPath]: floorPlansApi.reducer,
    [mapSettingsApi.reducerPath]: mapSettingsApi.reducer,
    [buildingsApi.reducerPath]: buildingsApi.reducer,
    [mapEditorPOIApi.reducerPath]: mapEditorPOIApi.reducer,
    [mapEditorEntranceApi.reducerPath]: mapEditorEntranceApi.reducer,
    [mapEditorElevatorApi.reducerPath]: mapEditorElevatorApi.reducer,
    [mapEditorPathApi.reducerPath]: mapEditorPathApi.reducer,
    [mapEditorRestrictedZoneApi.reducerPath]: mapEditorRestrictedZoneApi.reducer,
    [mapEditorLabelApi.reducerPath]: mapEditorLabelApi.reducer,
    [mapEditorMeasurementApi.reducerPath]: mapEditorMeasurementApi.reducer,
    [mapEditorAnnotationApi.reducerPath]: mapEditorAnnotationApi.reducer,
    [mapEditorPreferencesApi.reducerPath]: mapEditorPreferencesApi.reducer,
    [assetTrackingApi.reducerPath]: assetTrackingApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      settingsApi.middleware,
      departmentsApi.middleware,
      rolesApi.middleware,
      usersApi.middleware,
      venueTemplatesApi.middleware,
      organizationsApi.middleware,
      pointsOfInterestApi.middleware,
      floorPlansApi.middleware,
      mapSettingsApi.middleware,
      buildingsApi.middleware,
      mapEditorPOIApi.middleware,
      mapEditorEntranceApi.middleware,
      mapEditorElevatorApi.middleware,
      mapEditorPathApi.middleware,
      mapEditorRestrictedZoneApi.middleware,
      mapEditorLabelApi.middleware,
      mapEditorMeasurementApi.middleware,
      mapEditorAnnotationApi.middleware,
      mapEditorPreferencesApi.middleware,
      assetTrackingApi.middleware,
      dashboardApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
