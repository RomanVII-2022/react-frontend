import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import alertify from 'alertifyjs';


export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
    const response = await axios.get('http://localhost:8000/incident-category/')
    return response.data
})

export const addCategory = createAsyncThunk('category/addCategory', async (category) => {
    const response = await axios.post('http://localhost:8000/incident-category/', category)
    return response.data
})


export const editCategory = createAsyncThunk('category/editCategory', async (category) => {
    const id = parseInt(category.get('id'))
    const response = await axios.put(`http://localhost:8000/incident-category/${id}/`, category)
    return response.data
})

export const deleteCategory = createAsyncThunk('category/deleteCategory', async (id) => {
    const response = await axios.delete(`http://localhost:8000/incident-category/${id}/`)
    return response.data
})

const initialState = {
    loading: false,
    categories: [],
}


const incidentsCategorySlice = createSlice({
    name: 'category',
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

export default incidentsCategorySlice.reducer
export const getAllCategories = (state) => state.category.categories
export const isLoading = (state) => state.category.loading