import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authServices from './authService';

// Get user from localStorage

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user || null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

// Register user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        return await authServices.register(user);
    }
    catch (err: any) {
        const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

        return thunkAPI.rejectWithValue(message);
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {

                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action: any) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload;
                state.user = null;
            })
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
