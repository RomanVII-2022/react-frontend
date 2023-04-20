import React, {useContext} from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import dayjs from 'dayjs';

const PrivateRoute = ({children}) => {

    const {user} = useContext(AuthContext)


    if (user) {
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
        if (isExpired) {
            return <Navigate to='/' />
        }else {
            return children
        }

    }else {
        return <Navigate to='/' />
    }

}

export default PrivateRoute