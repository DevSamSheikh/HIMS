import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  isFreeTrialActive: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  isFreeTrialActive: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      // Save user data to localStorage for demo purposes
      localStorage.setItem("hims_user", JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isFreeTrialActive = false;
      // Remove user data from localStorage
      localStorage.removeItem("hims_user");
    },
    checkAuth: (state) => {
      const user = localStorage.getItem("hims_user");
      if (user) {
        state.isAuthenticated = true;
        state.user = JSON.parse(user);
      }
    },
    activateFreeTrial: (state) => {
      state.isFreeTrialActive = true;
      state.isAuthenticated = true;
      // Create a basic user object for the trial
      const trialUser = {
        id: "trial-user",
        name: "Trial User",
        email: "trial@example.com",
        role: "trial",
        trialActivatedAt: new Date().toISOString(),
      };
      state.user = trialUser;
      localStorage.setItem("hims_user", JSON.stringify(trialUser));
    },
    setSelectedModules: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.selectedModules = action.payload;
        localStorage.setItem("hims_user", JSON.stringify(state.user));
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  checkAuth,
  activateFreeTrial,
  setSelectedModules,
} = authSlice.actions;

export default authSlice.reducer;
