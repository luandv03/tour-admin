import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Space, Steps, Flex, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { notification } from "antd"; // Thêm dòng này ở đầu file
import {
    fetchTouristPlaces,
    fetchCities,
    fetchPassengerTypes,
    createTour,
} from "../services/api";

const { Option } = Select;
const { Step } = Steps;

const CreateNewTour = () => {
    const [description, setDescription] = useState("");
    const [locations, setLocations] = useState([
        { id: 1, value: null, day: 1 },
    ]);
    const [locationId, setLocationId] = useState(2);
    const [departure, setDeparture] = useState(null);
    const [touristPlaces, setTouristPlaces] = useState([]);
    const [cities, setCities] = useState([]);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [placesRes, citiesRes, passengerTypesRes] =
                    await Promise.all([
                        fetchTouristPlaces(),
                        fetchCities(),
                        fetchPassengerTypes(),
                    ]);

                console.log(passengerTypesRes);

                setTouristPlaces(placesRes);
                setCities(citiesRes);
                setDeparture(citiesRes[0]);
                setPrices(
                    passengerTypesRes.map((type) => ({
                        passengerTypeId: type.passengerTypeId,
                        passengerTypeName: type.passengerTypeName,
                        price: "",
                    }))
                );
            } catch (err) {
                message.error("Không thể tải dữ liệu khởi tạo!");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleAddLocation = () => {
        setLocations([...locations, { id: locationId, value: null, day: 1 }]);
        setLocationId(locationId + 1);
    };

    const handleRemoveLocation = (id) => {
        setLocations(locations.filter((location) => location.id !== id));
    };

    const handleLocationChange = (id, value) => {
        setLocations(
            locations.map((location) =>
                location.id === id ? { ...location, value } : location
            )
        );
    };

    const handleDayChange = (id, day) => {
        setLocations(
            locations.map((location) =>
                location.id === id
                    ? { ...location, day: parseInt(day, 10) }
                    : location
            )
        );
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;

        setPrices((prev) => {
            prev.forEach((p) => {
                if (p.passengerTypeId == name) {
                    p.price = value;
                }
            });
            return [...prev];
        });
    };

    const handleSubmit = async (values) => {
        // Chuẩn hóa tourPlaces
        const tourPlaces = locations
            .filter((location) => location.value)
            .map((location, idx) => ({
                touristPlaceId: location.value,
                day: location.day || 1,
                orderInDay: idx + 1,
            }));

        console.log(prices);

        // Chuẩn hóa passengerPrices
        const passengerPrices = prices
            .filter((p) => p.price !== "")
            .map((p) => ({
                passengerTypeId: p.passengerTypeId,
                price: Number(p.price),
            }));

        console.log(passengerPrices);

        if (
            !values.name ||
            !departure ||
            tourPlaces.length === 0 ||
            passengerPrices.length === 0
        ) {
            message.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
            return;
        }

        const body = {
            name: values.name,
            description: description,
            isCustom: false,
            tax: 10,
            discount: 5,
            prevPercent: 20,
            userId: 1,
            departurePointId: departure.id,
            tourPlaces,
            passengerPrices,
        };

        setLoading(true);
        try {
            const res = await createTour(body);
            message.success({
                message: "Tạo tour thành công",
                description: `Tour "${res.name}" đã được tạo!`,
                duration: 2,
            });
            navigate(`/tours/${res.id}`);
        } catch (error) {
            message.error("Tạo tour thất bại!");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>Tạo tour mới</h1>
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                style={{ margin: "0" }}
            >
                <Form.Item
                    name="name"
                    label={<span style={{ fontWeight: "bold" }}>Tên tour</span>}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên tour",
                        },
                    ]}
                >
                    <Input placeholder="Nhập tên tour" />
                </Form.Item>

                <Form.Item
                    label={
                        <span style={{ fontWeight: "bold" }}>Giá (VNĐ)</span>
                    }
                    required
                >
                    {prices.map((type, idx) => (
                        <Form.Item
                            key={type.passengerTypeId}
                            name={type.passengerTypeId}
                            label={type.passengerTypeName}
                            rules={[
                                {
                                    required: true,
                                    message: `Vui lòng nhập giá cho ${type.passengerTypeName}`,
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                placeholder={`Giá cho ${type.passengerTypeName}`}
                                name={type.passengerTypeId}
                                value={type.price}
                                onChange={(e) => handlePriceChange(e)}
                                style={{ width: 300 }}
                                min={0}
                                required
                            />
                        </Form.Item>
                    ))}
                </Form.Item>

                <Flex
                    justify="space-between"
                    gap="16px"
                    style={{ width: "100%" }}
                >
                    <Form.Item
                        label={
                            <span style={{ fontWeight: "bold" }}>Lộ trình</span>
                        }
                        style={{ flex: 1 }}
                        required
                    >
                        <Steps direction="vertical" current={-1}>
                            {locations.map((location, idx) => (
                                <Step
                                    key={location.id}
                                    title={`Địa điểm ${idx + 1}`}
                                    status="process"
                                    description={
                                        <Space
                                            style={{
                                                display: "flex",
                                                marginBottom: 8,
                                            }}
                                            align="baseline"
                                        >
                                            <Select
                                                placeholder="Chọn địa điểm"
                                                style={{ width: "240px" }}
                                                value={location.value}
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .includes(
                                                            input.toLowerCase()
                                                        )
                                                }
                                                onChange={(value) =>
                                                    handleLocationChange(
                                                        location.id,
                                                        value
                                                    )
                                                }
                                            >
                                                {touristPlaces.map((loc) => (
                                                    <Option
                                                        key={loc.id}
                                                        value={loc.id}
                                                    >
                                                        {loc.placeName}
                                                    </Option>
                                                ))}
                                            </Select>
                                            <Input
                                                type="number"
                                                placeholder="Ngày thứ mấy"
                                                style={{ width: "100px" }}
                                                value={location.day}
                                                onChange={(e) =>
                                                    handleDayChange(
                                                        location.id,
                                                        e.target.value
                                                    )
                                                }
                                                min={1}
                                                max={100}
                                            />
                                            {locations.length > 1 && (
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    danger
                                                    onClick={() =>
                                                        handleRemoveLocation(
                                                            location.id
                                                        )
                                                    }
                                                />
                                            )}
                                        </Space>
                                    }
                                />
                            ))}
                        </Steps>
                        <Button
                            type="dashed"
                            onClick={handleAddLocation}
                            style={{ marginTop: "16px" }}
                        >
                            + Thêm địa điểm
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ flex: 1 }}>
                        <div
                            style={{
                                height: "400px",
                                marginBottom: "16px",
                            }}
                        >
                            <MapContainer
                                center={[21.028511, 105.804817]}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {locations.map((location) => {
                                    const place = touristPlaces.find(
                                        (p) => p.id === location.value
                                    );
                                    return (
                                        place && (
                                            <Marker
                                                key={location.id}
                                                position={[
                                                    Number(place.latitude),
                                                    Number(place.longitude),
                                                ]}
                                            />
                                        )
                                    );
                                })}
                            </MapContainer>
                        </div>
                    </Form.Item>
                </Flex>

                <Form.Item
                    label={
                        <span style={{ fontWeight: "bold" }}>
                            Điểm khởi hành
                        </span>
                    }
                    required
                >
                    <Select
                        placeholder="Chọn điểm khởi hành"
                        style={{ width: "300px" }}
                        value={departure?.id}
                        showSearch
                        filterOption={(input, option) =>
                            option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        onChange={(id) => {
                            const selectedDeparture = cities.find(
                                (option) => option.id === id
                            );
                            setDeparture(selectedDeparture);
                        }}
                    >
                        {cities.map((loc) => (
                            <Option key={loc.id} value={loc.id}>
                                {loc.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<span style={{ fontWeight: "bold" }}>Mô tả</span>}
                >
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

                <Form.Item>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "8px",
                        }}
                    >
                        <Button htmlType="reset" onClick={() => navigate(-1)}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Tạo tour
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateNewTour;
