import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SessionQueryParams } from './AgentsTypes';
import Cookies from "js-cookie";

export const sessionApi = createApi({
  reducerPath: 'sessionApi',
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
    getSessions: builder.query<any[], SessionQueryParams>({
      query: (params) => ({
        url: 'sessions/',
        params: {
          agent_id: params.agent_id,
          status: params.status,
          tag: params.tag,
          since: params.since,
          until: params.until,
          limit: params.limit ?? 50,
          offset: params.offset ?? 0,
        },
      }),
    }),
  }),
});

export const {
  useGetSessionsQuery
} = sessionApi;
