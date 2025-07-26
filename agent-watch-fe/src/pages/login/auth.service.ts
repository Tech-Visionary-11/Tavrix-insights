import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface PersonalRegisterInput {
  email: string;
  password: string;
}

interface OrgRegisterInput {
  name: string;
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  endpoints: (builder) => ({
    personalRegister: builder.mutation<TokenResponse, PersonalRegisterInput>({
      query: (body) => ({
        url: "auth/personal-register",
        method: "POST",
        body,
      }),
    }),
    orgRegister: builder.mutation<TokenResponse, OrgRegisterInput>({
      query: (body) => ({
        url: "auth/org-register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<
      TokenResponse,
      { username: string; password: string }
    >({
      query: ({ username, password }) => ({
        url: "auth/login",
        method: "POST",
        body: new URLSearchParams({
          username,
          password,
        }),
      }),
    }),
  }),
});

export const {
  usePersonalRegisterMutation,
  useOrgRegisterMutation,
  useLoginMutation,
} = authApi;
