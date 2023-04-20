import { createContext, useState } from "react";
import axios from "axios";
import jwtDecode from 'jwt-decode';
import alertify from "alertifyjs";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext()

export default AuthContext


export const AuthProvider = ({children}) => {

    const navigate = useNavigate()

    const [authToken, setAuthToken] = useState(localStorage.getItem('AuthToken')?JSON.parse(localStorage.getItem('AuthToken')):null)

    const [user, setUser] = useState(localStorage.getItem('AuthToken')?jwtDecode(authToken.access):null)

    const AuthLogin = (user) => {
        return axios.post('http://localhost:8000/api/token/', user)
        .then(res => {
            localStorage.setItem('AuthToken', JSON.stringify(res.data))
            setAuthToken(res.data)
            setUser(jwtDecode(res.data.access))
            navigate('/home')
        }).catch(() => {
            alertify.set('notifier','position', 'top-right');
            alertify.error("Error! Unauthorized");
        })
    }

    const AuthLogout = () => {
        setAuthToken(null)
        setUser(null)
        localStorage.removeItem('AuthToken')
        navigate('/')
    }

    const contextData = {
        user: user,
        authToken: authToken,
        AuthLogin: AuthLogin,
        AuthLogout: AuthLogout,
    }

    return (
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    );
}