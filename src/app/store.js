import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/users/userSlice';
import categoryReducer from '../features/incidentsCategory/incidentsCategorySlice'


export const store = configureStore({
    reducer: {
        user: userReducer,
        category: categoryReducer,
    }
})
