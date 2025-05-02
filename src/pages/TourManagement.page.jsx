import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Space, Button, Input, Select, Row, Col } from "antd";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const dataSource = [
    {
        id: 1,
        name: "Tour Hà Nội - Hạ Long",
        price: "2,500,000 VNĐ",
        departure: "Hà Nội",
        totalDays: 3,
    },
    {
        id: 2,
        name: "Tour Đà Nẵng - Hội An",
        price: "3,000,000 VNĐ",
        departure: "Đà Nẵng",
        totalDays: 4,
    },
];

const TourManagement = () => {
    const [searchText, setSearchText] = useState("");
    const [filterDeparture, setFilterDeparture] = useState("");
    const [filteredData, setFilteredData] = useState(dataSource);
    const navigate = useNavigate();

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
            title: "Giá Tour",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Điểm Khởi Hành",
            dataIndex: "departure",
            key: "departure",
        },
        {
            title: "Tổng Số Ngày",
            dataIndex: "totalDays",
            key: "totalDays",
        },
        {
            title: "Hành Động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate("/tours/" + record.id)}
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

    const handleFilter = (value) => {
        setFilterDeparture(value);
        const filtered = dataSource.filter(
            (item) => item.departure === value || value === ""
        );
        setFilteredData(filtered);
    };

    return (
        <div>
            <h1>Quản Lý Tour</h1>
            <Space style={{ marginTop: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm tên tour"
                    allowClear
                    onSearch={handleSearch}
                    enterButton
                />
                <Select
                    placeholder="Lọc theo điểm khởi hành"
                    style={{ width: 200 }}
                    allowClear
                    onChange={handleFilter}
                >
                    <Option value="">Tất cả</Option>
                    <Option value="Hà Nội">Hà Nội</Option>
                    <Option value="Đà Nẵng">Đà Nẵng</Option>
                </Select>
            </Space>

            <div style={{ textAlign: "right", margin: "16px 0" }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/tours/create")}
                >
                    Tạo Tour
                </Button>
            </div>
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="id"
                bordered
            />
        </div>
    );
};

export default TourManagement;
