import React from "react";
import { Descriptions, Table, Typography, Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const CustomerDetail = () => {
    const navigate = useNavigate();

    // Dữ liệu mẫu
    const customerData = {
        id: "C001",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0123456789",
        address: "Hà Nội, Việt Nam",
        totalBookings: 5,
    };

    const bookingData = [
        {
            id: "B001",
            tourName: "Tour Hà Nội - Hạ Long",
            departureDate: "2025-05-01",
            status: "Đã xác nhận",
        },
        {
            id: "B002",
            tourName: "Tour Đà Nẵng - Hội An",
            departureDate: "2025-06-15",
            status: "Chờ xác nhận",
        },
        // Thêm dữ liệu mẫu khác
    ];

    const columns = [
        {
            title: "ID Tour",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên Tour",
            dataIndex: "tourName",
            key: "tourName",
        },
        {
            title: "Ngày khởi hành",
            dataIndex: "departureDate",
            key: "departureDate",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/tour-booking/${record.id}`)}
                    ></Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>Chi tiết khách hàng</Title>

            <Descriptions bordered column={1} style={{ marginBottom: "24px" }}>
                <Descriptions.Item label="ID">
                    {customerData.id}
                </Descriptions.Item>
                <Descriptions.Item label="Tên">
                    {customerData.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {customerData.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {customerData.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                    {customerData.address}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng số tour đã đặt">
                    {customerData.totalBookings}
                </Descriptions.Item>
            </Descriptions>

            <Title level={4}>Danh sách tour đã đặt</Title>
            <Table
                columns={columns}
                dataSource={bookingData}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default CustomerDetail;
