import { configureStore } from '@reduxjs/toolkit'
import { agentApi } from './pages/agents/Agents.service'
import { analyticsApi } from './pages/agents/view/Analytics.service'
import { sessionApi } from './pages/agents/sessions.service'
import { logsApi } from './pages/agents/logs.service'
import { authApi } from './pages/login/auth.service'
 
export const store = configureStore({
  reducer: {
    [agentApi.reducerPath]: agentApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [logsApi.reducerPath]: logsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, agentApi.middleware, analyticsApi.middleware,sessionApi.middleware,logsApi.middleware), // Add the middleware for both APIs
})
