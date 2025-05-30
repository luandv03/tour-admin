import axios from "axios";

const BASE_URL = "https://tour-server-d14k.onrender.com/api";

export const fetchTours = async () => {
    try {
        const response = await axios.get(BASE_URL + "/tours");
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Error fetching tours:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const fetchTourById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/tours/${id}`);
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error(`Error fetching tour with id ${id}:`, error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const fetchTouristPlaces = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/tourist-places`);
        return response.data; // Trả về danh sách địa điểm từ API
    } catch (error) {
        console.error("Error fetching tourist places:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Phục vụ việc tạo tour cá nhân
export const fetchPassengerTypes = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/passenger-types`);
        return response.data; // Trả về danh sách phân khúc khách hàng từ API
    } catch (error) {
        console.error("Error fetching passenger types:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const createTouristPlace = async (placeData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/tourist-places`,
            placeData
        );
        return response.data; // Trả về dữ liệu địa điểm du lịch vừa tạo từ API
    } catch (error) {
        console.error("Error creating tourist place:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const createTour = async (tourData) => {
    try {
        const response = await axios.post(`${BASE_URL}/tours`, tourData);
        return response.data; // Trả về dữ liệu tour vừa tạo từ API
    } catch (error) {
        console.error("Error creating tour:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const fetchPlaceTypes = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/place-types`);
        return response.data; // Trả về danh sách loại địa điểm từ API
    } catch (error) {
        console.error("Error fetching place types:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const fetchCities = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/cities`);
        return response.data; // Trả về danh sách thành phố từ API
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const fetchUserCustomTours = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/tours/custom/${userId}`);
        return response.data; // Trả về danh sách tour custom của user từ API
    } catch (error) {
        console.error("Error fetching user's custom tours:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const bookTour = async (bookingData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/tour-bookings`,
            bookingData
        );
        return response.data; // Trả về dữ liệu booking từ API
    } catch (error) {
        console.error("Error booking tour:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const fetchTourBookingsByUser = async (userId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/tour-bookings/user/${userId}`
        );
        return response.data; // Trả về danh sách tour booking của user từ API
    } catch (error) {
        console.error("Error fetching tour bookings by user:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const fetchTourBookingDetail = async (bookingId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/tour-bookings/${bookingId}`
        );
        return response.data; // Trả về chi tiết tour booking từ API
    } catch (error) {
        console.error("Error fetching tour booking detail:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const fetchTouristPlaceById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/tourist-places/${id}`);
        return response.data; // Trả về chi tiết địa điểm du lịch từ API
    } catch (error) {
        console.error(`Error fetching tourist place with id ${id}:`, error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const fetchAllTourBookings = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/tour-bookings`);
        return response.data; // Trả về danh sách tất cả tour booking từ API
    } catch (error) {
        console.error("Error fetching all tour bookings:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const confirmBooking = async (bookingId) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/tour-bookings/confirm/${bookingId}`
        );
        return response.data; // Trả về dữ liệu booking đã xác nhận từ API
    } catch (error) {
        console.error("Error confirming booking:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const confirmCustomerBooking = async (bookingId) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/tour-bookings/confirm-customer/${bookingId}`
        );
        return response.data; // Trả về dữ liệu booking đã xác nhận từ API
    } catch (error) {
        console.error("Error confirming customer booking:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const confirmCustomBooking = async (bookingId, priceData) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/tour-bookings/confirm-custom/${bookingId}`,
            priceData
        );
        return response.data; // Trả về dữ liệu booking sau khi cập nhật giá
    } catch (error) {
        console.error("Error updating custom booking prices:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
