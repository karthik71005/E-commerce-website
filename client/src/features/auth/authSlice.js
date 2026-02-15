import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

// Register user
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/auth/register', userData)
        return response.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.detail) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        // Determine if userData is JSON or FormData (OAuth2 expects form data for correct token endpoint usage)
        // But our login endpoint is expecting OAuth2PasswordRequestForm which is form-data.
        const formData = new FormData();
        formData.append('username', userData.email); // OAuth2 expects 'username', not 'email'
        formData.append('password', userData.password);

        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        // After login, we might want to get user details to know the role
        if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data))

            // Fetch user details to get role
            const meResponse = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${response.data.access_token}` }
            })
            const fullUser = { ...response.data, ...meResponse.data }
            localStorage.setItem('user', JSON.stringify(fullUser))
            return fullUser
        }
        return response.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.detail) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user')
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                // state.user = action.payload // Usually we require login after register
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
    },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
