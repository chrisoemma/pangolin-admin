import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authService, type LoginData, type AdminUser } from "../../services/authService"
import { apiClient } from "../../lib/api-client"

interface AuthState {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Load auth state from localStorage on initialization
if (typeof window !== "undefined") {
  const storedToken = localStorage.getItem("auth_token")
  const storedUser = localStorage.getItem("auth_user")
  const tokenExpires = localStorage.getItem("auth_token_expires")

  if (storedToken && storedUser) {
    // Check if token is expired
    if (tokenExpires && Date.now() < parseInt(tokenExpires, 10)) {
      try {
        initialState.user = JSON.parse(storedUser)
        initialState.token = storedToken
        initialState.isAuthenticated = true
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        localStorage.removeItem("auth_token_expires")
      }
    } else {
      // Token expired, clear storage
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token_expires")
    }
  }
}

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(data)
      if (response.status && response.data && response.token) {
        // Store token and user data
        apiClient.setToken(response.token)
        apiClient.setUserData(response.data.user)

        return {
          user: response.data.user,
          token: response.token,
        }
      }
      return rejectWithValue(response.message || "Login failed")
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      )
    }
  }
)

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout error:", error)
    } finally {
      // Clear local storage
      apiClient.removeToken()
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    checkAuth: (state) => {
      if (apiClient.isTokenExpired()) {
        // Only update if state is different
        if (state.isAuthenticated || state.user || state.token) {
          state.user = null
          state.token = null
          state.isAuthenticated = false
        }
        apiClient.removeToken()
        return
      }

      const userData = apiClient.getUserData()
      const token = apiClient.getToken()

      if (userData && token) {
        // Only update if something actually changed
        const userStr = JSON.stringify(state.user)
        const newUserStr = JSON.stringify(userData)
        const tokenChanged = state.token !== token
        const authChanged = state.isAuthenticated !== true

        if (userStr !== newUserStr || tokenChanged || authChanged) {
          state.user = userData
          state.token = token
          state.isAuthenticated = true
        }
      } else {
        // Only update if state is different
        if (state.isAuthenticated || state.user || state.token) {
          state.user = null
          state.token = null
          state.isAuthenticated = false
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, checkAuth } = authSlice.actions
export default authSlice.reducer

