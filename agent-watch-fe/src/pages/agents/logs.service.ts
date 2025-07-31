import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from "js-cookie";

export const logsApi = createApi({
  reducerPath: 'logsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
     prepareHeaders: (headers) => {
    const token = Cookies.get('auth_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          return headers;
        },
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
