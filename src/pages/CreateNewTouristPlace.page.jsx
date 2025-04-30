import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Form,
    Input,
    Button,
    Select,
    message,
    List,
    Flex,
    Upload,
    Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";

const { Option } = Select;

const CreateNewTouristPlacePage = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: null,
        longitude: null,
        address: "",
    });
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
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
        setPreviewImage(src); // Lưu URL hình ảnh vào state
        setPreviewVisible(true); // Hiển thị modal
    };

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

    const handleSearch = (value) => {
        if (!value) {
            setSearchResults([]);
            return;
        }

        fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
        )
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
            })
            .catch(() => {
                message.error("Không thể tìm kiếm địa điểm.");
            });
    };

    const handleSelectLocation = (location) => {
        setSelectedLocation({
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
            address: location.display_name,
        });
        setSearchResults([]);
    };

    const MapUpdater = () => {
        const map = useMap();
        if (selectedLocation.latitude && selectedLocation.longitude) {
            map.setView(
                [selectedLocation.latitude, selectedLocation.longitude],
                13
            );
        }
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
            images: fileList.map((file) => file.url || file.response?.url), // Lưu danh sách URL hình ảnh
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

            <Flex gap="middle" style={{ marginTop: "20px" }}>
                <Flex gap="middle" vertical style={{ width: "40%" }}>
                    <Form
                        layout="vertical"
                        onFinish={handleSubmit}
                        style={{ maxWidth: "800px", margin: "0" }}
                    >
                        <Form.Item label="Hình ảnh địa điểm">
                            {/* Modal hiển thị hình ảnh */}
                            <Modal
                                visible={previewVisible}
                                footer={null}
                                onCancel={() => setPreviewVisible(false)} // Đóng modal
                            >
                                <img
                                    alt="Preview"
                                    style={{ width: "100%" }}
                                    src={previewImage} // Hiển thị hình ảnh trong modal
                                />
                            </Modal>

                            {/* Các phần khác của giao diện */}
                            <Upload
                                action="/upload"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                onPreview={handlePreview} // Gọi hàm preview
                            >
                                {fileList.length >= 5 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            Tải lên
                                        </div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>

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
                                <Option value="Di tích lịch sử">
                                    Di tích lịch sử
                                </Option>
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

                        <Input
                            value={selectedLocation.address}
                            placeholder="Địa chỉ sẽ hiển thị tại đây sau khi chọn trên bản đồ"
                            readOnly
                        />

                        {/* <Input
                            value={selectedLocation.address}
                            placeholder="Địa chỉ sẽ hiển thị tại đây sau khi chọn trên bản đồ"
                            readOnly
                        /> */}
                    </Form>
                </Flex>

                <Flex gap="middle" vertical flex="1">
                    <Form layout="vertical">
                        <Form.Item
                            label="Tìm kiếm địa điểm"
                            style={{ position: "relative" }}
                        >
                            <Input.Search
                                placeholder="Nhập tên địa điểm để tìm kiếm"
                                onSearch={handleSearch}
                                enterButton
                            />
                            {searchResults.length > 0 && (
                                <List
                                    bordered
                                    dataSource={searchResults}
                                    renderItem={(item) => (
                                        <List.Item
                                            onClick={() =>
                                                handleSelectLocation(item)
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            {item.display_name}
                                        </List.Item>
                                    )}
                                    style={{
                                        position: "absolute", // Đặt danh sách ở vị trí tuyệt đối
                                        top: "40px", // Đẩy danh sách xuống dưới ô tìm kiếm
                                        left: 0,
                                        right: 0,
                                        zIndex: 1500, // Đảm bảo danh sách nằm trên các phần tử khác
                                        backgroundColor: "white", // Đặt nền trắng để che các phần tử bên dưới
                                        border: "1px solid #d9d9d9", // Viền giống với Ant Design
                                        borderRadius: "4px",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                    }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label="Chọn vị trí trên bản đồ">
                            <div
                                style={{
                                    height: "400px",
                                    marginBottom: "16px",
                                }}
                            >
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
                                    <MapUpdater />
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
                        </Form.Item>
                    </Form>
                </Flex>
            </Flex>

            <Form layout="vertical">
                <Form.Item name="description" label="Mô tả">
                    <ReactQuill
                        value={description}
                        onChange={setDescription}
                        placeholder="Nhập mô tả địa điểm"
                        // style={{ minHeight: "200px" }}
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
            </Form>

            <Flex justify="flex-end" gap="middle">
                <Button onClick={handleCancel}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                    Tạo địa điểm
                </Button>
            </Flex>
        </div>
    );
};

export default CreateNewTouristPlacePage;
