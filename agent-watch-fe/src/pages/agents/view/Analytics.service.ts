import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + "analytics",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStepperById: builder.query<any, string>({
      query: (id) => `/stepper/${id}`,
    }),
    getSessionVolume: builder.query<any, { agent_id: string; group_by?: string }>({
      query: ({ agent_id, group_by = "day" }) => ({
        url: "/sessions/volume",
        params: { agent_id, group_by },
      }),
    }),
    getSessionStatusPie: builder.query<Record<string, number>, { agent_id: string }>({
      query: ({ agent_id }) => ({
        url: "/sessions/status-pie",
        params: { agent_id },
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
    getAgentHighlights: builder.query<
      {
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
      },
      void
    >({
      query: () => "/highlights",
    }),
  }), 
});

export const {
  useGetStepperByIdQuery,
  useGetSessionVolumeQuery,
  useGetSessionStatusPieQuery,
  useGetCostSummaryQuery,
  useGetAgentHighlightsQuery,
} = analyticsApi;
