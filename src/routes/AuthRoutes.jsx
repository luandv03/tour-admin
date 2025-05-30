import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import { PublicRoute } from "./ProtectedRoutes";

function AuthRoutes() {
    return (
        <Routes>
            <Route
                path="/signin"
                element={
                    <PublicRoute restricted>
                        <SignIn />
                    </PublicRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <PublicRoute restricted>
                        <SignUp />
                    </PublicRoute>
                }
            />
            <Route
                path="/unauthorized"
                element={<div>Bạn không có quyền truy cập tài nguyên này</div>}
            />
        </Routes>
    );
}

export default AuthRoutes;
