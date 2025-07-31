import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Agent, AgentCreateInput, AgentUpdateInput } from './AgentsTypes';
import Cookies from "js-cookie";

export const agentApi = createApi({
  reducerPath: 'agentApi',
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
  tagTypes: ['Agent'],
  endpoints: (builder) => ({
    getAgents: builder.query<any[], void>({
      query: () => 'agents/',
      providesTags: ['Agent'],
    }),
    getAgent: builder.query<Agent, string>({
      query: (id) => `/agents/${id}`,
      providesTags: (result, error, id) => [{ type: 'Agent', id }],
    }),
    createAgent: builder.mutation<AgentCreateInput, any>({
      query: (data) => ({
        url: 'agents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Agent'],
    }),
    updateAgent: builder.mutation<Agent, { id: string; data: AgentUpdateInput }>({
      query: ({ id, data }) => ({
        url: `/agents/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (res, err, { id }) => [{ type: 'Agent', id }],
    }),
    deleteAgent: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/agents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Agent'],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useGetAgentQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
} = agentApi;
