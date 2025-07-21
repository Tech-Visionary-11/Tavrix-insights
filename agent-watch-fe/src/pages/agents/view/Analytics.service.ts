// src/api/analyticsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL +"analytics" , // should be http://127.0.0.1:8000/analytics
  }),
  endpoints: (builder) => ({
    getStepperById: builder.query<any, string>({
      query: (id) => `/stepper/${id}`,
    }),
  }),
});

export const {
  useGetStepperByIdQuery,
} = analyticsApi;
