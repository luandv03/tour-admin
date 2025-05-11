import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Space, Button, Input, Select, message } from "antd";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchTours } from "../services/api";

const { Option } = Select;

const TourManagement = () => {
    const [searchText, setSearchText] = useState("");
    const [filterDeparture, setFilterDeparture] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTour = async () => {
        setLoading(true);
        try {
            const res = await fetchTours();
            setData(res);
            setFilteredData(res);
        } catch (err) {
            message.error("Không thể tải dữ liệu tour!");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTour();
    }, []);

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
            key: "price",
            render: (_, record) =>
                record.tourPassengers && record.tourPassengers.length > 0
                    ? record.tourPassengers
                          .map(
                              (p) =>
                                  `${
                                      p.passengerTypeName
                                  }: ${p.price.toLocaleString()} VNĐ`
                          )
                          .join(" | ")
                    : "N/A",
        },
        {
            title: "Điểm Khởi Hành",
            dataIndex: ["departurePoint", "name"],
            key: "departure",
            render: (_, record) =>
                record.departurePoint ? record.departurePoint.name : "",
        },
        {
            title: "Đánh Giá",
            dataIndex: "rating",
            key: "rating",
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
        message.info(`Xóa tour: ${record.name}`);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        let filtered = data;
        if (value) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
        }
        if (filterDeparture) {
            filtered = filtered.filter(
                (item) =>
                    (item.departurePoint &&
                        item.departurePoint.name === filterDeparture) ||
                    filterDeparture === ""
            );
        }
        setFilteredData(filtered);
    };

    const handleFilter = (value) => {
        setFilterDeparture(value);
        let filtered = data;
        if (searchText) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (value) {
            filtered = filtered.filter(
                (item) =>
                    (item.departurePoint &&
                        item.departurePoint.name === value) ||
                    value === ""
            );
        }
        setFilteredData(filtered);
    };

    const departureOptions = [
        ...new Set(
            data.map((item) => item.departurePoint?.name).filter(Boolean)
        ),
    ];

    return (
        <div>
            <h1>Quản Lý Tour</h1>
            <Space style={{ marginTop: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm tên tour"
                    allowClear
                    onSearch={handleSearch}
                    enterButton
                    style={{ width: 250 }}
                />
                <Select
                    placeholder="Lọc theo điểm khởi hành"
                    style={{ width: 200 }}
                    allowClear
                    onChange={handleFilter}
                    value={filterDeparture || undefined}
                >
                    <Option value="">Tất cả</Option>
                    {departureOptions.map((name) => (
                        <Option key={name} value={name}>
                            {name}
                        </Option>
                    ))}
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
                loading={loading}
            />
        </div>
    );
};

export default TourManagement;
