import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import alertify from 'alertifyjs';


export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('http://localhost:8000/users/')
    return response.data
})

export const addUser = createAsyncThunk('user/addUser', async (user) => {
    const role = parseInt(user.role.value)
    const status = parseInt(user.status.value)
    const response = await axios.post('http://localhost:8000/users/', {
        "name": user.name.value,
        "email": user.email.value,
        "phone": user.phone.value,
        "jobTitle": user.jobTitle.value,
        "password": user.password.value,
        "role": role,
        "status": status
    })
    return response.data
})

const initialState = {
    loading: false,
    users: [],
}


const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchUsers.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false
            state.users = action.payload
        })
        builders.addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error(action.error.message);
        })
        builders.addCase(addUser.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(addUser.fulfilled, (state, action) => {
            state.loading = false
            state.users.push(action.payload)
            alertify.set('notifier','position', 'top-right');
            alertify.success("User Added Successfully");
        })
        builders.addCase(addUser.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! User Not Added");
        })
    }
})

export default userSlice.reducer
export const getAllUsers = (state) => state.user.users
export const isLoading = (state) => state.user.loading