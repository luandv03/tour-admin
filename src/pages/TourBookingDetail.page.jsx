import React from "react";
import { Descriptions, Typography, Divider, Switch, Form, Input } from "antd";

const { Title } = Typography;

const TourBookingDetail = ({ booking }) => {
    const Booking_Data = booking || {
        tour: {
            id: "T001",
            name: "Tour Hà Nội - Hạ Long",
            prices: [
                { type: "Người lớn (Từ 12 tuổi trở lên)", price: 2000000 },
                { type: "Trẻ em (Từ 5 đến 11 tuổi)", price: 1000000 },
                { type: "Trẻ nhỏ (Từ 2 đến 4 tuổi)", price: 500000 },
                { type: "Em bé (Dưới 2 tuổi)", price: 0 },
            ],
            itinerary: [
                { id: 1, value: "Vịnh Hạ Long", day: 1 },
                { id: 2, value: "Chùa Một Cột", day: 2 },
            ],
            departurePoint: { id: 1, name: "Hà Nội" },
            type: "Doanh nghiệp",
        },
        customer: {
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0123456789",
        },
        booking: {
            id: "B001",
            bookingDate: "2025-04-01 12:00:00",
            status: "Chờ xác nhận",
            departureDate: "2025-05-01",
            people: [
                { type: "Người lớn", count: 2 },
                { type: "Trẻ em", count: 1 },
                { type: "Trẻ nhỏ", count: 1 },
                { type: "Em bé", count: 0 },
            ],
            numOfPeople: 4,
            totalPrice: 5000000,
            vat: 10,
            discount: 10,
            totalPriceAfterDiscount: 4500000,
            prevPercent: 60,
            prevPayment: 2700000,
            prevPaymentDate: "2025-04-01 12:00:00",
        },
    };

    const [bookingData, setBookingData] = React.useState(Booking_Data);

    const handleStatusChange = (checked) => {
        setBookingData((prevData) => ({
            ...prevData,
            booking: {
                ...prevData.booking,
                status: checked ? "Đã xác nhận" : "Chờ xác nhận",
            },
        }));
    };

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>Chi tiết đặt tour</Title>

            <Divider />

            {/* Thông tin về tour */}
            <Title level={4}>Thông tin về tour</Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã tour">
                    {bookingData.tour.id}
                </Descriptions.Item>
                <Descriptions.Item label="Tên tour">
                    {bookingData.tour.name}
                </Descriptions.Item>
                <Descriptions.Item label="Loại tour">
                    {bookingData.tour.type}
                </Descriptions.Item>
                <Descriptions.Item label="Điểm khởi hành">
                    {bookingData.tour.departurePoint.name}
                </Descriptions.Item>
                <Descriptions.Item label="Lộ trình">
                    {bookingData.tour.itinerary.map((location) => (
                        <div key={location.id}>
                            Ngày {location.day}: {location.value}
                        </div>
                    ))}
                </Descriptions.Item>

                {/* handle type tour: Doanh nghiệp, cá nhân */}
                <Descriptions.Item label="Giá tour (VNĐ)">
                    {bookingData.tour.prices.map((price, index) => (
                        <div key={index}>
                            {price.type}: {price.price.toLocaleString()} VNĐ
                        </div>
                    ))}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Thông tin khách hàng */}
            <Title level={4}>Thông tin khách hàng</Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Tên khách hàng">
                    {bookingData.customer.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {bookingData.customer.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {bookingData.customer.phone}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Thông tin về tour booking */}
            <Title level={4}>Thông tin về tour booking</Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã booking">
                    {bookingData.booking.id}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt tour">
                    {bookingData.booking.bookingDate}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày khởi hành">
                    {bookingData.booking.departureDate}
                </Descriptions.Item>
                <Descriptions.Item label="Số lượng người">
                    {bookingData.booking.people.map((person, index) => (
                        <div key={index}>
                            {person.type}: {person.count}
                        </div>
                    ))}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng số người">
                    {bookingData.booking.numOfPeople}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng thanh toán (VNĐ)">
                    {bookingData.booking.totalPrice.toLocaleString()} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Thuế VAT (%)">
                    {bookingData.booking.vat} %
                </Descriptions.Item>
                <Descriptions.Item label="Giảm giá (%)">
                    {bookingData.booking.discount} %
                </Descriptions.Item>
                <Descriptions.Item label="Tổng thanh toán sau giảm giá (VNĐ)">
                    {bookingData.booking.totalPriceAfterDiscount.toLocaleString()}{" "}
                    VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Đặt cọc (%)">
                    {bookingData.booking.prevPercent} %
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền đã đặt cọc (VNĐ)">
                    {bookingData.booking.prevPayment.toLocaleString()} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt cọc">
                    {bookingData.booking.prevPaymentDate}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    {/* Trạng thái có thể là "Chờ xác nhận" hoặc "Đã xác nhận" */}
                    <span>{bookingData.booking.status}</span>

                    <Switch
                        checked={
                            bookingData.booking.status === "Đã xác nhận"
                                ? true
                                : false
                        }
                        onChange={handleStatusChange}
                        style={{ marginLeft: "16px" }}
                    >
                        Xác nhận
                    </Switch>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default TourBookingDetail;
