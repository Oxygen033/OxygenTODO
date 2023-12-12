import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext} from "./contexts/AuthContext";
import React, { useContext } from "react";

function AuthLayout()
{
    const location = useLocation();
    const {token, checkAuth} = useContext(AuthContext);
    return checkAuth() ? <Outlet/> : <Navigate to='/login'/>;
}

export default AuthLayout;