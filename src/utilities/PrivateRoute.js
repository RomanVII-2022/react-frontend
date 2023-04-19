import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {

    const user = true

    if (!user) {
        return <Navigate to='/' />
    }else {
        return children
    }

}

export default PrivateRoute