import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/Dashboard.page";
import TouristPlaceManagementPage from "./pages/TouristPlaceManagement.page";
import CreateNewTouristPlacePage from "./pages/CreateNewTouristPlace.page";
import CreateNewTour from "./pages/CreateNewTour";
import TourManagement from "./pages/TourManagement.page";
import TourBookingManagement from "./pages/TourBookingManagement.page";
import TouristPlaceDetail from "./pages/TouristPlaceDetail.page";
import TourDetail from "./pages/TourDetail.page";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path="/" element={<DashboardPage />} />

                    <Route
                        path="/manage-places"
                        element={<TouristPlaceManagementPage />}
                    />

                    <Route
                        path="/manage-places/:touristPlaceId"
                        element={<TouristPlaceDetail />}
                    />

                    <Route
                        path="/manage-places/create"
                        element={<CreateNewTouristPlacePage />}
                    />

                    <Route path="/tours" element={<TourManagement />} />
                    <Route path="/tours/:tourId" element={<TourDetail />} />

                    <Route
                        path="/tours-booking"
                        element={<TourBookingManagement />}
                    />

                    <Route path="/tours/create" element={<CreateNewTour />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
