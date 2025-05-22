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
import TourBookingDetail from "./pages/TourBookingDetail.page";
import TourBookingRequestDetail from "./pages/TourBookingRequestDetail.page";
import CustomerManagement from "./pages/CustomerManagement.page";
import CustomerDetail from "./pages/CustomerDetail.page";

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
                        path="/manage-places/:placeId"
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

                    <Route
                        path="/tour-booking/:tourBookingId"
                        element={<TourBookingDetail />}
                    />

                    <Route path="/tours/create" element={<CreateNewTour />} />

                    <Route path="/customers" element={<CustomerManagement />} />
                    <Route
                        path="/customers/:customerId"
                        element={<CustomerDetail />}
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
