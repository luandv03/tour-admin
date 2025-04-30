import React, { useState } from "react";
import {
    Descriptions,
    Typography,
    Divider,
    Button,
    Input,
    Select,
    DatePicker,
    TimePicker,
    Upload,
    Modal,
    message,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import moment from "moment";

const { Paragraph } = Typography;
const { Title } = Typography;
const { Option } = Select;

const TourDetail = ({ tour }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tourData, setTourData] = useState(
        tour || {
            name: "Tour Hà Nội - Hạ Long",
            type: "Nghỉ dưỡng",
            description: "Tour khám phá Vịnh Hạ Long với các hoạt động thú vị.",
            departureDate: "2025-05-01",
            departureTime: "08:00",
            price: 2000000,
            duration: "3 ngày 2 đêm",
            maxPeople: 20,
            images: [
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg",
            ],
        }
    );
    const [fileList, setFileList] = useState(
        tourData.images.map((url, index) => ({
            uid: index,
            name: `Hình ảnh ${index + 1}`,
            status: "done",
            url,
        }))
    );
    const [description, setDescription] = useState(tourData.description);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [isDescriptionModalVisible, setIsDescriptionModalVisible] =
        useState(false);

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setTourData({
            ...tourData,
            images: newFileList.map((file) => file.url || file.response?.url),
        });
    };

    const handlePreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        setPreviewImage(src);
        setPreviewVisible(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        message.success("Thông tin tour đã được lưu!");
    };

    const handleCancel = () => {
        setIsEditing(false);
        message.info("Chỉnh sửa đã bị hủy.");
    };

    return (
        <div style={{ padding: "24px", position: "relative" }}>
            {/* Nút Edit */}
            <Button
                type="primary"
                icon={<EditOutlined />}
                style={{ position: "absolute", top: 24, right: 24 }}
                onClick={() => setIsEditing(true)}
            >
                Edit
            </Button>

            <Title level={2}>
                {isEditing ? (
                    <Input
                        defaultValue={tourData.name}
                        onChange={(e) =>
                            setTourData({ ...tourData, name: e.target.value })
                        }
                    />
                ) : (
                    tourData.name
                )}
            </Title>

            <Paragraph>
                {isEditing ? (
                    <Select
                        defaultValue={tourData.type}
                        onChange={(value) =>
                            setTourData({ ...tourData, type: value })
                        }
                        style={{ width: "200px" }}
                    >
                        <Option value="Nghỉ dưỡng">Nghỉ dưỡng</Option>
                        <Option value="Khám phá">Khám phá</Option>
                        <Option value="Mạo hiểm">Mạo hiểm</Option>
                        <Option value="Văn hóa">Văn hóa</Option>
                    </Select>
                ) : (
                    tourData.type
                )}
            </Paragraph>

            <Divider />

            <Title level={4}>Hình ảnh</Title>
            <Upload
                action="/upload"
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                onPreview={handlePreview}
                disabled={!isEditing}
            >
                {isEditing && fileList.length < 5 && (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                )}
            </Upload>
            <Modal
                visible={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img
                    alt="Preview"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>

            <Divider />

            <Descriptions bordered column={1}>
                <Descriptions.Item label="Mô tả">
                    {isEditing ? (
                        <Button
                            type="link"
                            onClick={() => setIsDescriptionModalVisible(true)}
                        >
                            Chỉnh sửa mô tả
                        </Button>
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: tourData.description,
                            }} // Hiển thị nội dung HTML an toàn
                        />
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày khởi hành">
                    {isEditing ? (
                        <DatePicker
                            defaultValue={moment(
                                tourData.departureDate,
                                "YYYY-MM-DD"
                            )}
                            format="YYYY-MM-DD"
                            onChange={(date) =>
                                setTourData({
                                    ...tourData,
                                    departureDate: date.format("YYYY-MM-DD"),
                                })
                            }
                        />
                    ) : (
                        tourData.departureDate
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ khởi hành">
                    {isEditing ? (
                        <TimePicker
                            defaultValue={moment(
                                tourData.departureTime,
                                "HH:mm"
                            )}
                            format="HH:mm"
                            onChange={(time) =>
                                setTourData({
                                    ...tourData,
                                    departureTime: time.format("HH:mm"),
                                })
                            }
                        />
                    ) : (
                        tourData.departureTime
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                    {isEditing ? (
                        <Input
                            type="number"
                            defaultValue={tourData.price}
                            onChange={(e) =>
                                setTourData({
                                    ...tourData,
                                    price: parseInt(e.target.value, 10),
                                })
                            }
                        />
                    ) : (
                        `${tourData.price.toLocaleString()} VNĐ`
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian">
                    {isEditing ? (
                        <Input
                            defaultValue={tourData.duration}
                            onChange={(e) =>
                                setTourData({
                                    ...tourData,
                                    duration: e.target.value,
                                })
                            }
                        />
                    ) : (
                        tourData.duration
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Số lượng người tối đa">
                    {isEditing ? (
                        <Input
                            type="number"
                            defaultValue={tourData.maxPeople}
                            onChange={(e) =>
                                setTourData({
                                    ...tourData,
                                    maxPeople: parseInt(e.target.value, 10),
                                })
                            }
                        />
                    ) : (
                        `${tourData.maxPeople} người`
                    )}
                </Descriptions.Item>
            </Descriptions>

            {/* Modal chỉnh sửa mô tả */}
            <Modal
                title="Chỉnh sửa mô tả"
                visible={isDescriptionModalVisible}
                onCancel={() => setIsDescriptionModalVisible(false)}
                onOk={() => {
                    setTourData({ ...tourData, description });
                    setIsDescriptionModalVisible(false);
                }}
            >
                <ReactQuill value={description} onChange={setDescription} />
            </Modal>

            {/* Nút Hủy và Lưu */}
            {isEditing && (
                <div style={{ marginTop: "24px", textAlign: "right" }}>
                    <Button
                        onClick={handleCancel}
                        style={{ marginRight: "8px" }}
                    >
                        Hủy
                    </Button>
                    <Button type="primary" onClick={handleSave}>
                        Lưu
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TourDetail;
