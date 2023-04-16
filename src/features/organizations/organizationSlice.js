import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import alertify from 'alertifyjs';


export const fetchOrganizations = createAsyncThunk('organization/fetchOrganizations', async () => {
    const response = await axios.get('http://localhost:8000/AuditOrganizationViewSet/')
    return response.data
})

export const addCategory = createAsyncThunk('organization/addCategory', async (category) => {
    const response = await axios.post('http://localhost:8000/AuditOrganizationViewSet/', category)
    return response.data
})


export const editCategory = createAsyncThunk('organization/editCategory', async (category) => {
    const id = parseInt(category.get('id'))
    const response = await axios.put(`http://localhost:8000/AuditOrganizationViewSet/${id}/`, category)
    return response.data
})

export const deleteCategory = createAsyncThunk('organization/deleteCategory', async (id) => {
    const response = await axios.delete(`http://localhost:8000/AuditOrganizationViewSet/${id}/`)
    return response.data
})

const initialState = {
    loading: false,
    categories: [],
}


const organizationSlice = createSlice({
    name: 'organization',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchOrganizations.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchOrganizations.fulfilled, (state, action) => {
            state.loading = false
            state.categories = action.payload
        })
        builders.addCase(fetchOrganizations.rejected, (state, action) => {
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
            alertify.success("Organization Added Successfully");
        })
        builders.addCase(addCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Organization Not Added");
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
            alertify.success("Organization Edited Successfully");
        })
        builders.addCase(editCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Organization Not Edited");
        })
        builders.addCase(deleteCategory.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteCategory.fulfilled, (state, action) => {
            state.loading = false
            const id = parseInt(action.meta.arg)
            state.categories = state.categories.filter(category => category.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Organization Deleted Successfully");
        })
        builders.addCase(deleteCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Organization Not Deleted");
        })
    }
})

export default organizationSlice.reducer
export const getAllOrganizations = (state) => state.organization.categories
export const isLoading = (state) => state.organization.loading