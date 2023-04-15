import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import alertify from 'alertifyjs';


export const fetchViolations = createAsyncThunk('violation/fetchViolations', async () => {
    const response = await axios.get('http://localhost:8000/ViolationViewSet/')
    return response.data
})

export const addViolation = createAsyncThunk('violation/addViolation', async (violation) => {
    const response = await axios.post('http://localhost:8000/ViolationViewSet/', violation)
    return response.data
})


export const editViolation = createAsyncThunk('violation/editViolation', async (violation) => {
    const id = parseInt(violation.get('id'))
    const response = await axios.put(`http://localhost:8000/ViolationViewSet/${id}/`, violation)
    return response.data
})

export const deleteViolation = createAsyncThunk('violation/deleteViolation', async (id) => {
    const response = await axios.delete(`http://localhost:8000/ViolationViewSet/${id}/`)
    return response.data
})

const initialState = {
    loading: false,
    violations: [],
}


const violationSlice = createSlice({
    name: 'violation',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchViolations.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchViolations.fulfilled, (state, action) => {
            state.loading = false
            state.violations = action.payload
        })
        builders.addCase(fetchViolations.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error(action.error.message);
        })
        builders.addCase(addViolation.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(addViolation.fulfilled, (state, action) => {
            state.loading = false
            state.violations.push(action.payload)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Violation Added Successfully");
        })
        builders.addCase(addViolation.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Violation Not Added");
        })
        builders.addCase(editViolation.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(editViolation.fulfilled, (state, action) => {
            state.loading = false
            const {id, name, description, proposed} = action.payload
            const doesExist = state.violations.find(violation => violation.id === id)
            if (doesExist) {
                doesExist.name = name
                doesExist.description = description
                doesExist.proposed = proposed
            }
            alertify.set('notifier','position', 'top-right');
            alertify.success("Violation Edited Successfully");
        })
        builders.addCase(editViolation.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Violation Not Edited");
        })
        builders.addCase(deleteViolation.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteViolation.fulfilled, (state, action) => {
            state.loading = false
            const id = parseInt(action.meta.arg)
            state.violations = state.violations.filter(violation => violation.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Violation Deleted Successfully");
        })
        builders.addCase(deleteViolation.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Violation Not Deleted");
        })
    }
})

export default violationSlice.reducer
export const getAllViolations = (state) => state.violation.violations
export const isLoading = (state) => state.violation.loading