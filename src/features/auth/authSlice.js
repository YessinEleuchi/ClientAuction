import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import jwt_decode from 'jwt-decode';

// 1️⃣ Lire le token depuis localStorage au démarrage
const userToken = localStorage.getItem('accessToken');
let initialUser = null;

if (userToken) {
    try {
        const decoded = jwt_decode(userToken);

        initialUser = {
            id: decoded.sub, // ✅ ici corrigé : utiliser sub
            access: userToken,
            refresh: localStorage.getItem('refreshToken'),
        };
    } catch (error) {
        console.error('Invalid access token', error);
    }
}

// 2️⃣ Initial State
const initialState = {
    user: initialUser,
    guestUser: null,
    profile: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
    otpResent: false,
};

// 3️⃣ Thunks
export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
    try {
        return await authService.register(user);
    } catch (error) {
        const message = (error.response?.data?.data) || error.response?.data?.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try {
        return await authService.login(user);
    } catch (error) {
        const message = (error.response?.data?.data) || error.response?.data?.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        return await authService.logout();
    } catch (error) {
        const message = (error.response?.data?.data) || error.response?.data?.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const activate = createAsyncThunk("auth/activate", async (user, thunkAPI) => {
    try {
        return await authService.activate(user);
    } catch (error) {
        const message = (error.response?.data?.data) || error.response?.data?.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const resendActivationEmail = createAsyncThunk("auth/resendActivationEmail", async (user, thunkAPI) => {
    try {
        return await authService.resendActivationEmail(user);
    } catch (error) {
        const message = (error.response?.data?.data) || error.response?.data?.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const requestPasswordReset = createAsyncThunk("auth/requestPasswordReset", async (user, thunkAPI) => {
    try {
        return await authService.requestPasswordReset(user);
    } catch (error) {
        const message = (error.response?.data?.data) || error.response?.data?.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const setNewPassword = createAsyncThunk("auth/setNewPassword", async (user, thunkAPI) => {
    try {
        return await authService.setNewPassword(user);
    } catch (error) {
        const message = (error.response?.data?.data) || error.response?.data?.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getProfile = createAsyncThunk("auctioneer/getProfile", async (_, thunkAPI) => {
    try {
        return await authService.getProfile();
    } catch (error) {
        const message = (error.response?.data?.data) || error.response?.data?.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateProfile = createAsyncThunk("auctioneer/updateProfile", async (user, thunkAPI) => {
    try {
        return await authService.updateProfile(user);
    } catch (error) {
        const message = (error.response?.data?.data) || error.response?.data?.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// 4️⃣ Slice
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
            state.otpResent = false;
        },
        refreshToken: (state, action) => {
            let userDict = action.payload;
            userDict['id'] = jwt_decode(action.payload.access).sub; // ✅ corrigé ici aussi
            state.user = userDict;
        },
        resetUser: (state) => {
            state.user = null;
        },
        updateUserState: (state, action) => {
            state.user = action.payload;
        },
        updateGuestUser: (state, action) => {
            state.guestUser = action.payload;
        },
        resetGuestUser: (state) => {
            state.guestUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(register.pending, (state) => { state.isLoading = true; })
          .addCase(register.fulfilled, (state, action) => {
              state.isLoading = false;
              state.isSuccess = true;
              state.user = action.payload.data;
              state.message = action.payload.message;
          })
          .addCase(register.rejected, (state, action) => {
              state.isLoading = false;
              state.isError = true;
              state.message = action.payload;
          })
          .addCase(login.pending, (state) => { state.isLoading = true; })
          .addCase(login.fulfilled, (state, action) => {
              state.isLoading = false;
              state.isSuccess = true;

              const { user, tokens } = action.payload.data;
              let userDict = user;
              const jwt_data = jwt_decode(tokens.access);

              userDict['id'] = jwt_data.sub; // ✅ id correct
              userDict['access'] = tokens.access;
              userDict['refresh'] = tokens.refresh;

              // Enregistrer tokens
              localStorage.setItem('accessToken', tokens.access);
              localStorage.setItem('refreshToken', tokens.refresh);

              state.user = userDict;
          })
          .addCase(login.rejected, (state, action) => {
              state.isLoading = false;
              state.isError = true;
              state.user = null;
              state.message = action.payload;
          })
          .addCase(logout.pending, (state) => { state.isLoading = true; })
          .addCase(logout.fulfilled, (state) => {
              state.isLoading = false;
              state.user = null;
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
          })
          .addCase(logout.rejected, (state) => {
              state.isLoading = false;
              state.user = null;
          })
          .addCase(getProfile.fulfilled, (state, action) => {
              state.isSuccess = true;
              state.profile = action.payload.data;
              state.message = action.payload.message;
          })
          .addCase(getProfile.rejected, (state, action) => {
              state.isError = true;
              state.message = action.payload;
          })
          .addCase(updateProfile.fulfilled, (state, action) => {
              state.isLoading = false;
              state.isSuccess = true;
              state.message = action.payload.message;
          })
          .addCase(updateProfile.rejected, (state, action) => {
              state.isLoading = false;
              state.isError = true;
              state.message = action.payload;
          });
    }
});

// 5️⃣ Exports
export const { reset, refreshToken, resetUser, updateUserState, updateGuestUser, resetGuestUser } = authSlice.actions;
export default authSlice.reducer;