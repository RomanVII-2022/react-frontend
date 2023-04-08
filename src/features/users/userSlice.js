import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('http://localhost:8000/users/')
    return response.data
})

const initialState = {
    users: []
}


const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchUsers.pending, (state, action) => {
            console.log('Loading...')
        })
        builders.addCase(fetchUsers.fulfilled, (state, action) => {
            console.log("fullfilled...")
            state.users = action.payload
        })
        builders.addCase(fetchUsers.rejected, (state, action) => {
            console.log("An error occured")
        })
    }
})

export default userSlice.reducer
export const getAllUsers = (state) => state.user.users