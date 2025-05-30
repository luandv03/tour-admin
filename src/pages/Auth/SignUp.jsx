import React from "react";
import { Form, Input, Button, Row, Col, Typography, Card } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

const SignUp = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    // Xử lý đăng ký
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card className="signup-card">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <LockOutlined style={{ fontSize: 40, color: "#1890ff" }} />
            <Title level={3}>Đăng ký</Title>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            scrollToFirstError
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="Họ"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ của bạn!",
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Họ" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Tên"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên của bạn!",
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Tên" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
                {
                  required: true,
                  message: "Vui lòng nhập email của bạn!",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự!",
                },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Xác nhận mật khẩu"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ marginTop: 16 }}
              >
                Đăng ký
              </Button>
            </Form.Item>

            <div style={{ textAlign: "right" }}>
              <Link to="/signin">Bạn đã có tài khoản? Đăng nhập</Link>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default SignUp;
