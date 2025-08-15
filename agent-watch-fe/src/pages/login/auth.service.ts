import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
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
interface User { 
  email: string,
  role: string       
  account_type: "org"| "personal"
  id: string;
  organization_name?: string
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
    getMe: builder.query<User, void>({
      query: () => {
        const token = Cookies.get("auth_token");
        return {
          url: "/auth/me",
          method: "GET",
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        };
      },
    }),
  }),
});

export const {
  usePersonalRegisterMutation,
  useOrgRegisterMutation,
  useLoginMutation,
useGetMeQuery
} = authApi;

