import { configureStore } from '@reduxjs/toolkit'
import { agentApi } from './pages/agents/Agents.service'
 
export const store = configureStore({
  reducer: {
    [agentApi.reducerPath]: agentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(agentApi.middleware),
})
