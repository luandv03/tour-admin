import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, message } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

// import MapComponent from "../components/MapComponent";

const { Option } = Select;

const CreateNewTouristPlacePage = () => {
const navigate = useNavigate();
const [description, setDescription] = useState("");
const [selectedLocation, setSelectedLocation] = useState({
latitude: null,
longitude: null,
address: "",
});

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
            .then((response) => response.json())
            .then((data) => {
                setSelectedLocation({
                    latitude: lat,
                    longitude: lng,
                    address: data.display_name || "Không xác định",
                });
            })
            .catch(() => {
                message.error("Không thể lấy thông tin địa chỉ từ bản đồ.");
            });
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };

    const handleSubmit = (values) => {
        if (!selectedLocation.latitude || !selectedLocation.longitude) {
            message.error("Vui lòng chọn địa điểm trên bản đồ.");
            return;
        }

        const newPlace = {
            ...values,
            description,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            address: selectedLocation.address,
        };

        console.log("Địa điểm mới:", newPlace);
        message.success("Địa điểm du lịch mới đã được tạo thành công!");
        navigate("/manage-places"); // Điều hướng về trang quản lý địa điểm
    };

    const handleCancel = () => {
        navigate("/manage-places"); // Điều hướng về trang quản lý địa điểm
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>Tạo địa điểm du lịch mới</h1>
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: "800px", margin: "0 auto" }}
            >
                <Form.Item
                    name="name"
                    label="Tên địa điểm"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên địa điểm",
                        },
                    ]}
                >
                    <Input placeholder="Nhập tên địa điểm" />
                </Form.Item>
                <Form.Item
                    name="type"
                    label="Loại địa điểm"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn loại địa điểm",
                        },
                    ]}
                >
                    <Select placeholder="Chọn loại địa điểm">
                        <Option value="Bãi biển">Bãi biển</Option>
                        <Option value="Chùa chiền">Chùa chiền</Option>
                        <Option value="Núi">Núi</Option>
                        <Option value="Di tích lịch sử">Di tích lịch sử</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="ticket_price"
                    label="Giá vé (VNĐ)"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập giá vé",
                        },
                    ]}
                >
                    <Input type="number" placeholder="Nhập giá vé" />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <ReactQuill
                        value={description}
                        onChange={setDescription}
                        placeholder="Nhập mô tả địa điểm"
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, 3, false] }], // Tiêu đề
                                ["bold", "italic", "underline", "strike"], // Định dạng chữ
                                [{ color: [] }, { background: [] }], // Màu chữ và nền
                                [{ script: "sub" }, { script: "super" }], // Chỉ số trên/dưới
                                [{ list: "ordered" }, { list: "bullet" }], // Danh sách
                                [{ align: [] }], // Căn chỉnh
                                ["link", "image", "video"], // Chèn liên kết, ảnh, video
                                ["blockquote", "code-block"], // Trích dẫn, khối mã
                                ["clean"], // Xóa định dạng
                            ],
                        }}
                        formats={[
                            "header",
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "color",
                            "background",
                            "script",
                            "list",
                            "bullet",
                            "align",
                            "link",
                            "image",
                            "video",
                            "blockquote",
                            "code-block",
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Chọn địa điểm trên bản đồ">
                    <div style={{ height: "400px", marginBottom: "16px" }}>
                        <MapContainer
                            center={[21.028511, 105.804817]} // Tọa độ mặc định (Hà Nội)
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapClickHandler />
                            {selectedLocation.latitude &&
                                selectedLocation.longitude && (
                                    <Marker
                                        position={[
                                            selectedLocation.latitude,
                                            selectedLocation.longitude,
                                        ]}
                                    />
                                )}
                        </MapContainer>
                    </div>

                    <Input
                        value={selectedLocation.address}
                        placeholder="Địa chỉ sẽ hiển thị tại đây sau khi chọn trên bản đồ"
                        readOnly
                    />
                </Form.Item>
                <Form.Item>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "8px",
                        }}
                    >
                        <Button onClick={handleCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit">
                            Tạo địa điểm
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );

};

export default CreateNewTouristPlacePage;
