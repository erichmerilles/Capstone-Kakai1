import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth, UserRole } from "../../context/AuthContext";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    requiredPermission?: string | string[]; // 🔥 Upgraded to support multiple permissions
    children?: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, requiredPermission, children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const roleHomeMap: Record<UserRole, string> = {
        admin: "/admin/dashboard",
        stockman: "/stockman/dashboard",
        cashier: "/cashier/dashboard",
        customer: "/customer",
    };

    // 1. Basic section role check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={roleHomeMap[user.role] || "/login"} replace />;
    }

    // 2. Strict granular DB permission check
    if (requiredPermission && user.role !== "admin") {
        // Convert single string to an array so we can check multiple conditions easily
        const permissionsToCheck = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

        // Check if the user has AT LEAST ONE of the required permissions for this page
        const hasAccess = permissionsToCheck.some(perm => user.permissions?.includes(perm));

        if (!hasAccess) {
            // Access Denied!
            return <Navigate to={roleHomeMap[user.role]} replace />;
        }
    }

    return children ? <>{children}</> : <Outlet />;
}