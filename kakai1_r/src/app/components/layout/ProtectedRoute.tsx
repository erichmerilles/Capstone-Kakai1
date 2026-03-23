import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth, UserRole } from "../../context/AuthContext";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    // 1. Wait for the session check to finish before making routing decisions
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // 2. If no user is logged in, kick them back to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If this route requires specific roles, check if the user has permission
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If a cashier tries to access an admin page, send them back to their own dashboard
        const roleHomeMap: Record<UserRole, string> = {
            admin: "/admin/dashboard",
            stockman: "/stockman/dashboard",
            cashier: "/cashier/dashboard",
            customer: "/customer",
        };

        return <Navigate to={roleHomeMap[user.role] || "/login"} replace />;
    }

    // 4. If everything is secure, render the requested child components
    return <Outlet />;
}