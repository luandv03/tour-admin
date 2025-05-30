import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Space, Steps, Flex, message } from "antd";
import {
    DeleteOutlined,
    PlusOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
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
    const [expandedDays, setExpandedDays] = useState({});
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

    const toggleDayExpansion = (day) => {
        setExpandedDays((prev) => ({
            ...prev,
            [day]: prev[day] === false ? true : false,
        }));
    };

    const addNewDay = () => {
        // Find the max day number
        const maxDay = locations.reduce(
            (max, loc) => Math.max(max, loc.day || 1),
            0
        );

        // Add a new location for the new day
        setLocations([
            ...locations,
            { id: locationId, value: null, day: maxDay + 1 },
        ]);
        setLocationId(locationId + 1);

        // Make sure the new day is expanded
        setExpandedDays((prev) => ({
            ...prev,
            [maxDay + 1]: true,
        }));
    };

    const handleDeleteDay = (dayToDelete) => {
        // Remove all locations for this day
        setLocations(
            locations.filter((location) => location.day !== dayToDelete)
        );

        // Remove from expanded days state
        const newExpandedDays = { ...expandedDays };
        delete newExpandedDays[dayToDelete];
        setExpandedDays(newExpandedDays);
    };

    const handleAddLocationForDay = (day) => {
        // Find the max order in the current day
        const dayLocations = locations.filter(
            (location) => location.day === day
        );

        setLocations([...locations, { id: locationId, value: null, day: day }]);
        setLocationId(locationId + 1);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;

        console.log(name, value);

        console.log(prices);

        // The issue is here - we're not properly updating the state
        // We're mutating objects in the state and then returning the same array reference
        // React doesn't recognize this as a state change

        setPrices((prev) =>
            prev.map((p) =>
                p.passengerTypeId == name ? { ...p, price: value } : p
            )
        );
    };

    const handleSubmit = async (values) => {
        // Chuẩn hóa tourPlaces - fix the ordering logic
        const tourPlaces = [];

        // Group locations by day
        const locationsByDay = {};
        locations
            .filter((loc) => loc.value)
            .forEach((loc) => {
                const day = loc.day || 1;
                if (!locationsByDay[day]) {
                    locationsByDay[day] = [];
                }
                locationsByDay[day].push(loc);
            });

        // Create ordered tourPlaces array
        Object.keys(locationsByDay).forEach((day) => {
            locationsByDay[day].forEach((location, index) => {
                tourPlaces.push({
                    touristPlaceId: location.value,
                    day: parseInt(day, 10),
                    orderInDay: index + 1,
                });
            });
        });

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

        console.log(body);

        setLoading(true);
        try {
            const res = await createTour(body);
            message.success({
                content: "Tour đã được tạo thành công!",
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
                    style={{ width: "300px" }}
                >
                    <Input placeholder="Nhập tên tour" />
                </Form.Item>

                <Form.Item
                    label={
                        <span style={{ fontWeight: "bold" }}>Giá (VNĐ)</span>
                    }
                    required
                >
                    {prices.map((type) => (
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
                        {(() => {
                            // Group locations by day
                            const days = [
                                ...new Set(
                                    locations.map((item) => item.day || 1)
                                ),
                            ].sort((a, b) => a - b);

                            return days.map((day) => {
                                const dayItems = locations.filter(
                                    (item) => (item.day || 1) === day
                                );
                                // Sort items by their ID to maintain addition order
                                dayItems.sort((a, b) => a.id - b.id);

                                // Use expandedDays state, default to true if not set
                                const isExpanded = expandedDays[day] !== false;

                                return (
                                    <div
                                        key={`day-${day}`}
                                        style={{ marginBottom: "15px" }}
                                    >
                                        <div
                                            style={{
                                                cursor: "pointer",
                                                background: "#f6f6f6",
                                                boxShadow:
                                                    "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                                color: "#004085",
                                                marginBottom: "8px",
                                                padding: "10px 15px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            <div
                                                onClick={() =>
                                                    toggleDayExpansion(day)
                                                }
                                            >
                                                <strong>Ngày {day}</strong>
                                            </div>
                                            <div>
                                                <span
                                                    onClick={() =>
                                                        toggleDayExpansion(day)
                                                    }
                                                    style={{
                                                        marginRight: "10px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {isExpanded ? "▼" : "►"}
                                                </span>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteDay(day);
                                                    }}
                                                    title="Xóa ngày"
                                                />
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div
                                                style={{
                                                    background: "#f6f6f6",
                                                    padding: "15px",
                                                    borderRadius: "5px",
                                                    marginBottom: "15px",
                                                    border: "1px solid #d1e6ff",
                                                    marginLeft: "15px",
                                                }}
                                            >
                                                {dayItems.map(
                                                    (item, itemIndex) => {
                                                        return (
                                                            <div
                                                                key={item.id}
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    marginBottom:
                                                                        "10px",
                                                                    position:
                                                                        "relative",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: "24px",
                                                                        height: "24px",
                                                                        borderRadius:
                                                                            "50%",
                                                                        backgroundColor:
                                                                            "#0d6efd",
                                                                        color: "white",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
                                                                        marginRight:
                                                                            "10px",
                                                                        zIndex: 2,
                                                                    }}
                                                                >
                                                                    {itemIndex +
                                                                        1}
                                                                </div>

                                                                {/* Connect line to next item */}
                                                                {itemIndex !==
                                                                    dayItems.length -
                                                                        1 && (
                                                                    <div
                                                                        style={{
                                                                            position:
                                                                                "absolute",
                                                                            left: "12px",
                                                                            top: "24px",
                                                                            height: "30px",
                                                                            width: "2px",
                                                                            backgroundColor:
                                                                                "#0d6efd",
                                                                            zIndex: 1,
                                                                        }}
                                                                    />
                                                                )}

                                                                <Select
                                                                    placeholder="--- Chọn địa điểm ---"
                                                                    style={{
                                                                        width: "240px",
                                                                        marginRight:
                                                                            "10px",
                                                                    }}
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    showSearch
                                                                    filterOption={(
                                                                        input,
                                                                        option
                                                                    ) =>
                                                                        option.children
                                                                            .toLowerCase()
                                                                            .includes(
                                                                                input.toLowerCase()
                                                                            )
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) =>
                                                                        handleLocationChange(
                                                                            item.id,
                                                                            value
                                                                        )
                                                                    }
                                                                >
                                                                    <Option value="">
                                                                        --- Chọn
                                                                        địa điểm
                                                                        ---
                                                                    </Option>
                                                                    {touristPlaces.map(
                                                                        (
                                                                            loc
                                                                        ) => (
                                                                            <Option
                                                                                key={
                                                                                    loc.id
                                                                                }
                                                                                value={
                                                                                    loc.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    loc.placeName
                                                                                }
                                                                            </Option>
                                                                        )
                                                                    )}
                                                                </Select>

                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    icon={
                                                                        <DeleteOutlined />
                                                                    }
                                                                    onClick={() =>
                                                                        handleRemoveLocation(
                                                                            item.id
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                )}

                                                <div
                                                    onClick={() =>
                                                        handleAddLocationForDay(
                                                            day
                                                        )
                                                    }
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        color: "#004085",
                                                        cursor: "pointer",
                                                        marginLeft: "20px",
                                                        marginTop: "15px",
                                                    }}
                                                >
                                                    <PlusCircleOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    <span>Thêm địa điểm</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            });
                        })()}

                        <Button
                            type="primary"
                            ghost
                            onClick={addNewDay}
                            icon={<PlusOutlined />}
                            style={{ marginTop: "10px" }}
                        >
                            Thêm ngày mới
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ flex: 1 }}>
                        <h6
                            style={{ fontWeight: "bold", marginBottom: "16px" }}
                        >
                            Bản đồ
                        </h6>
                        <div
                            style={{
                                height: "400px",
                                marginBottom: "16px",
                                border: "1px solid #d9d9d9",
                                borderRadius: "4px",
                                overflow: "hidden",
                            }}
                        >
                            <MapContainer
                                center={[21.028511, 105.804817]}
                                zoom={6}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {locations
                                    .filter((item) => item.value)
                                    .map((location) => {
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
