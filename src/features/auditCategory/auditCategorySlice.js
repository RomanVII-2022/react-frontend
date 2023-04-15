import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import alertify from 'alertifyjs';


export const fetchCategories = createAsyncThunk('acategory/fetchCategories', async () => {
    const response = await axios.get('http://localhost:8000/AuditCategoryViewSet/')
    return response.data
})

export const addCategory = createAsyncThunk('acategory/addCategory', async (category) => {
    const response = await axios.post('http://localhost:8000/AuditCategoryViewSet/', category)
    return response.data
})


export const editCategory = createAsyncThunk('acategory/editCategory', async (category) => {
    const id = parseInt(category.get('id'))
    const response = await axios.put(`http://localhost:8000/AuditCategoryViewSet/${id}/`, category)
    return response.data
})

export const deleteCategory = createAsyncThunk('acategory/deleteCategory', async (id) => {
    const response = await axios.delete(`http://localhost:8000/AuditCategoryViewSet/${id}/`)
    return response.data
})

const initialState = {
    loading: false,
    categories: [],
}


const auditCategorySlice = createSlice({
    name: 'acategory',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchCategories.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchCategories.fulfilled, (state, action) => {
            state.loading = false
            state.categories = action.payload
        })
        builders.addCase(fetchCategories.rejected, (state, action) => {
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
            alertify.success("Category Added Successfully");
        })
        builders.addCase(addCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Category Not Added");
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
            alertify.success("Category Edited Successfully");
        })
        builders.addCase(editCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Category Not Edited");
        })
        builders.addCase(deleteCategory.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteCategory.fulfilled, (state, action) => {
            state.loading = false
            const id = parseInt(action.meta.arg)
            state.categories = state.categories.filter(category => category.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Category Deleted Successfully");
        })
        builders.addCase(deleteCategory.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Category Not Deleted");
        })
    }
})

export default auditCategorySlice.reducer
export const getAllCategories = (state) => state.acategory.categories
export const isLoading = (state) => state.acategory.loading