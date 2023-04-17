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

export const editIncident = createAsyncThunk('incident/editIncident', async (incident) => {
    const id = incident.get('id')
    const response = await axios.put(`http://localhost:8000/IncidentViewSet/${id}/`, incident)
    return response.data
})


export const deleteIncident = createAsyncThunk('incident/deleteIncident', async (id) => {
    const response = await axios.delete(`http://localhost:8000/IncidentViewSet/${id}/`)
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
        builders.addCase(editIncident.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(editIncident.fulfilled, (state, action) => {
            state.loading = false
            const {id, vehicle, driver, incident, description, incidentAction, location, violation, incidentDate} = action.payload
            const doesExist = state.incidents.find(incident => incident.id === id)
            if (doesExist) {
                doesExist.vehicle = vehicle
                doesExist.driver = driver
                doesExist.incident = incident
                doesExist.description = description
                doesExist.incidentAction = incidentAction
                doesExist.location = location
                doesExist.violation = violation
                doesExist.incidentDate = incidentDate
                alertify.set('notifier','position', 'top-right');
                alertify.success("Incident Edited Successfully");
            }
        })
        builders.addCase(editIncident.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Incident Not Edited");
        })
        builders.addCase(deleteIncident.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteIncident.fulfilled, (state, action) => {
            state.loading = false
            const id = action.meta.arg
            state.incidents = state.incidents.filter(incident => incident.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Incident Deleted Successfully");
        })
        builders.addCase(deleteIncident.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Incident Not Deleted");
        })
    }
})

export default incidentSlice.reducer
export const getAllIncidents = (state) => state.incident.incidents
export const isLoading = (state) => state.incident.loading