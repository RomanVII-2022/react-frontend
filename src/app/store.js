import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/users/userSlice';
import categoryReducer from '../features/incidentsCategory/incidentsCategorySlice';
import typeReducer from '../features/incidentType/incidentTypeSlice';
import violationReducer from '../features/violations/violationSlice'
import acategoryReducer from '../features/auditCategory/auditCategorySlice'
import measureReducer from '../features/auditMeasure/auditMeasureSlice';
import organizationReducer from '../features/organizations/organizationSlice';
import atypeReducer from '../features/auditType/auditTypeSlice';
import statusReducer from '../features/auditStatus/auditStatusSlice';
import auditReducer from '../features/audits/auditSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        category: categoryReducer,
        type: typeReducer,
        violation: violationReducer,
        acategory: acategoryReducer,
        measure: measureReducer,
        organization: organizationReducer,
        atype: atypeReducer,
        status: statusReducer,
        audit: auditReducer,
    }
})
