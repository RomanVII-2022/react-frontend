import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import alertify from 'alertifyjs';


export const fetchIncidents = createAsyncThunk('incident/fetchIncidents', async () => {
    const response = await axios.get('http://localhost:8000/IncidentViewSet/')
    return response.data
})

export const addIncident = createAsyncThunk('incident/addIncident', async (incident) => {
    const response = await axios.post('http://localhost:8000/IncidentViewSet/', incident)
    return response.data
})


const initialState = {
    loading: false,
    incidents: []
}

const incidentSlice = createSlice({
    name: 'incident',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchIncidents.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchIncidents.fulfilled, (state, action) => {
            state.loading = false
            state.incidents = action.payload
        })
        builders.addCase(fetchIncidents.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error(action.error.message);
        })
        builders.addCase(addIncident.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(addIncident.fulfilled, (state, action) => {
            state.loading = false
            state.incidents.push(action.payload)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Incident Added Successfully");
        })
        builders.addCase(addIncident.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Incident Not Added");
        })
    }
})

export default incidentSlice.reducer
export const getAllIncidents = (state) => state.incident.incidents
export const isLoading = (state) => state.incident.loading