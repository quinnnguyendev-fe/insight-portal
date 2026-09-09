import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";

export function ProtectedRoute() {
    const { token, isLoading } = useAuth();

    if(isLoading) {
        return <div>Loading...</div>
    }

    if(!token) {
        return <Navigate to="/login" replace/>
    }

    return <Outlet/>
}