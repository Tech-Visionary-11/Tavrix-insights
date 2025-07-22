import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const logsApi = createApi({
  reducerPath: 'logsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  tagTypes: ['session'],
  endpoints: (builder) => ({
   getSessionLogs: builder.query<any[],{sessionId:string} >({
      query: (params) => ({
        url: `sessions/${params.sessionId}/logs`,
      }),
    }),
})
});

export const {
    useGetSessionLogsQuery
} = logsApi;
