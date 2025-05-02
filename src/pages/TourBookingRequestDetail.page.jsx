import { useState } from "react";
import {
    Descriptions,
    Typography,
    Divider,
    Switch,
    Form,
    Input,
    Button,
    Space,
    Flex,
    Badge,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Title } = Typography;

const mockData = {
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

const TourBookingRequestDetail = ({ booking }) => {
    const Booking_Data = booking || {
        tour: {
            id: "T001",
            name: "Tour Hà Nội - Hạ Long",
            prices: [
                {
                    typeId: "1",
                    type: "Người lớn (Từ 12 tuổi trở lên)",
                    price: "-",
                },
                { typeId: "2", type: "Trẻ em (Từ 5 đến 11 tuổi)", price: "-" },
                { typeId: "3", type: "Trẻ nhỏ (Từ 2 đến 4 tuổi)", price: "-" },
                { typeId: "4", type: "Em bé (Dưới 2 tuổi)", price: "-" },
            ],
            itinerary: [
                { id: 1, value: "Vịnh Hạ Long", day: 1 },
                { id: 2, value: "Chùa Một Cột", day: 2 },
            ],
            departurePoint: { id: 1, name: "Hà Nội" },
            type: "Cá nhân",
        },
        customer: {
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0123456789",
        },
        booking: {
            id: "B001",
            bookingDate: "2025-04-01 12:00:00",
            status: "Chờ xử lý",
            departureDate: "2025-05-01",
            people: [
                { typeId: "1", type: "Người lớn", count: 2 },
                { typeId: "2", type: "Trẻ em", count: 1 },
                { typeId: "3", type: "Trẻ nhỏ", count: 1 },
                { typeId: "4", type: "Em bé", count: 0 },
            ],
            numOfPeople: 4,
            surcharge: "-",
            totalPrice: "-",
            vat: "-",
            discount: "-",
            totalPriceAfterDiscount: "-",
            prevPercent: "-",
            prevPayment: "-",
            prevPaymentDate: "-",
        },
    };

    const [bookingData, setBookingData] = useState(Booking_Data);
    const [newBookingData, setNewBookingData] = useState(bookingData);

    // const handleStatusChange = (checked) => {
    //     setBookingData((prevData) => ({
    //         ...prevData,
    //         booking: {
    //             ...prevData.booking,
    //             status: checked ? "Đã xác nhận" : "Chờ xác nhận",
    //         },
    //     }));
    // };

    const [isEditing, setIsEditing] = useState(false);
    const [editedPrices, setEditedPrices] = useState([]);

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedPrices([...bookingData.tour.prices]); // Copy giá hiện tại để chỉnh sửa
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewBookingData(bookingData); // Đặt lại dữ liệu về trạng thái ban đầu
        setEditedPrices([]); // Hủy chỉnh sửa
    };

    const handleSave = () => {
        // Cập nhật trạng thái booking
        setBookingData({
            ...newBookingData,
            booking: {
                ...newBookingData.booking,
                status: "Đã xử lý",
            },
        });
        setIsEditing(false);
    };

    const calSumFeeByTypeId = (typeId) => {
        const price = newBookingData.tour.prices.find(
            (p) => p.typeId === typeId
        );

        if (price !== "-") {
            return (
                price.price *
                newBookingData.booking.people.find((p) => p.typeId === typeId)
                    .count
            );
        }
        return 0;
    };
    const handlePriceChange = (index, value) => {
        setNewBookingData((prevData) => {
            const updatedPrices = [...prevData.tour.prices]; // Tạo bản sao của mảng prices
            updatedPrices[index].price = value; // Cập nhật giá trị tại index
            return {
                ...prevData,
                tour: {
                    ...prevData.tour,
                    prices: updatedPrices, // Gán lại mảng prices đã cập nhật
                },
            };
        });

        calSumPriceFinal(); // Tính toán lại tổng giá sau khi thay đổi giá
        // const updatedPrices = [...editedPrices];
        // updatedPrices[index].price = parseInt(value, 10) || 0; // Cập nhật giá trị
        // setEditedPrices(updatedPrices);
    };

    const calSumPrice = () => {
        let totalPrice = newBookingData.booking.people.reduce((sum, person) => {
            const price = person.count * calSumFeeByTypeId(person.typeId);
            return sum + price;
        }, 0);

        const surcharge =
            newBookingData.booking.surcharge !== "-"
                ? newBookingData.booking.surcharge
                : 0;
        totalPrice = totalPrice + surcharge;

        setNewBookingData((prevData) => ({
            ...prevData,
            booking: {
                ...prevData.booking,
                totalPrice,
            },
        }));

        return totalPrice;
    };

    const calSumPriceFinal = () => {
        const totalPrice = calSumPrice();
        console.log("Total Price:", totalPrice);
        const vat =
            newBookingData.booking.vat !== "-"
                ? (totalPrice * newBookingData.booking.vat) / 100
                : 0;
        const discount =
            newBookingData.booking.discount !== "-"
                ? (totalPrice * newBookingData.booking.discount) / 100
                : 0;
        const totalPriceAfterDiscount = totalPrice + vat - discount;

        console.log("Total Price After Discount:", totalPriceAfterDiscount);

        setNewBookingData((prevData) => ({
            ...prevData,
            booking: {
                ...prevData.booking,
                totalPrice,
                totalPriceAfterDiscount,
            },
        }));
    };

    return (
        <div style={{ padding: "24px" }}>
            <Flex justify="space-between" align="center">
                <Title level={2}>Chi tiết đặt tour</Title>
                <Button
                    // type="link"
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                >
                    Xử lý
                </Button>
            </Flex>

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
                    {isEditing ? (
                        <div>
                            {editedPrices.map((price, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: "200px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {price.type}:
                                    </span>
                                    <Input
                                        type="number"
                                        value={price.price}
                                        onChange={(e) =>
                                            handlePriceChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        style={{ width: "200px" }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            {bookingData.tour.prices.map((price, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                    }}
                                >
                                    <span>
                                        {price.type}:{" "}
                                        {price.price.toLocaleString()} VNĐ
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
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
                <Descriptions.Item label="Phụ thu (VNĐ)">
                    {isEditing ? (
                        <Input
                            type="number"
                            value={newBookingData.booking.surcharge}
                            onChange={(e) => {
                                setNewBookingData((prevData) => ({
                                    ...prevData,
                                    booking: {
                                        ...prevData.booking,
                                        surcharge: parseInt(e.target.value, 10),
                                    },
                                }));

                                calSumPriceFinal(); // Tính toán lại tổng giá sau khi thay đổi giá
                            }}
                            style={{ width: "200px" }}
                        />
                    ) : (
                        bookingData.booking.surcharge.toLocaleString() + " VNĐ"
                    )}
                    {/* {bookingData.booking.surcharge.toLocaleString()} VNĐ */}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng thanh toán (VNĐ)">
                    {isEditing
                        ? newBookingData.booking.totalPrice.toLocaleString()
                        : bookingData.booking.totalPrice.toLocaleString()}{" "}
                    VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Thuế VAT (%)">
                    {isEditing ? (
                        <Input
                            type="number"
                            value={newBookingData.booking.vat}
                            onChange={(e) => {
                                setNewBookingData((prevData) => ({
                                    ...prevData,
                                    booking: {
                                        ...prevData.booking,
                                        vat: parseInt(e.target.value, 10),
                                    },
                                }));
                                calSumPriceFinal(); // Tính toán lại tổng giá sau khi thay đổi giá
                            }}
                            style={{ width: "200px" }}
                        />
                    ) : (
                        bookingData.booking.vat.toLocaleString() + " %"
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Giảm giá (%)">
                    {isEditing ? (
                        <Input
                            type="number"
                            value={newBookingData.booking.discount}
                            onChange={(e) => {
                                setNewBookingData((prevData) => ({
                                    ...prevData,
                                    booking: {
                                        ...prevData.booking,
                                        discount: parseInt(e.target.value, 10),
                                    },
                                }));
                                calSumPriceFinal(); // Tính toán lại tổng giá sau khi thay đổi giá
                            }}
                            style={{ width: "200px" }}
                        />
                    ) : (
                        bookingData.booking.discount.toLocaleString() + " %"
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng thanh toán sau giảm giá (VNĐ)">
                    {isEditing
                        ? newBookingData.booking.totalPriceAfterDiscount.toLocaleString()
                        : bookingData.booking.totalPriceAfterDiscount.toLocaleString()}{" "}
                    VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Đặt cọc (%)">
                    {isEditing ? (
                        <Input
                            type="number"
                            value={newBookingData.booking.prevPercent}
                            onChange={(e) =>
                                setNewBookingData((prevData) => ({
                                    ...prevData,
                                    booking: {
                                        ...prevData.booking,
                                        prevPercent: parseInt(
                                            e.target.value,
                                            10
                                        ),
                                    },
                                }))
                            }
                            style={{ width: "200px" }}
                        />
                    ) : (
                        bookingData.booking.prevPercent.toLocaleString() + " %"
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền đã đặt cọc (VNĐ)">
                    {bookingData.booking.prevPayment.toLocaleString()} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt cọc">
                    {bookingData.booking.prevPaymentDate}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    {/* Trạng thái có thể là "Chờ xác nhận" hoặc "Đã xác nhận" */}

                    <span
                        style={{
                            background:
                                bookingData.booking.status === "Chờ xử lý"
                                    ? "#fffbe6" // Màu vàng nhạt
                                    : bookingData.booking.status === "Đã xử lý"
                                    ? "#e6f7ff" // Màu xanh nhạt
                                    : bookingData.booking.status ===
                                      "Chờ xác nhận"
                                    ? "#fff1f0" // Màu đỏ nhạt
                                    : "#f6ffed", // Màu xanh lá nhạt
                            padding: "4px 12px", // Tăng khoảng cách padding
                            borderRadius: "16px", // Bo góc mềm mại hơn
                            color:
                                bookingData.booking.status === "Chờ xử lý"
                                    ? "#faad14" // Màu vàng đậm
                                    : bookingData.booking.status === "Đã xử lý"
                                    ? "#1890ff" // Màu xanh đậm
                                    : bookingData.booking.status ===
                                      "Chờ xác nhận"
                                    ? "#f5222d" // Màu đỏ đậm
                                    : "#52c41a", // Màu xanh lá đậm
                            fontWeight: "500", // Độ đậm vừa phải
                            fontSize: "14px", // Kích thước chữ vừa phải
                            display: "inline-block", // Đảm bảo hiển thị gọn gàng
                        }}
                    >
                        {bookingData.booking.status}
                    </span>

                    {/* <Switch
                        checked={
                            bookingData.booking.status === "Đã xác nhận"
                                ? true
                                : false
                        }
                        onChange={handleStatusChange}
                        style={{ marginLeft: "16px" }}
                    >
                        Xác nhận
                    </Switch> */}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Thông tin về tour booking */}
            <Title level={4}>Ghi chú</Title>
            <Input.TextArea
                rows={4}
                placeholder="Nhập ghi chú tại đây..."
                style={{ marginTop: "8px" }}
            />

            {isEditing && (
                <Flex justify="end" align="center">
                    <Space style={{ marginTop: "16px" }}>
                        <Button onClick={handleCancel}>Hủy</Button>
                        <Button type="primary" onClick={handleSave}>
                            Lưu
                        </Button>
                    </Space>
                </Flex>
            )}

            <Flex justify="end" align="center" style={{ marginTop: "16px" }}>
                {bookingData.booking.status === "Chờ xử lý" && (
                    <Button
                        style={{
                            background: "#fffbe6",
                            color: "#faad14",
                            fontWeight: "500",
                            fontSize: "14px",
                        }}
                        onClick={() =>
                            setBookingData((prevData) => ({
                                ...prevData,
                                booking: {
                                    ...prevData.booking,
                                    status: "Đã xử lý",
                                },
                            }))
                        }
                    >
                        Hoàn tất xử lý
                    </Button>
                )}

                {bookingData.booking.status === "Chờ xác nhận" && (
                    <Button
                        style={{
                            background: "#fff1f0",
                            color: "#f5222d",
                            fontWeight: "500",
                            fontSize: "14px",
                        }}
                        onClick={() =>
                            setBookingData((prevData) => ({
                                ...prevData,
                                booking: {
                                    ...prevData.booking,
                                    status: "Đã xác nhận",
                                },
                            }))
                        }
                    >
                        Xác nhận
                    </Button>
                )}
            </Flex>
        </div>
    );
};

export default TourBookingRequestDetail;
