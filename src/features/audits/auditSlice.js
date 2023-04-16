import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import alertify from 'alertifyjs';


export const fetchAudits = createAsyncThunk('audit/fetchAudits', async () => {
    const response = await axios.get('http://localhost:8000/AuditViewSet/')
    return response.data
})

export const addAudit = createAsyncThunk('audit/addAudit', async (audit) => {
    const response = await axios.post('http://localhost:8000/AuditViewSet/', audit)
    return response.data
})

export const editAudit = createAsyncThunk('audit/editAudit', async (audit) => {
    const id = audit.get('id')
    const response = await axios.put(`http://localhost:8000/AuditViewSet/${id}/`, audit)
    return response.data
})

export const deleteAudit = createAsyncThunk('audit/deleteAudit', async (id) => {
    const response = await axios.delete(`http://localhost:8000/AuditViewSet/${id}/`)
    return response.data
})

const initialState = {
    loading: false,
    audits: []
}


const auditSlice = createSlice({
    name: 'audit',
    initialState: initialState,
    extraReducers: (builders) => {
        builders.addCase(fetchAudits.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(fetchAudits.fulfilled, (state, action) => {
            state.loading = false
            state.audits = action.payload
        })
        builders.addCase(fetchAudits.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error(action.error.message);
        })
        builders.addCase(addAudit.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(addAudit.fulfilled, (state, action) => {
            state.loading = false
            state.audits.push(action.payload)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Audit Added Successfully");
        })
        builders.addCase(addAudit.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error('Error! Audit not added');
        })
        builders.addCase(editAudit.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(editAudit.fulfilled, (state, action) => {
            state.loading = false
            const {id, name, raisedBy, dateRaised, dateDue, assignedTo, notes, auditType, organization, auditMeasure, auditCategory, auditStatus} = action.payload
            const doesExist = state.audits.find(audit => audit.id === id)
            if (doesExist) {
                doesExist.name = name
                doesExist.raisedBy = raisedBy
                doesExist.dateRaised = dateRaised
                doesExist.dateDue = dateDue
                doesExist.assignedTo = assignedTo
                doesExist.notes = notes
                doesExist.auditType = auditType
                doesExist.organization = organization
                doesExist.auditMeasure = auditMeasure
                doesExist.auditCategory = auditCategory
                doesExist.auditStatus = auditStatus
                alertify.set('notifier','position', 'top-right');
                alertify.success("Audit Edited Successfully");
            }
        })
        builders.addCase(editAudit.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error('Error! Audit Not Edited');
        })
        builders.addCase(deleteAudit.pending, (state, action) => {
            state.loading = true
        })
        builders.addCase(deleteAudit.fulfilled, (state, action) => {
            state.loading = false
            const id = action.meta.arg
            state.audits = state.audits.filter(audit => audit.id !== id)
            alertify.set('notifier','position', 'top-right');
            alertify.success("Audit Deleted Successfully");
        })
        builders.addCase(deleteAudit.rejected, (state, action) => {
            state.loading = false
            alertify.set('notifier','position', 'top-right');
            alertify.error('Error! Audit Not Deleted');
        })
    }
})

export default auditSlice.reducer
export const getAllAudits = (state) => state.audit.audits
export const isLoading = (state) => state.audit.loading