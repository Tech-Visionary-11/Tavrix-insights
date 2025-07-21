import { configureStore } from '@reduxjs/toolkit'
import { agentApi } from './pages/agents/Agents.service'
import { analyticsApi } from './pages/agents/view/Analytics.service'
 
export const store = configureStore({
  reducer: {
    [agentApi.reducerPath]: agentApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer, // Assuming you have analyticsApi defined elsewhere
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(agentApi.middleware, analyticsApi.middleware), // Add the middleware for both APIs
})
