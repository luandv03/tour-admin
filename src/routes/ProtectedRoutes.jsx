import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useKeycloak } from "../context/KeycloakContext";

// Component bảo vệ route yêu cầu xác thực
export const PrivateRoute = ({ children, roles = [] }) => {
    const { isAuthenticated, isLoading, hasRole } = useKeycloak();
    const location = useLocation();

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }
    if (!isAuthenticated) {
        // Lưu vị trí hiện tại để sau khi đăng nhập sẽ chuyển hướng lại
        return (
            <Navigate to="/auth/signin" state={{ from: location }} replace />
        );
    }

    // Kiểm tra quyền nếu có yêu cầu
    if (roles.length > 0 && !hasRole(roles)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

// Component bảo vệ route chỉ cho người chưa xác thực
export const PublicRoute = ({ children, restricted = false }) => {
    const { isAuthenticated, isLoading } = useKeycloak();

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (isAuthenticated && restricted) {
        return <Navigate to="/" />;
    }

    return children;
};
