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


export const editUser = createAsyncThunk('user/editUser', async (user) => {
    const role = parseInt(user.get('role'))
    user.set('role', role)
    const status = parseInt(user.get('status'))
    user.set('status', status)
    const id = parseInt(user.get('id'))
    const response = await axios.put(`http://localhost:8000/users/${id}/`, user)
    return response.data
})

export const deleteUser = createAsyncThunk('user/deleteUser', async (id) => {
    const response = await axios.delete(`http://localhost:8000/users/${id}/`)
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
        builders.addCase(editUser.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(editUser.fulfilled, (state, action) => {
            state.loading = false
            const {id, name, email, phone, jobTitle, password, role, status} = action.payload
            const doesExist = state.users.find(user => user.id === id)
            if (doesExist) {
                doesExist.name = name
                doesExist.email = email
                doesExist.phone = phone
                doesExist.jobTitle = jobTitle
                doesExist.password = password
                doesExist.role = role
                doesExist.status = status
            }
            alertify.set('notifier','position', 'top-right');
            alertify.success("User Edited Successfully");
        })
        builders.addCase(editUser.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! User Not Edited");
        })
        builders.addCase(deleteUser.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteUser.fulfilled, (state, action) => {
            state.loading = false
            const id = parseInt(action.meta.arg)
            state.users = state.users.filter(user => user.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("User Deleted Successfully");
        })
        builders.addCase(deleteUser.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! User Not Deleted");
        })
    }
})

export default userSlice.reducer
export const getAllUsers = (state) => state.user.users
export const isLoading = (state) => state.user.loading