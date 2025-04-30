import React, { useState } from "react";
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

const { Paragraph } = Typography;
const { Title } = Typography;
const { Option } = Select;

const TouristPlaceDetail = ({ touristPlace }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [place, setPlace] = useState(
        touristPlace || {
            name: "Vịnh Hạ Long",
            type: "Bãi biển",
            description:
                "Vịnh Hạ Long là một trong những kỳ quan thiên nhiên thế giới.",
            address: "Quảng Ninh, Việt Nam",
            latitude: "20.9673073",
            longitude: "106.8868135",
            ticketPrice: "200,000 VNĐ",
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6fX7LS2Vtr0dLqd6X1e1KarnYoBNKI5YEpA&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH8HIJQLisCt5na1f5gEdON2g0ha4RTN1eDQ&s",
            ],
            startHour: "8:00 AM",
            endHour: "5:00 PM",
        }
    );
    const [newPlace, setNewPlace] = useState(place);
    const [fileList, setFileList] = useState(
        place.images.map((url, index) => ({
            uid: index,
            name: `Hình ảnh ${index + 1}`,
            status: "done",
            url,
        }))
    );
    const [description, setDescription] = useState(place.description);
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
                        <Option value="Bãi biển">Bãi biển</Option>
                        <Option value="Chùa chiền">Chùa chiền</Option>
                        <Option value="Núi">Núi</Option>
                        <Option value="Di tích lịch sử">Di tích lịch sử</Option>
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
                                }} // Hiển thị nội dung HTML an toàn
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
                            }} // Hiển thị nội dung HTML an toàn
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
                <Descriptions.Item label="Giá vé">
                    {isEditing ? (
                        <Input
                            defaultValue={newPlace.ticketPrice}
                            onChange={(e) =>
                                setNewPlace({
                                    ...newPlace,
                                    ticketPrice: e.target.value,
                                })
                            }
                        />
                    ) : (
                        place.ticketPrice
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ mở cửa">
                    {isEditing ? (
                        <>
                            <TimePicker
                                defaultValue={moment(
                                    newPlace.startHour,
                                    "h:mm A"
                                )}
                                format="h:mm A"
                                onChange={(time) => {
                                    console.log(time.format("h:mm A"));
                                    setNewPlace({
                                        ...newPlace,
                                        startHour: time.format("h:mm A"),
                                    });
                                }}
                            />{" "}
                            -{" "}
                            <TimePicker
                                defaultValue={moment(
                                    newPlace.endHour,
                                    "h:mm A"
                                )}
                                format="h:mm A"
                                onChange={(time) => {
                                    console.log(time.format("h:mm A"));
                                    setNewPlace({
                                        ...newPlace,
                                        endHour: time.format("h:mm A"),
                                    });
                                }}
                            />
                        </>
                    ) : (
                        `${place.startHour} - ${place.endHour}`
                    )}
                </Descriptions.Item>
            </Descriptions>

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
                                width: "100%",
                                height: "400px",
                                marginBottom: "16px",
                            }}
                        >
                            <MapContainer
                                center={[21.028511, 105.804817]} // Tọa độ mặc định (Hà Nội)
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
                                            newPlace.latitude,
                                            newPlace.longitude,
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
                                    ...place,
                                    latitude: place.latitude,
                                    longitude: place.longitude,
                                }); // Đặt lại newPlace về giá trị ban đầu
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
