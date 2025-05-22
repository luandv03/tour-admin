import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Descriptions,
    Form,
    Card,
    Typography,
    Divider,
    Button,
    Input,
    Select,
    Upload,
    Modal,
    TimePicker,
    message,
    List,
    Flex,
    Spin,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import moment from "moment";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import { fetchTouristPlaceById } from "../services/api";

const { Paragraph } = Typography;
const { Title } = Typography;
const { Option } = Select;

const TouristPlaceDetail = () => {
    const { placeId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [place, setPlace] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [description, setDescription] = useState("");
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const [isDescriptionModalVisible, setIsDescriptionModalVisible] =
        useState(false);
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

    const [searchResults, setSearchResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: null,
        longitude: null,
        address: "",
    });

    // Fetch tourist place data
    useEffect(() => {
        const fetchPlaceData = async () => {
            setLoading(true);
            try {
                const data = await fetchTouristPlaceById(placeId);

                // Process the data
                const placeData = {
                    id: data.id,
                    name: data.placeName,
                    type: data.placeType?.name || "Không xác định",
                    description: data.description || "",
                    address: data.address || "",
                    latitude: data.latitude || "0",
                    longitude: data.longitude || "0",
                    images: data.images?.map((img) => img.imageUrl) || [],
                    city: data.city?.name || "Không xác định",
                };

                setPlace(placeData);
                setNewPlace(placeData);
                setDescription(placeData.description);

                // Setup file list for image upload component
                if (data.images && data.images.length > 0) {
                    setFileList(
                        data.images.map((img, index) => ({
                            uid: img.id || index,
                            name: `Hình ảnh ${index + 1}`,
                            status: "done",
                            url: img.imageUrl,
                        }))
                    );
                }
            } catch (error) {
                message.error("Không thể tải thông tin địa điểm!");
                console.error("Error fetching place details:", error);
            }
            setLoading(false);
        };

        if (placeId) {
            fetchPlaceData();
        }
    }, [placeId]);

    if (loading || !place) {
        return (
            <div style={{ padding: 48, textAlign: "center" }}>
                <Spin size="large" />
            </div>
        );
    }

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setNewPlace({
            ...newPlace,
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
        setNewPlace({
            ...newPlace,
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

    const handleSave = () => {
        console.log("Đã lưu thông tin:", newPlace);
        setPlace(newPlace);
        setIsEditing(false);
        message.success("Thông tin đã được lưu!");
    };

    const handleCancel = () => {
        setNewPlace(place); // Đặt lại newPlace về giá trị ban đầu
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
                disabled={isEditing}
            >
                Chỉnh sửa
            </Button>

            <Title level={2}>
                {isEditing ? (
                    <Input
                        defaultValue={newPlace.name}
                        onChange={(e) =>
                            setNewPlace({ ...newPlace, name: e.target.value })
                        }
                        style={{ width: "300px" }}
                    />
                ) : (
                    place.name
                )}
            </Title>

            <Paragraph>
                {isEditing ? (
                    <Select
                        defaultValue={newPlace.type}
                        onChange={(value) =>
                            setNewPlace({ ...newPlace, type: value })
                        }
                        style={{ width: "200px" }}
                    >
                        <Option value="Di tích lịch sử">Di tích lịch sử</Option>
                        <Option value="Bãi biển">Bãi biển</Option>
                        <Option value="Chùa chiền">Chùa chiền</Option>
                        <Option value="Núi">Núi</Option>
                    </Select>
                ) : (
                    place.type
                )}
            </Paragraph>

            <Divider />

            <Title level={4}>Hình ảnh</Title>
            <Card>
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
            </Card>
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
                        <Flex
                            style={{ width: "100%" }}
                            align="center"
                            justify="space-between"
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: newPlace.description,
                                }}
                            />
                            <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() =>
                                    setIsDescriptionModalVisible(true)
                                }
                            ></Button>
                        </Flex>
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: place.description,
                            }}
                        />
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                    {isEditing ? (
                        <Flex
                            style={{ width: "100%" }}
                            align="center"
                            justify="space-between"
                        >
                            <p>{newPlace.address}</p>
                            <Button
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => setIsAddressModalVisible(true)}
                            ></Button>
                        </Flex>
                    ) : (
                        place.address
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Thành phố">
                    {place.city}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Bản đồ</Title>
            <div style={{ height: "400px", width: "100%" }}>
                <MapContainer
                    center={[Number(place.latitude), Number(place.longitude)]}
                    zoom={14}
                    style={{ width: "100%", height: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                        position={[
                            Number(place.latitude),
                            Number(place.longitude),
                        ]}
                    />
                </MapContainer>
            </div>

            {/* Modal chỉnh sửa mô tả */}
            <Modal
                title="Chỉnh sửa mô tả"
                visible={isDescriptionModalVisible}
                onCancel={() => setIsDescriptionModalVisible(false)}
                onOk={() => {
                    setNewPlace({ ...newPlace, description });
                    setIsDescriptionModalVisible(false);
                }}
            >
                <ReactQuill value={description} onChange={setDescription} />
            </Modal>

            {/* Modal chỉnh sửa địa chỉ */}
            <Modal
                title="Chỉnh sửa địa chỉ"
                visible={isAddressModalVisible}
                onCancel={() => setIsAddressModalVisible(false)}
                footer={null}
            >
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
                                    position: "absolute",
                                    top: "40px",
                                    left: 0,
                                    right: 0,
                                    zIndex: 1500,
                                    backgroundColor: "white",
                                    border: "1px solid #d9d9d9",
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
                                width: "100%",
                                height: "400px",
                                marginBottom: "16px",
                            }}
                        >
                            <MapContainer
                                center={[
                                    Number(newPlace.latitude) || 21.028511,
                                    Number(newPlace.longitude) || 105.804817,
                                ]}
                                zoom={13}
                                style={{ width: "100%", height: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <MapClickHandler />
                                <MapUpdater />
                                {newPlace.latitude && newPlace.longitude && (
                                    <Marker
                                        position={[
                                            Number(newPlace.latitude),
                                            Number(newPlace.longitude),
                                        ]}
                                    />
                                )}
                            </MapContainer>
                        </div>
                    </Form.Item>

                    <Form.Item label="Địa chỉ đã chọn">
                        <Input
                            value={newPlace.address}
                            readOnly
                            style={{ cursor: "not-allowed" }}
                        />
                    </Form.Item>

                    <div style={{ marginTop: "24px", textAlign: "right" }}>
                        <Button
                            onClick={() => {
                                setIsAddressModalVisible(false);
                                setNewPlace({
                                    ...newPlace,
                                    latitude: place.latitude,
                                    longitude: place.longitude,
                                    address: place.address,
                                });
                            }}
                            style={{ marginRight: "8px" }}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => setIsAddressModalVisible(false)}
                        >
                            Lưu
                        </Button>
                    </div>
                </Form>
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

export default TouristPlaceDetail;
