import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
    GlobalOutlined,
    SendOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    DownOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Dropdown, Avatar, Space } from "antd";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, path = "/i", children) {
    return {
        key,
        icon,
        children,
        label,
        path,
    };
}
const items = [
    getItem("Dashboard", "1", <PieChartOutlined />, "/"),
    getItem("Quản lý địa điểm", "2", <GlobalOutlined />, "/manage-places"),
    getItem("Quản lý tour du lịch", "sub1", <SendOutlined />, null, [
        getItem("Danh sách tour", "3", null, "/tours"),
        // getItem("Tour khách hàng yêu cầu", "4", null, "/customer-tours"),
        getItem("Tour booking", "5", null, "/tours-booking"),
    ]),
    getItem("Quản lý khách hàng", "6", <TeamOutlined />, "/customers"),
    getItem("Quản lý tài khoản", "7", <UserOutlined />, "/accounts"),
];
const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate(); // Hook để điều hướng giữa các trang

    // Dropdown menu items
    const onMenuClick = (e) => {
        const clickedItem = items
            .flatMap((item) => [item, ...(item.children || [])]) // Flatten items and children
            .find((item) => item.key === e.key); // Find the clicked item

        if (clickedItem?.path) {
            navigate(clickedItem.path); // Điều hướng đến đường dẫn tương ứng
        }
    };

    const userMenu = (
        <Menu>
            <Menu.Item
                key="profile"
                icon={<UserOutlined />}
                // onClick={() => navigate("/profile")}
            >
                Thông tin tài khoản
            </Menu.Item>
            {/* <Menu.Item key="settings" icon={<SettingOutlined />}>
                Cài đặt
            </Menu.Item> */}
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Header
                    style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.2)", // Màu nền tùy chỉnh
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 16px",
                        cursor: "pointer",
                    }}
                >
                    <img
                        src="travelgo_admin.jpg" // Đường dẫn đến logo
                        alt="Logo"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "50px", // Chiều cao tối đa của logo
                            objectFit: "contain",
                        }}
                    />
                </Header>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    items={items}
                    onClick={onMenuClick} // Gọi hàm điều hướng khi click
                />
            </Sider>
            <Layout style={{ width: "100%" }}>
                <Header
                    style={{
                        padding: "0 16px",
                        background: colorBgContainer,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        height: "64px", // Đặt chiều cao cố định cho Header
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ cho Header
                    }}
                >
                    <Dropdown overlay={userMenu} trigger={["hover"]}>
                        <Space style={{ cursor: "pointer" }}>
                            <Avatar size="large" icon={<UserOutlined />} />
                            <span>Luan dinh</span>
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                </Header>
                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
export default MainLayout;
