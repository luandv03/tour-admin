import React, { useEffect, useState } from "react";
import moment from "moment";
import {
    Descriptions,
    Typography,
    Divider,
    Switch,
    Form,
    Input,
    Spin,
    message,
    Button,
    notification,
    Modal,
    Space,
} from "antd";
import { Link, useParams } from "react-router-dom";
import {
    fetchTourBookingDetail,
    confirmBooking,
    confirmCustomBooking,
} from "../services/api";
import { STATUS_BOOKING_ENUM } from "../utils/statusBooking";

const { Title } = Typography;

const TourBookingDetail = () => {
    const { tourBookingId } = useParams();
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusBokingLoading, setStatusBookingLoading] = useState(false);
    const [isEditingPrices, setIsEditingPrices] = useState(false);
    const [editedPrices, setEditedPrices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchTourBookingDetail(tourBookingId);
                // Chuẩn hóa dữ liệu cho UI
                setBookingData({
                    tour: {
                        id: res.tour.id,
                        name: res.tour.name,
                        prices: res.tour.tourPassengers.map((p) => ({
                            type: p.passengerTypeName,
                            price: p.price,
                            tourPassengerId: p.id,
                        })),
                        itinerary: res.tour.tourPlaces.map((place) => ({
                            id: place.id,
                            value: place.touristPlace.placeName,
                            day: place.day,
                        })),
                        departurePoint: res.tour.departurePoint,
                        type: res.tour.isCustom ? "Cá nhân" : "Doanh nghiệp",
                        isCustom: res.tour.isCustom,
                    },
                    customer: {
                        userId: res.user?.userId,
                        name: res.user?.name,
                        email: res.user?.email,
                        phone: res.user?.phoneNumber,
                    },
                    booking: {
                        id: res.tourBookingId,
                        bookingDate: res.payments?.[0]?.paymentDate || "",
                        status: res.status,
                        departureDate: res.departureDate,
                        people: res.bookingPassengers.map((bp) => ({
                            type: bp.passengerType?.passengerTypeName,
                            count: bp.numberOfPerson,
                        })),
                        numOfPeople: res.bookingPassengers.reduce(
                            (sum, bp) => sum + (bp.numberOfPerson || 0),
                            0
                        ),
                        totalPrice: res.totalAmount,
                        vat: res.tour.tax,
                        discount: res.tour.discount,
                        totalPriceAfterDiscount:
                            res.totalAmount -
                            (res.totalAmount * (res.tour.discount || 0)) / 100,
                        prevPercent: res.tour.prevPercent,
                        prevPayment:
                            res.payments && res.payments.length > 0
                                ? res.payments.reduce(
                                      (sum, p) => sum + (p.amount || 0),
                                      0
                                  )
                                : 0,
                        payments: res.payments || [],
                    },
                });

                // Initialize edited prices
                setEditedPrices(
                    res.tour.tourPassengers.map((p) => ({
                        tourPassengerId: p.id,
                        price: p.price,
                    }))
                );
            } catch (err) {
                message.error("Không thể tải chi tiết booking!");
            }
            setLoading(false);
        };
        fetchData();
    }, [tourBookingId]);

    const handlePriceChange = (id, value) => {
        setEditedPrices((prev) =>
            prev.map((p) =>
                p.tourPassengerId === id ? { ...p, price: Number(value) } : p
            )
        );
    };

    const handleStatusChange = async () => {
        if (!bookingData) return;

        setStatusBookingLoading(true);

        try {
            // Nếu là tour tùy chỉnh và đang ở trạng thái chờ xác nhận yêu cầu
            if (
                bookingData.tour.isCustom &&
                bookingData.booking.status === "CHO_XAC_NHAN_YEU_CAU"
            ) {
                // Confirm và cập nhật giá
                const res = await confirmCustomBooking(tourBookingId, {
                    passengerPrices: editedPrices,
                });

                message.success("Đã cập nhật giá và xác nhận tour thành công!");
                setIsEditingPrices(false);

                // Cập nhật lại state với dữ liệu mới
                setBookingData((prev) => ({
                    ...prev,
                    booking: {
                        ...prev.booking,
                        status: res.status,
                        totalPrice: res.totalAmount,
                        totalPriceAfterDiscount:
                            res.totalAmount -
                            (res.totalAmount * (prev.booking.discount || 0)) /
                                100,
                    },
                    tour: {
                        ...prev.tour,
                        prices: prev.tour.prices.map((p) => {
                            const updatedPrice = editedPrices.find(
                                (ep) => ep.tourPassengerId === p.tourPassengerId
                            );
                            return updatedPrice
                                ? { ...p, price: updatedPrice.price }
                                : p;
                        }),
                    },
                }));
            } else if (bookingData.booking.status === "CHO_XAC_NHAN_YEU_CAU") {
                // Xác nhận yêu cầu booking thông thường
                const res = await confirmBooking(tourBookingId);
                message.success("Xác nhận booking thành công!");

                setBookingData((prev) => ({
                    ...prev,
                    booking: {
                        ...prev.booking,
                        status: res?.status,
                    },
                }));
            }
        } catch (error) {
            console.error("Error updating booking:", error);
            message.error("Xác nhận booking không thành công!");
        } finally {
            setStatusBookingLoading(false);
        }
    };

    if (loading || !bookingData) {
        return (
            <div style={{ padding: 48, textAlign: "center" }}>
                <Spin size="large" />
            </div>
        );
    }

    const isCustomTourPendingConfirmation =
        bookingData.tour.isCustom &&
        bookingData.booking.status === "CHO_XAC_NHAN_YEU_CAU";

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>Chi tiết đặt tour</Title>

            <Divider />

            {/* Thông tin về tour */}
            <Title level={4}>Thông tin về tour</Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã tour">
                    <Link to={`/tours/${bookingData.tour.id}`}>
                        {bookingData.tour.id}
                    </Link>
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
                <Descriptions.Item label="Giá tour (VNĐ)">
                    {isEditingPrices ? (
                        <>
                            {bookingData.tour.prices.map((price) => (
                                <div
                                    key={price.tourPassengerId}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Input
                                        addonBefore={price.type}
                                        type="number"
                                        defaultValue={price.price}
                                        onChange={(e) =>
                                            handlePriceChange(
                                                price.tourPassengerId,
                                                e.target.value
                                            )
                                        }
                                        style={{ width: 300 }}
                                    />
                                </div>
                            ))}
                        </>
                    ) : (
                        bookingData.tour.prices.map((price, index) => (
                            <div key={index}>
                                {price.type}: {price.price.toLocaleString()} VNĐ
                            </div>
                        ))
                    )}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Thông tin khách hàng */}
            <Title level={4}>Thông tin khách hàng</Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã khách hàng">
                    {bookingData.customer.userId}
                </Descriptions.Item>
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
                <Descriptions.Item label="Yêu cầu đặt cọc (%)">
                    {bookingData.booking.prevPercent} %
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền đã đặt cọc (VNĐ)">
                    {bookingData.booking.prevPayment.toLocaleString()} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Các lần chuyển khoản">
                    {Array.isArray(bookingData.booking.payments) &&
                    bookingData.booking.payments.length > 0 ? (
                        bookingData.booking.payments.map((p, idx) => (
                            <div key={idx}>
                                {p.amount.toLocaleString()} VNĐ -{" "}
                                <i>
                                    {" "}
                                    {moment(p.paymentDate).format(
                                        "HH:mm:ss DD/MM/YYYY"
                                    )}
                                </i>
                            </div>
                        ))
                    ) : (
                        <span>Chưa có thanh toán</span>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <span>
                        {STATUS_BOOKING_ENUM[bookingData.booking.status]}
                    </span>

                    {bookingData.booking.status === "CHO_XAC_NHAN_YEU_CAU" && (
                        <>
                            {isCustomTourPendingConfirmation &&
                            !isEditingPrices ? (
                                <Button
                                    style={{
                                        marginLeft: "16px",
                                        minWidth: "120px",
                                    }}
                                    type="primary"
                                    onClick={() => setIsEditingPrices(true)}
                                >
                                    Cập nhật giá
                                </Button>
                            ) : isEditingPrices ? (
                                <Space style={{ marginLeft: "16px" }}>
                                    <Button
                                        onClick={() =>
                                            setIsEditingPrices(false)
                                        }
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={handleStatusChange}
                                        loading={statusBokingLoading}
                                    >
                                        Lưu và xác nhận
                                    </Button>
                                </Space>
                            ) : (
                                <Button
                                    style={{
                                        marginLeft: "16px",
                                        minWidth: "120px",
                                    }}
                                    type="primary"
                                    onClick={handleStatusChange}
                                    loading={statusBokingLoading}
                                >
                                    Xác nhận
                                </Button>
                            )}
                        </>
                    )}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default TourBookingDetail;
