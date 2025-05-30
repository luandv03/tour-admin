import React from "react";
import { useKeycloak } from "../../context/KeycloakContext";
import { Result, Button, Space } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const Unauthorized = () => {
    const { logout } = useKeycloak();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                padding: "24px",
            }}
        >
            <Result
                status="403"
                title="Không có quyền truy cập"
                icon={<ExclamationCircleFilled style={{ color: "#ff4d4f" }} />}
                subTitle="Bạn không có đủ quyền để truy cập tài nguyên này."
                extra={
                    <Space size="middle">
                        <Button
                            type="default"
                            onClick={() => window.history.back()}
                        >
                            Quay lại
                        </Button>
                        <Button type="primary" danger onClick={() => logout()}>
                            Đăng xuất
                        </Button>
                    </Space>
                }
            />
        </div>
    );
};

export default Unauthorized;
