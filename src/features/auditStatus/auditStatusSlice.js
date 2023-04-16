import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import alertify from 'alertifyjs';


export const fetchStatus = createAsyncThunk('status/fetchStatus', async () => {
    const response = await axios.get('http://localhost:8000/AuditStatusViewSet/')
    return response.data
})

export const addCategory = createAsyncThunk('status/addCategory', async (category) => {
    const response = await axios.post('http://localhost:8000/AuditStatusViewSet/', category)
    return response.data
})


export const editCategory = createAsyncThunk('status/editCategory', async (category) => {
    const id = parseInt(category.get('id'))
    const response = await axios.put(`http://localhost:8000/AuditStatusViewSet/${id}/`, category)
    return response.data
})

export const deleteCategory = createAsyncThunk('status/deleteCategory', async (id) => {
    const response = await axios.delete(`http://localhost:8000/AuditStatusViewSet/${id}/`)
    return response.data
})

const initialState = {
    loading: false,
    categories: [],
}


const auditStatusSlice = createSlice({
    name: 'status',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchStatus.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchStatus.fulfilled, (state, action) => {
            state.loading = false
            state.categories = action.payload
        })
        builders.addCase(fetchStatus.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error(action.error.message);
        })
        builders.addCase(addCategory.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(addCategory.fulfilled, (state, action) => {
            state.loading = false
            state.categories.push(action.payload)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Status Added Successfully");
        })
        builders.addCase(addCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Status Not Added");
        })
        builders.addCase(editCategory.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(editCategory.fulfilled, (state, action) => {
            state.loading = false
            const {id, name, description} = action.payload
            const doesExist = state.categories.find(category => category.id === id)
            if (doesExist) {
                doesExist.name = name
                doesExist.description = description
            }
            alertify.set('notifier','position', 'top-right');
            alertify.success("Status Edited Successfully");
        })
        builders.addCase(editCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Status Not Edited");
        })
        builders.addCase(deleteCategory.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteCategory.fulfilled, (state, action) => {
            state.loading = false
            const id = parseInt(action.meta.arg)
            state.categories = state.categories.filter(category => category.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Status Deleted Successfully");
        })
        builders.addCase(deleteCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Status Not Deleted");
        })
    }
})

export default auditStatusSlice.reducer
export const getAllStatus = (state) => state.status.categories
export const isLoading = (state) => state.status.loading