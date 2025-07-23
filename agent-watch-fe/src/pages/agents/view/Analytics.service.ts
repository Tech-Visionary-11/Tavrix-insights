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
    getSessionVolume: builder.query<any, any>({
       query: ({ agent_id, group_by = "day" }) => ({
        url: "/sessions/volume",
        params: { agent_id, group_by },
      }),
    }),
    getSessionStatusPie: builder.query<Record<string, number>, { agent_id: string }>({
  query: ({ agent_id }) => ({
    url: "/sessions/status-pie",
    params: { agent_id }
  }),
}),

getCostSummary: builder.query<
  { total_cost: number; session_count: number; avg_cost_per_session: number },
  { agent_id: string }
>({
  query: ({ agent_id }) => ({
    url: "/cost/summary",
    params: { agent_id },
  }),
}),
 getAgentHighlights: builder.query<{
      total_cost: number;
      most_costly_agent: {
        id: string;
        name: string;
        total_cost: number;
      } | null;
      most_failures: {
        agent: {
          id: string;
          name: string;
          failure_count: number;
        } | null;
      };
      most_active: {
        agent: {
          id: string;
          name: string;
          session_count: number;
        } | null;
      };
    }, void>({
      query: () => "/highlights",
    }),
  }), 
});

export const {
  useGetStepperByIdQuery,
  useGetSessionVolumeQuery,
  useGetSessionStatusPieQuery,
  useGetCostSummaryQuery,
  useGetAgentHighlightsQuery
} = analyticsApi;
