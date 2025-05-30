import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    Space,
    Button,
    Input,
    Modal,
    Select,
    Spin,
    message,
} from "antd";
import { EyeOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import { bookTour, fetchAllTourBookings } from "../services/api";
import { STATUS_BOOKING_ENUM } from "../utils/statusBooking";

const { Option } = Select;

const TourBookingManagement = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchAllTourBookings();
                // Chuẩn hóa dữ liệu cho table
                const data = res.map((item) => ({
                    id: item.tour.id,
                    name: item.tour?.name,
                    tourBookingId: item.tourBookingId,
                    departureDate: item.departureDate,
                    numsofPeople: item.bookingPassengers?.reduce(
                        (sum, p) => sum + (p.numberOfPerson || 0),
                        0
                    ),
                    type: item.tour?.isCustom ? "Cá nhân" : "Doanh nghiệp",
                    status: STATUS_BOOKING_ENUM[item.status],
                }));
                setDataSource(data);
                setFilteredData(data);
            } catch (err) {
                message.error("Không thể tải dữ liệu tour booking!");
            }
            setLoading(false);
        };
        fetchData();
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
            title: "Mã booking",
            dataIndex: "tourBookingId",
            key: "tourBookingId",
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
                        onClick={() =>
                            navigate(`/tours-booking/${record.tourBookingId}`)
                        }
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
        message.info(`Xóa booking: ${record.name}`);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = dataSource.filter((item) =>
            (item.name || "").toLowerCase().includes(value.toLowerCase())
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
                open={isFilterVisible}
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
                        onChange={(value) => setFilterType(value)}
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
                        onChange={(value) => setFilterStatus(value)}
                    >
                        <Option value="">Tất cả</Option>
                        {Object.entries(STATUS_BOOKING_ENUM).map(
                            ([key, value]) => (
                                <Option key={key} value={value}>
                                    {value}
                                </Option>
                            )
                        )}
                    </Select>
                </div>
            </Modal>

            <Table
                style={{ margin: "16px 0" }}
                dataSource={filteredData}
                columns={columns}
                rowKey="id"
                bordered
                loading={loading}
            />
        </div>
    );
};

export default TourBookingManagement;
