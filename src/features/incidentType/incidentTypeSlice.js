import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import alertify from 'alertifyjs';


export const fetchTypes = createAsyncThunk('type/fetchTypes', async () => {
    const response = await axios.get('http://localhost:8000/IncidentTypeViewSet/')
    return response.data
})

export const addType = createAsyncThunk('type/addType', async (type) => {
    const response = await axios.post('http://localhost:8000/IncidentTypeViewSet/', type)
    return response.data
})


export const editType = createAsyncThunk('type/editType', async (type) => {
    const id = parseInt(type.get('id'))
    const response = await axios.put(`http://localhost:8000/IncidentTypeViewSet/${id}/`, type)
    return response.data
})

export const deleteType = createAsyncThunk('type/deleteType', async (id) => {
    const response = await axios.delete(`http://localhost:8000/IncidentTypeViewSet/${id}/`)
    return response.data
})

const initialState = {
    loading: false,
    types: [],
}


const incidentTypeSlice = createSlice({
    name: 'type',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchTypes.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchTypes.fulfilled, (state, action) => {
            state.loading = false
            state.types = action.payload
        })
        builders.addCase(fetchTypes.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error(action.error.message);
        })
        builders.addCase(addType.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(addType.fulfilled, (state, action) => {
            state.loading = false
            state.types.push(action.payload)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Type Added Successfully");
        })
        builders.addCase(addType.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Type Not Added");
        })
        builders.addCase(editType.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(editType.fulfilled, (state, action) => {
            state.loading = false
            const {id, category, name, description} = action.payload
            const doesExist = state.types.find(type => type.id === id)
            if (doesExist) {
                doesExist.category = category
                doesExist.name = name
                doesExist.description = description
            }
            alertify.set('notifier','position', 'top-right');
            alertify.success("Type Edited Successfully");
        })
        builders.addCase(editType.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Type Not Edited");
        })
        builders.addCase(deleteType.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteType.fulfilled, (state, action) => {
            state.loading = false
            const id = parseInt(action.meta.arg)
            state.types = state.types.filter(type => type.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Type Deleted Successfully");
        })
        builders.addCase(deleteType.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Type Not Deleted");
        })
    }
})

export default incidentTypeSlice.reducer
export const getAllTypes = (state) => state.type.types
export const isLoading = (state) => state.type.loading