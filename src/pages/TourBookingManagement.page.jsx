import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Space, Button, Input, Modal, Radio, Select } from "antd";
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    FilterOutlined,
} from "@ant-design/icons";

const dataSource = [
    {
        id: 1,
        name: "Tour Hà Nội - Hạ Long",
        customer: "Nguyễn Văn A",
        email: "dinhvanluan2k3@gmail.com",
        phonenumber: "0123456789",
        departureDate: "2023-10-01",
        numsofPeople: 2,
        type: "Cá nhân",
        status: "Chờ xác nhận",
    },
    {
        id: 2,
        name: "Tour Đà Nẵng - Hội An",
        customer: "Nguyễn Đức Phú",
        email: "ducphu2k3@gmail.com",
        phonenumber: "0123456789",
        departureDate: "2023-10-01",
        numsofPeople: 3,
        type: "Doanh nghiệp",
        status: "Đã xác nhận",
    },
];

const TourBookingManagement = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [filterType, setFilterType] = useState(""); // Loại tour
    const [filterStatus, setFilterStatus] = useState(""); // Trạng thái
    const [filteredData, setFilteredData] = useState(dataSource);

    const columns = [
        {
            title: "ID Tour",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên Tour",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Khách Hàng",
            dataIndex: "customer",
            key: "customer",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Liên hệ",
            dataIndex: "phonenumber",
            key: "phonenumber",
        },
        {
            title: "Ngày khởi hành",
            dataIndex: "departureDate",
            key: "departureDate",
        },
        {
            title: "Tổng số người",
            dataIndex: "numsofPeople",
            key: "numsofPeople",
        },
        {
            title: "Loại hình tour",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Hành Động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    const handleView = (record) => {
        console.log("View tour:", record);
    };

    const handleEdit = (record) => {
        console.log("Edit tour:", record);
    };

    const handleDelete = (record) => {
        console.log("Delete tour:", record);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = dataSource.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleFilterApply = () => {
        const filtered = dataSource.filter((item) => {
            const matchesType =
                filterType === "" || item.type.includes(filterType);
            const matchesStatus =
                filterStatus === "" || item.status === filterStatus;
            return matchesType && matchesStatus;
        });
        setFilteredData(filtered);
        setIsFilterVisible(false);
    };

    const handleFilterReset = () => {
        setFilterType("");
        setFilterStatus("");
        setFilteredData(dataSource);
    };

    return (
        <div>
            <h1>Quản Lý Tour Booking</h1>
            <Space style={{ marginTop: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm tên tour"
                    allowClear
                    onSearch={handleSearch}
                    enterButton
                />
                <Button
                    icon={<FilterOutlined />}
                    onClick={() => setIsFilterVisible(true)}
                >
                    Lọc
                </Button>
            </Space>

            {/* Popup Filter */}
            <Modal
                title="Lọc Tour"
                visible={isFilterVisible}
                onCancel={() => setIsFilterVisible(false)}
                footer={[
                    <Button key="reset" onClick={handleFilterReset}>
                        Đặt lại
                    </Button>,
                    <Button
                        key="apply"
                        type="primary"
                        onClick={handleFilterApply}
                    >
                        Áp dụng
                    </Button>,
                ]}
            >
                <div style={{ marginBottom: "16px" }}>
                    <h4>Loại Tour</h4>
                    <Select
                        placeholder="Chọn loại tour"
                        style={{ width: 200 }}
                        allowClear
                        value={filterType}
                        onChange={(value) => setFilterType(value)} // Cập nhật giá trị `filterType`
                    >
                        <Option value="">Tất cả</Option>
                        <Option value="Cá nhân">Cá nhân</Option>
                        <Option value="Doanh nghiệp">Doanh nghiệp</Option>
                    </Select>
                </div>
                <div>
                    <h4>Trạng Thái</h4>
                    <Select
                        placeholder="Chọn trạng thái"
                        style={{ width: 200 }}
                        allowClear
                        value={filterStatus}
                        onChange={(value) => setFilterStatus(value)} // Cập nhật giá trị `filterStatus`
                    >
                        <Option value="">Tất cả</Option>
                        <Option value="Chưa xác nhận">Chưa xác nhận</Option>
                        <Option value="Đã xác nhận">Đã xác nhận</Option>
                    </Select>
                </div>
            </Modal>

            <Table
                style={{ margin: "16px 0" }}
                dataSource={filteredData}
                columns={columns}
                rowKey="id"
                bordered
            />
        </div>
    );
};

export default TourBookingManagement;
