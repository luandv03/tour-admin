import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Input,
    Select,
    Space,
    Modal,
    message,
    Image,
    Tag,
} from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchTouristPlaces } from "../services/api";

const { Option } = Select;

const TouristPlaceManagementPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchTouristPlaces();
                setData(res);
            } catch (err) {
                message.error("Không thể tải dữ liệu địa điểm!");
            }
            setLoading(false);
        };
        fetchData();
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
                    prevData.filter((place) => place.id !== placeId)
                );
                message.success("Xóa địa điểm thành công!");
            },
        });
    };

    const filteredData = data.filter(
        (place) =>
            (place.placeName
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
                place.address
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                place.city?.name
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase())) &&
            (!filterType || place.placeType?.name === filterType)
    );

    const columns = [
        {
            title: "Tên địa điểm",
            dataIndex: "placeName",
            key: "placeName",
        },
        {
            title: "Hình ảnh",
            dataIndex: "images",
            key: "images",
            render: (images) =>
                images && images.length > 0 ? (
                    <Image
                        width={80}
                        src={images[0].imageUrl}
                        alt="tourist place"
                    />
                ) : (
                    <span>Không có ảnh</span>
                ),
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Thành phố",
            dataIndex: ["city", "name"],
            key: "city",
            render: (_, record) => record.city?.name || "",
        },
        {
            title: "Loại",
            dataIndex: ["placeType", "name"],
            key: "type",
            render: (_, record) =>
                record.placeType?.name ? (
                    <Tag color="blue">{record.placeType.name}</Tag>
                ) : (
                    ""
                ),
        },

        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate("/manage-places/" + record.id)}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeletePlace(record.id)}
                    />
                </Space>
            ),
        },
    ];

    // Lấy danh sách loại địa điểm duy nhất cho filter
    const placeTypes = [
        ...new Set(data.map((place) => place.placeType?.name).filter(Boolean)),
    ];

    return (
        <div>
            <h1>Quản lý địa điểm du lịch</h1>
            <Space style={{ marginTop: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm địa điểm, địa chỉ, thành phố"
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
                    {placeTypes.map((type) => (
                        <Option key={type} value={type}>
                            {type}
                        </Option>
                    ))}
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
                rowKey="id"
                loading={loading}
                bordered
            />
        </div>
    );
};

export default TouristPlaceManagementPage;
