import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/users/userSlice';
import categoryReducer from '../features/incidentsCategory/incidentsCategorySlice';
import typeReducer from '../features/incidentType/incidentTypeSlice';
import violationReducer from '../features/violations/violationSlice'
import acategoryReducer from '../features/auditCategory/auditCategorySlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        category: categoryReducer,
        type: typeReducer,
        violation: violationReducer,
        acategory: acategoryReducer,
    }
})
