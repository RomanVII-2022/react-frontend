import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/users/userSlice';
import categoryReducer from '../features/incidentsCategory/incidentsCategorySlice';
import typeReducer from '../features/incidentType/incidentTypeSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        category: categoryReducer,
        type: typeReducer,
    }
})
