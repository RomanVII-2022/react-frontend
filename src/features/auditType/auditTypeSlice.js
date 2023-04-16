import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import alertify from 'alertifyjs';


export const fetchTypes = createAsyncThunk('atype/fetchTypes', async () => {
    const response = await axios.get('http://localhost:8000/AuditTypeViewSet/')
    return response.data
})

export const addCategory = createAsyncThunk('atype/addCategory', async (category) => {
    const response = await axios.post('http://localhost:8000/AuditTypeViewSet/', category)
    return response.data
})


export const editCategory = createAsyncThunk('atype/editCategory', async (category) => {
    const id = parseInt(category.get('id'))
    const response = await axios.put(`http://localhost:8000/AuditTypeViewSet/${id}/`, category)
    return response.data
})

export const deleteCategory = createAsyncThunk('atype/deleteCategory', async (id) => {
    const response = await axios.delete(`http://localhost:8000/AuditTypeViewSet/${id}/`)
    return response.data
})

const initialState = {
    loading: false,
    categories: [],
}


const auditTypeSlice = createSlice({
    name: 'atype',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchTypes.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchTypes.fulfilled, (state, action) => {
            state.loading = false
            state.categories = action.payload
        })
        builders.addCase(fetchTypes.rejected, (state, action) => {
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
            alertify.success("Type Added Successfully");
        })
        builders.addCase(addCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Type Not Added");
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
            alertify.success("Type Edited Successfully");
        })
        builders.addCase(editCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Type Not Edited");
        })
        builders.addCase(deleteCategory.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteCategory.fulfilled, (state, action) => {
            state.loading = false
            const id = parseInt(action.meta.arg)
            state.categories = state.categories.filter(category => category.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Type Deleted Successfully");
        })
        builders.addCase(deleteCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Type Not Deleted");
        })
    }
})

export default auditTypeSlice.reducer
export const getAllTypes = (state) => state.atype.categories
export const isLoading = (state) => state.atype.loading