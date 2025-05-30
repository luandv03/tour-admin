import React, { useEffect } from "react";
import {
    Row,
    Col,
    Typography,
    Form,
    Input,
    Button,
    Space,
    Divider,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useKeycloak } from "../../context/KeycloakContext";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";

const { Title, Text } = Typography;

const SignIn = () => {
    const { login, isAuthenticated, isLoading } = useKeycloak();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy đường dẫn redirect sau khi đăng nhập (nếu có)
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, from]);

    const handleKeycloakLogin = () => {
        login();
    };

    return (
        <Row style={{ minHeight: "100vh" }}>
            {/* Left Side - Form */}
            <Col
                xs={24}
                md={12}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                }}
            >
                <div style={{ maxWidth: 400, width: "100%" }}>
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <LockOutlined
                            style={{
                                fontSize: 40,
                                color: "#1890ff",
                                marginBottom: 16,
                            }}
                        />
                        <Title level={2}>TravelGo</Title>
                    </div>

                    <Form layout="vertical" size="large">
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập email!",
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Email"
                                autoComplete="email"
                                autoFocus
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu!",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu"
                                autoComplete="current-password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button block onClick={handleKeycloakLogin}>
                                Đăng nhập với Keycloak
                            </Button>
                        </Form.Item>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <RouterLink to="#">Quên mật khẩu?</RouterLink>
                            <RouterLink to="/signup">
                                Chưa có tài khoản? Đăng ký
                            </RouterLink>
                        </div>
                    </Form>
                </div>
            </Col>

            {/* Right Side - Image */}
            <Col
                xs={0}
                md={12}
                style={{
                    backgroundImage:
                        "url(https://source.unsplash.com/random?travel)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                ></div>
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        textAlign: "center",
                        padding: 24,
                    }}
                >
                    <div>
                        <Title
                            level={1}
                            style={{ color: "white", marginBottom: 24 }}
                        >
                            Khám phá thế giới
                        </Title>
                        <Title
                            level={3}
                            style={{ color: "white", fontWeight: "normal" }}
                        >
                            Hãy tham gia cùng chúng tôi để trải nghiệm những
                            chuyến đi tuyệt vời nhất
                        </Title>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default SignIn;
