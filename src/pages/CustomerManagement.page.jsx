import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    Input,
    Button,
    Space,
    Popover,
    Typography,
    Popconfirm,
} from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    EyeOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const CustomerManagement = () => {
    const [searchText, setSearchText] = useState("");
    const [filterVisible, setFilterVisible] = useState(false);
    const navigate = useNavigate();

    const data = [
        {
            id: "C001",
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0123456789",
            toursBooked: 5,
        },
        {
            id: "C002",
            name: "Trần Thị B",
            email: "tranthib@example.com",
            phone: "0987654321",
            toursBooked: 3,
        },
        // Thêm dữ liệu mẫu khác
    ];

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleDelete = (id) => {
        console.log("Xóa khách hàng với ID:", id);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Số tour đã đặt",
            dataIndex: "toursBooked",
            key: "toursBooked",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/customers/${record.id}`)}
                    ></Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa khách hàng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            danger
                        ></Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // const filterContent = (
    //     <div>
    //         <p>
    //             <Input
    //                 placeholder="Lọc theo tên"
    //                 style={{ marginBottom: "8px" }}
    //             />
    //         </p>
    //         <p>
    //             <Input
    //                 placeholder="Lọc theo email"
    //                 style={{ marginBottom: "8px" }}
    //             />
    //         </p>
    //         <p>
    //             <Input
    //                 placeholder="Lọc theo số điện thoại"
    //                 style={{ marginBottom: "8px" }}
    //             />
    //         </p>
    //         <Button type="primary" block>
    //             Áp dụng
    //         </Button>
    //     </div>
    // );

    return (
        <div style={{ padding: "24px" }}>
            <Title level={2}>Quản lý khách hàng</Title>

            <Space
                style={{
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Input.Search
                    placeholder="Tìm kiếm khách hàng"
                    allowClear
                    enterButton={<SearchOutlined />}
                    onSearch={handleSearch}
                    style={{ width: "300px" }}
                />
                {/* <Popover
                    content={filterContent}
                    title="Bộ lọc"
                    trigger="click"
                    visible={filterVisible}
                    onVisibleChange={(visible) => setFilterVisible(visible)}
                >
                    <Button icon={<FilterOutlined />}>Lọc</Button>
                </Popover> */}
            </Space>

            <Table
                columns={columns}
                dataSource={data.filter(
                    (item) =>
                        item.name
                            .toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                        item.email
                            .toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                        item.phone.includes(searchText)
                )}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default CustomerManagement;
