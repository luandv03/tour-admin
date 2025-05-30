import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardPage from "./pages/Dashboard.page";
import TouristPlaceManagementPage from "./pages/TouristPlaceManagement.page";
import CreateNewTouristPlacePage from "./pages/CreateNewTouristPlace.page";
import CreateNewTour from "./pages/CreateNewTour";
import TourManagement from "./pages/TourManagement.page";
import TourBookingManagement from "./pages/TourBookingManagement.page";
import TouristPlaceDetail from "./pages/TouristPlaceDetail.page";
import TourDetail from "./pages/TourDetail.page";
import TourBookingDetail from "./pages/TourBookingDetail.page";
import TourBookingRequestDetail from "./pages/TourBookingRequestDetail.page";
import CustomerManagement from "./pages/CustomerManagement.page";
import CustomerDetail from "./pages/CustomerDetail.page";
import AuthRoutes from "./routes/AuthRoutes";
import { PrivateRoute, PublicRoute } from "./routes/ProtectedRoutes";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route
                        path="/auth/*"
                        element={
                            <PublicRoute>
                                <AuthLayout>
                                    <AuthRoutes />
                                </AuthLayout>
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <MainLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<DashboardPage />} />
                        <Route path="manage-places">
                            <Route
                                index
                                element={<TouristPlaceManagementPage />}
                            />
                            <Route
                                path=":placeId"
                                element={<TouristPlaceDetail />}
                            />
                            <Route
                                path="create"
                                element={<CreateNewTouristPlacePage />}
                            />
                        </Route>
                        <Route path="tours">
                            <Route index element={<TourManagement />} />
                            <Route path=":tourId" element={<TourDetail />} />
                            <Route path="create" element={<CreateNewTour />} />
                        </Route>
                        <Route path="tours-booking">
                            <Route index element={<TourBookingManagement />} />
                            <Route
                                path=":tourBookingId"
                                element={<TourBookingDetail />}
                            />
                        </Route>
                        <Route path="customers">
                            <Route index element={<CustomerManagement />} />
                            <Route
                                path=":customerId"
                                element={<CustomerDetail />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
