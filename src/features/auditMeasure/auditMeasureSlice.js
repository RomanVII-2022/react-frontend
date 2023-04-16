import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import alertify from 'alertifyjs';


export const fetchMeasures = createAsyncThunk('measure/fetchMeasures', async () => {
    const response = await axios.get('http://localhost:8000/AuditMeasureViewSet/')
    return response.data
})

export const addMeasures = createAsyncThunk('measure/addMeasures', async (category) => {
    const response = await axios.post('http://localhost:8000/AuditMeasureViewSet/', category)
    return response.data
})


export const editMeasures = createAsyncThunk('measure/editMeasures', async (category) => {
    const id = parseInt(category.get('id'))
    const response = await axios.put(`http://localhost:8000/AuditMeasureViewSet/${id}/`, category)
    return response.data
})

export const deleteMeasures = createAsyncThunk('measure/deleteMeasures', async (id) => {
    const response = await axios.delete(`http://localhost:8000/AuditMeasureViewSet/${id}/`)
    return response.data
})

const initialState = {
    loading: false,
    measures: [],
}


const auditMeasureSlice = createSlice({
    name: 'measure',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchMeasures.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchMeasures.fulfilled, (state, action) => {
            state.loading = false
            state.measures = action.payload
        })
        builders.addCase(fetchMeasures.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error(action.error.message);
        })
        builders.addCase(addMeasures.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(addMeasures.fulfilled, (state, action) => {
            state.loading = false
            state.measures.push(action.payload)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Measure Added Successfully");
        })
        builders.addCase(addMeasures.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Measure Not Added");
        })
        builders.addCase(editMeasures.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(editMeasures.fulfilled, (state, action) => {
            state.loading = false
            const {id, name, description} = action.payload
            const doesExist = state.measures.find(measure => measure.id === id)
            if (doesExist) {
                doesExist.name = name
                doesExist.description = description
            }
            alertify.set('notifier','position', 'top-right');
            alertify.success("Measure Edited Successfully");
        })
        builders.addCase(editMeasures.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Measure Not Edited");
        })
        builders.addCase(deleteMeasures.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteMeasures.fulfilled, (state, action) => {
            state.loading = false
            const id = parseInt(action.meta.arg)
            state.measures = state.measures.filter(measure => measure.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Measure Deleted Successfully");
        })
        builders.addCase(deleteMeasures.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Measure Not Deleted");
        })
    }
})

export default auditMeasureSlice.reducer
export const getAllMeasure = (state) => state.measure.measures
export const isLoading = (state) => state.measure.loading