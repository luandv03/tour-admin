import React, { useState } from "react";
import { Row, Col, Card, Table, Select, Progress } from "antd";
import {
    EnvironmentOutlined,
    TeamOutlined,
    DollarOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts";

const DashboardPage = () => {
    const [revenueFilter, setRevenueFilter] = useState("7 ngày gần đây");

    // Dữ liệu thống kê tổng quan
    const stats = [
        {
            icon: (
                <EnvironmentOutlined
                    style={{ fontSize: 24, color: "#1890ff" }}
                />
            ),
            title: "Địa điểm du lịch",
            count: 120, // Tổng số địa điểm du lịch
        },
        {
            icon: (
                <ScheduleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
            ),
            title: "Tour",
            count: 45, // Tổng số tour
        },
        {
            icon: <TeamOutlined style={{ fontSize: 24, color: "#faad14" }} />,
            title: "Khách hàng",
            count: 200, // Tổng số khách hàng
        },
        {
            icon: <DollarOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />,
            title: "Doanh thu",
            count: "1,200,000,000 VND", // Tổng doanh thu
        },
    ];

    // Dữ liệu doanh thu
    const revenueData = [
        { date: "Thứ 2", revenue: 8000000 },
        { date: "Thứ 3", revenue: 12000000 },
        { date: "Thứ 4", revenue: 15000000 },
        { date: "Thứ 5", revenue: 20000000 },
        { date: "Thứ 6", revenue: 18000000 },
        { date: "Thứ 7", revenue: 22000000 },
        { date: "Chủ nhật", revenue: 25000000 },
    ];

    const revenueConfig = {
        data: revenueData,
        xField: "date",
        yField: "revenue",
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
        },
        meta: {
            revenue: {
                alias: "Doanh thu (VNĐ)",
            },
        },
    };

    // Dữ liệu top địa điểm du lịch
    const topPlaces = [
        { name: "Vịnh Hạ Long", rating: 4.8 },
        { name: "Chùa Một Cột", rating: 4.7 },
        { name: "Núi Fansipan", rating: 4.6 },
        { name: "Bãi biển Mỹ Khê", rating: 4.5 },
    ];

    // Dữ liệu danh sách tour gần đây
    const recentTours = [
        {
            tourId: "TOUR-001",
            name: "Khám phá Hà Nội",
            status: "Approved",
            totalPrice: "5,000,000 VND",
        },
        {
            tourId: "TOUR-002",
            name: "Hành trình miền Trung",
            status: "Pending",
            totalPrice: "8,000,000 VND",
        },
    ];

    // Dữ liệu danh sách đặt tour gần đây
    const recentBookings = [
        {
            bookingId: "BOOK-001",
            user: "Nguyễn Văn A",
            tour: "Khám phá Hà Nội",
            status: "Paid",
        },
        {
            bookingId: "BOOK-002",
            user: "Trần Thị B",
            tour: "Hành trình miền Trung",
            status: "Pending",
        },
    ];

    const tourColumns = [
        { title: "Tour ID", dataIndex: "tourId", key: "tourId" },
        { title: "Tên tour", dataIndex: "name", key: "name" },
        { title: "Trạng thái", dataIndex: "status", key: "status" },
        { title: "Tổng giá", dataIndex: "totalPrice", key: "totalPrice" },
    ];

    const bookingColumns = [
        { title: "Booking ID", dataIndex: "bookingId", key: "bookingId" },
        { title: "Khách hàng", dataIndex: "user", key: "user" },
        { title: "Tour", dataIndex: "tour", key: "tour" },
        { title: "Trạng thái", dataIndex: "status", key: "status" },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Thống kê tổng quan */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {stats.map((stat, index) => (
                    <Col span={6} key={index}>
                        <Card>
                            <Row align="middle">
                                <Col span={6}>{stat.icon}</Col>
                                <Col span={18}>
                                    <h4>{stat.title}</h4>
                                    <p style={{ fontSize: 24, margin: 0 }}>
                                        {stat.count}
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Doanh thu tổng quan và Top địa điểm du lịch */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={16}>
                    <Card
                        title="Doanh thu tổng quan"
                        extra={
                            <Select
                                value={revenueFilter}
                                onChange={(value) => setRevenueFilter(value)}
                                style={{ width: 150 }}
                            >
                                <Select.Option value="7 ngày gần đây">
                                    7 ngày gần đây
                                </Select.Option>
                                <Select.Option value="30 ngày gần đây">
                                    30 ngày gần đây
                                </Select.Option>
                                <Select.Option value="90 ngày gần đây">
                                    90 ngày gần đây
                                </Select.Option>
                            </Select>
                        }
                    >
                        <Column {...revenueConfig} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Top địa điểm du lịch">
                        {topPlaces.map((place, index) => (
                            <Row key={index} style={{ marginBottom: 16 }}>
                                <Col span={16}>{place.name}</Col>
                                <Col span={8} style={{ textAlign: "right" }}>
                                    {place.rating} ★
                                </Col>
                                <Col span={24}>
                                    <div style={{ marginTop: 8 }}>
                                        <Progress
                                            percent={place.rating * 20}
                                            showInfo={false}
                                            strokeColor="#faad14"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        ))}
                    </Card>
                </Col>
            </Row>

            {/* Danh sách tour gần đây và đặt tour gần đây */}
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card title="Danh sách tour gần đây">
                        <Table
                            dataSource={recentTours}
                            columns={tourColumns}
                            pagination={false}
                            bordered
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Danh sách đặt tour gần đây">
                        <Table
                            dataSource={recentBookings}
                            columns={bookingColumns}
                            pagination={false}
                            bordered
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;
