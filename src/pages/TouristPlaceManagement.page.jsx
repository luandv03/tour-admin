import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Input,
    Select,
    Space,
    Modal,
    Form,
    message,
} from "antd";
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { Option } = Select;

const mockData = [
    {
        tourist_place_id: "1",
        name: "Vịnh Hạ Long",
        description: "Một trong bảy kỳ quan thiên nhiên thế giới.",
        address: "Quảng Ninh",
        city: "Quảng Ninh",
        type: "Bãi biển",
        ticket_price: 200000,
        rating: 4.8,
    },
    {
        tourist_place_id: "2",
        name: "Chùa Một Cột",
        description: "Ngôi chùa nổi tiếng tại Hà Nội.",
        address: "Hà Nội",
        city: "Hà Nội",
        type: "Chùa chiền",
        ticket_price: 0,
        rating: 4.7,
    },
];

const TouristPlaceManagementPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        // Giả lập gọi API để lấy dữ liệu
        setLoading(true);
        setTimeout(() => {
            setData(mockData);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleFilterChange = (value) => {
        setFilterType(value === "Tất cả" ? undefined : value);
    };

    const handleDeletePlace = (placeId) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa địa điểm này?",
            okText: "Xóa",
            cancelText: "Hủy",
            onOk: () => {
                setData((prevData) =>
                    prevData.filter(
                        (place) => place.tourist_place_id !== placeId
                    )
                );
                message.success("Xóa địa điểm thành công!");
            },
        });
    };

    const filteredData = data.filter(
        (place) =>
            place.name.toLowerCase().includes(searchText.toLowerCase()) &&
            (!filterType || place.type === filterType)
    );

    const columns = [
        {
            title: "Tên địa điểm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Thành phố",
            dataIndex: "city",
            key: "city",
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Giá vé (VNĐ)",
            dataIndex: "ticket_price",
            key: "ticket_price",
            render: (value) => value.toLocaleString(),
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() =>
                            navigate(
                                "/manage-places/" + record.tourist_place_id
                            )
                        }
                    />
                    {/* <Button
                        type="link"
                        icon={<EditOutlined />}
                        // onClick={() => handleEdit(record)}
                    /> */}
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                            handleDeletePlace(record.tourist_place_id)
                        }
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1>Quản lý địa điểm du lịch</h1>
            <Space style={{ marginTop: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm địa điểm"
                    onSearch={handleSearch}
                    allowClear
                />
                <Select
                    placeholder="Lọc theo loại"
                    style={{ width: 200 }}
                    onChange={handleFilterChange}
                    allowClear
                >
                    <Option value="Tất cả">Tất cả</Option>
                    <Option value="Bãi biển">Bãi biển</Option>
                    <Option value="Chùa chiền">Chùa chiền</Option>
                    <Option value="Núi">Núi</Option>
                    <Option value="Di tích lịch sử">Di tích lịch sử</Option>
                </Select>
            </Space>

            <div style={{ textAlign: "right", margin: "16px 0" }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/manage-places/create")}
                >
                    Thêm địa điểm mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="tourist_place_id"
                loading={loading}
                bordered
            />
        </div>
    );
};

export default TouristPlaceManagementPage;
