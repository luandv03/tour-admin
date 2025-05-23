import React, { useState, useEffect } from "react";
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
    Spin,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
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
import {
    createTouristPlace,
    fetchCities,
    fetchPlaceTypes,
} from "../services/api";

const { Option } = Select;

const CreateNewTouristPlacePage = () => {
    const [form] = Form.useForm();
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
    const [imageUrls, setImageUrls] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [cities, setCities] = useState([]);
    const [placeTypes, setPlaceTypes] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        // Fetch cities and place types when component mounts
        const loadInitialData = async () => {
            setInitialLoading(true);
            try {
                const [citiesData, placeTypesData] = await Promise.all([
                    fetchCities(),
                    fetchPlaceTypes(),
                ]);

                setCities(citiesData);
                setPlaceTypes(placeTypesData);
            } catch (error) {
                message.error("Không thể tải dữ liệu ban đầu");
                console.error("Error loading initial data:", error);
            } finally {
                setInitialLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleUploadChange = ({ file, fileList: newFileList }) => {
        setFileList(newFileList);

        // When a file is uploaded successfully
        if (file.status === "done") {
            // Extract the URL from the Cloudinary response
            const imageUrl = file.response.secure_url;

            // Add the new URL to the imageUrls array
            setImageUrls((prev) => [...prev, imageUrl]);

            message.success(`${file.name} uploaded successfully`);
        } else if (file.status === "error") {
            message.error(`${file.name} upload failed.`);
        }
    };

    // Custom request to handle the file upload to Cloudinary
    const customRequest = async ({ file, onSuccess, onError }) => {
        setUploading(true);
        const formData = new FormData();

        // Add necessary parameters for Cloudinary upload
        formData.append("file", file);
        formData.append("upload_preset", "unsigned_preset"); // Your Cloudinary upload preset
        // formData.append("126654542199819", "n9XE9jyzNT8BIMW8a5T9ZxZMutQ"); // Replace with your actual API key from the CLOUDINARY_URL

        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dmbhadjzw/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();

            if (data.secure_url) {
                onSuccess(data, file);
            } else {
                onError(new Error("Upload failed"));
            }
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            onError(error);
        } finally {
            setUploading(false);
        }
    };

    const handlePreview = async (file) => {
        let src = file.url || file.response?.secure_url;
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

    const handleSubmit = async (values) => {
        if (!selectedLocation.latitude || !selectedLocation.longitude) {
            message.error("Vui lòng chọn địa điểm trên bản đồ.");
            return;
        }

        if (imageUrls.length === 0) {
            message.warning("Vui lòng tải lên ít nhất một hình ảnh.");
            return;
        }

        setSubmitting(true);

        // Prepare data for API
        const touristPlaceData = {
            name: values.name,
            description: description,
            address: selectedLocation.address,
            latitude: String(selectedLocation.latitude),
            longitude: String(selectedLocation.longitude),
            cityId: values.cityId,
            placeTypeId: values.placeTypeId,
            imageUrls: imageUrls,
        };

        try {
            // Call API to create tourist place
            const response = await createTouristPlace(touristPlaceData);

            message.success("Địa điểm du lịch mới đã được tạo thành công!");

            // Navigate to the detail page of the newly created tourist place
            navigate(`/manage-places/${response.id}`);
        } catch (error) {
            console.error("Failed to create tourist place:", error);
            message.error(
                "Tạo địa điểm du lịch thất bại. Vui lòng thử lại sau."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/manage-places"); // Điều hướng về trang quản lý địa điểm
    };

    if (initialLoading) {
        return (
            <div
                style={{
                    padding: "24px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }}
            >
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <h1>Tạo địa điểm du lịch mới</h1>

            <Flex gap="middle" style={{ marginTop: "20px" }}>
                <Flex gap="middle" vertical style={{ width: "40%" }}>
                    <Form
                        layout="vertical"
                        onFinish={handleSubmit}
                        form={form}
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
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                onPreview={handlePreview} // Gọi hàm preview
                                customRequest={customRequest}
                            >
                                {uploading ? (
                                    <LoadingOutlined />
                                ) : fileList.length >= 5 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            Tải lên
                                        </div>
                                    </div>
                                )}
                            </Upload>
                            <div style={{ marginTop: 8 }}>
                                <small>
                                    Đã tải lên {imageUrls.length} hình ảnh
                                </small>
                            </div>
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
                            name="placeTypeId"
                            label="Loại địa điểm"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn loại địa điểm",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn loại địa điểm"
                                showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {placeTypes.map((type) => (
                                    <Option key={type.id} value={type.id}>
                                        {type.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="cityId"
                            label="Thành phố"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn thành phố",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn thành phố"
                                showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {cities.map((city) => (
                                    <Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
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
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, 3, false] }],
                                ["bold", "italic", "underline", "strike"],
                                [{ color: [] }, { background: [] }],
                                [{ script: "sub" }, { script: "super" }],
                                [{ list: "ordered" }, { list: "bullet" }],
                                [{ align: [] }],
                                ["link", "image", "video"],
                                ["blockquote", "code-block"],
                                ["clean"],
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
                <Button
                    type="primary"
                    onClick={() => form.submit()}
                    loading={submitting}
                >
                    Tạo địa điểm
                </Button>
            </Flex>
        </div>
    );
};

export default CreateNewTouristPlacePage;
