import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import generalService from './generalService'; // Assurez-vous que le chemin est correct

// État initial
const initialState = {
    sitedetails: {},
    reviews: [],
    isError: false,
    isLoading: false,
    subscriptionLoading: false,
    isSuccess: false,
    message: ''
};

// Async thunk pour récupérer les détails du site
export const getSitedetails = createAsyncThunk('sitedetails/get', async (_, thunkAPI) => {
    try {
        return await generalService.getSitedetails();
    } catch (error) {
        const message = 
            (error.response && error.response.data && error.response.data.data) || 
            error.response.data.message || 
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Async thunk pour récupérer les reviews
export const getReviews = createAsyncThunk('reviews/getAll', async (_, thunkAPI) => {
    try {
        return await generalService.getReviews();
    } catch (error) {
        const message = 
            (error.response && error.response.data && error.response.data.data) || 
            error.response.data.message || 
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Async thunk pour l'abonnement
export const subscribe = createAsyncThunk('subscribe/post', async (data, thunkAPI) => {
    try {
        return await generalService.subscribe(data);
    } catch (error) {
        const message = 
            (error.response && error.response.data && error.response.data.data) || 
            error.response.data.message || 
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Création du slice
export const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.subscriptionLoading = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // getSitedetails cases
            .addCase(getSitedetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSitedetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.sitedetails = action.payload.data;
            })
            .addCase(getSitedetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            // getReviews cases
            .addCase(getReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reviews = action.payload.data;
            })
            .addCase(getReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            // subscribe cases
            .addCase(subscribe.pending, (state) => {
                state.subscriptionLoading = true;
            })
            .addCase(subscribe.fulfilled, (state, action) => {
                state.subscriptionLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message || 'Subscription successful';
            })
            .addCase(subscribe.rejected, (state, action) => {
                state.subscriptionLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

// Export des actions
export const { reset } = generalSlice.actions;

// Export du reducer
export default generalSlice.reducer;