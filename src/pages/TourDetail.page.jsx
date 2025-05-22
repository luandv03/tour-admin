import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Space,
    Steps,
    Typography,
    message,
    Spin,
    Rate,
    Flex,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import {
    fetchTourById,
    fetchCities,
    fetchTouristPlaces,
} from "../services/api";

const { Option } = Select;
const { Step } = Steps;
const { Title } = Typography;

const TourDetail = () => {
    const { tourId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [tourData, setTourData] = useState(null);
    const [newTourData, setNewTourData] = useState(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [departureOptions, setDepartureOptions] = useState([]);
    const [touristPlaces, setTouristPlaces] = useState([]);
    const [expandedDays, setExpandedDays] = useState({});

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [tourRes, citiesRes, placesRes] = await Promise.all([
                    fetchTourById(tourId),
                    fetchCities(),
                    fetchTouristPlaces(),
                ]);
                setDepartureOptions(citiesRes);
                setTouristPlaces(placesRes);

                // Process itinerary for day-based organization
                const itinerary = tourRes.tourPlaces.map((place) => ({
                    id: place.id,
                    value: place.touristPlace.id,
                    day: place.day,
                }));

                // Initialize expanded days
                const days = [...new Set(itinerary.map((item) => item.day))];
                const initialExpandedDays = {};
                days.forEach((day) => {
                    initialExpandedDays[day] = true;
                });
                setExpandedDays(initialExpandedDays);

                // Chuyển đổi dữ liệu từ API về đúng định dạng
                setTourData({
                    ...tourRes,
                    prices: tourRes.tourPassengers.map((p) => ({
                        type: p.passengerTypeName,
                        price: p.price,
                    })),
                    itinerary,
                    departurePoint: tourRes.departurePoint,
                    description: tourRes.description,
                });
                setNewTourData({
                    ...tourRes,
                    prices: tourRes.tourPassengers.map((p) => ({
                        type: p.passengerTypeName,
                        price: p.price,
                    })),
                    itinerary,
                    departurePoint: tourRes.departurePoint,
                    description: tourRes.description,
                });
                setDescription(tourRes.description);
            } catch (err) {
                message.error("Không thể tải dữ liệu tour!");
            }
            setLoading(false);
        };
        fetchAll();
    }, [tourId]);

    if (loading || !tourData || !newTourData) {
        return (
            <div style={{ padding: 48, textAlign: "center" }}>
                <Spin size="large" />
            </div>
        );
    }

    const toggleDayExpansion = (day) => {
        setExpandedDays((prev) => ({
            ...prev,
            [day]: prev[day] === false ? true : false,
        }));
    };

    const handleAddLocation = () => {
        const newId =
            (newTourData.itinerary.length > 0
                ? Math.max(...newTourData.itinerary.map((l) => l.id))
                : 0) + 1;

        // Find the max day number
        const maxDay = newTourData.itinerary.reduce(
            (max, loc) => Math.max(max, loc.day || 1),
            0
        );

        setNewTourData({
            ...newTourData,
            itinerary: [
                ...newTourData.itinerary,
                { id: newId, value: null, day: maxDay },
            ],
        });
    };

    const addNewDay = () => {
        // Find the max day number
        const maxDay = newTourData.itinerary.reduce(
            (max, loc) => Math.max(max, loc.day || 1),
            0
        );

        const newId =
            (newTourData.itinerary.length > 0
                ? Math.max(...newTourData.itinerary.map((l) => l.id))
                : 0) + 1;

        setNewTourData({
            ...newTourData,
            itinerary: [
                ...newTourData.itinerary,
                { id: newId, value: null, day: maxDay + 1 },
            ],
        });

        // Make sure the new day is expanded
        setExpandedDays((prev) => ({
            ...prev,
            [maxDay + 1]: true,
        }));
    };

    const handleAddLocationForDay = (day) => {
        const newId =
            (newTourData.itinerary.length > 0
                ? Math.max(...newTourData.itinerary.map((l) => l.id))
                : 0) + 1;

        setNewTourData({
            ...newTourData,
            itinerary: [
                ...newTourData.itinerary,
                { id: newId, value: null, day },
            ],
        });
    };

    const handleRemoveLocation = (id) => {
        setNewTourData({
            ...newTourData,
            itinerary: newTourData.itinerary.filter(
                (location) => location.id !== id
            ),
        });
    };

    const handleDeleteDay = (dayToDelete) => {
        // Remove all locations for this day
        setNewTourData({
            ...newTourData,
            itinerary: newTourData.itinerary.filter(
                (location) => location.day !== dayToDelete
            ),
        });

        // Remove from expanded days state
        const newExpandedDays = { ...expandedDays };
        delete newExpandedDays[dayToDelete];
        setExpandedDays(newExpandedDays);
    };

    const handleLocationChange = (id, value) => {
        setNewTourData({
            ...newTourData,
            itinerary: newTourData.itinerary.map((location) =>
                location.id === id ? { ...location, value } : location
            ),
        });
    };

    const handleDayChange = (id, day) => {
        setNewTourData({
            ...newTourData,
            itinerary: newTourData.itinerary.map((location) =>
                location.id === id
                    ? { ...location, day: parseInt(day, 10) }
                    : location
            ),
        });
    };

    const handleSave = () => {
        setTourData({
            ...newTourData,
            description,
        });
        setIsEditing(false);
        message.success("Thông tin tour đã được lưu!");
    };

    const handleCancel = () => {
        setNewTourData(tourData);
        setDescription(tourData.description);
        setIsEditing(false);
        message.info("Chỉnh sửa đã bị hủy.");
    };

    return (
        <div style={{ padding: "24px", position: "relative" }}>
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
                        defaultValue={newTourData.name}
                        onChange={(e) =>
                            setNewTourData({
                                ...newTourData,
                                name: e.target.value,
                            })
                        }
                        style={{ width: "300px" }}
                    />
                ) : (
                    tourData.name
                )}
            </Title>

            <div style={{ marginBottom: 16 }}>
                <span style={{ fontWeight: 500, marginRight: 8 }}>
                    Đánh giá:
                </span>
                <Rate
                    allowHalf
                    disabled
                    value={tourData.rating}
                    style={{ color: "#faad14" }}
                />
                <span style={{ marginLeft: 8 }}>{tourData.rating}</span>
            </div>

            <Form layout="vertical" style={{ maxWidth: "800px", margin: "0" }}>
                <Form.Item
                    label={
                        <span style={{ fontWeight: "bold" }}>Giá (VNĐ)</span>
                    }
                >
                    {isEditing
                        ? newTourData.prices.map((price, index) => (
                              <div
                                  key={index}
                                  style={{
                                      marginBottom: "8px",
                                      display: "flex",
                                      alignItems: "center",
                                  }}
                              >
                                  <Input
                                      addonBefore={
                                          <span
                                              style={{
                                                  display: "inline-block",
                                                  width: "200px",
                                                  textAlign: "left",
                                              }}
                                          >
                                              {price.type}
                                          </span>
                                      }
                                      defaultValue={price.price}
                                      type="number"
                                      onChange={(e) => {
                                          const updatedPrices = [
                                              ...newTourData.prices,
                                          ];
                                          updatedPrices[index].price = parseInt(
                                              e.target.value,
                                              10
                                          );
                                          setNewTourData({
                                              ...newTourData,
                                              prices: updatedPrices,
                                          });
                                      }}
                                  />
                              </div>
                          ))
                        : tourData.prices.map((price, index) => (
                              <div
                                  key={index}
                                  style={{
                                      marginBottom: "8px",
                                      display: "flex",
                                      alignItems: "center",
                                  }}
                              >
                                  <Input
                                      key={index}
                                      addonBefore={
                                          <span
                                              style={{
                                                  display: "inline-block",
                                                  width: "200px",
                                                  textAlign: "left",
                                              }}
                                          >
                                              {price.type}
                                          </span>
                                      }
                                      type="text"
                                      value={price.price.toLocaleString()}
                                      readOnly
                                  />
                              </div>
                          ))}
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontWeight: "bold" }}>Lộ trình</span>}
                >
                    {isEditing ? (
                        <div>
                            {(() => {
                                // Group locations by day
                                const days = [
                                    ...new Set(
                                        newTourData.itinerary.map(
                                            (item) => item.day || 1
                                        )
                                    ),
                                ].sort((a, b) => a - b);

                                return days.map((day) => {
                                    const dayItems =
                                        newTourData.itinerary.filter(
                                            (item) => (item.day || 1) === day
                                        );

                                    // Sort items by their ID to maintain addition order
                                    dayItems.sort((a, b) => a.id - b.id);

                                    // Use expandedDays state, default to true if not set
                                    const isExpanded =
                                        expandedDays[day] !== false;

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
                                                    justifyContent:
                                                        "space-between",
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
                                                            toggleDayExpansion(
                                                                day
                                                            )
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
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteDay(
                                                                day
                                                            );
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
                                                                    key={
                                                                        item.id
                                                                    }
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
                                                            alignItems:
                                                                "center",
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
                                                        <span>
                                                            Thêm địa điểm
                                                        </span>
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
                        </div>
                    ) : (
                        <div>
                            {(() => {
                                // Group locations by day for display mode
                                const days = [
                                    ...new Set(
                                        tourData.itinerary.map(
                                            (item) => item.day || 1
                                        )
                                    ),
                                ].sort((a, b) => a - b);

                                return days.map((day) => {
                                    const dayItems = tourData.itinerary.filter(
                                        (item) => (item.day || 1) === day
                                    );
                                    // Use expandedDays state, default to true if not set
                                    const isExpanded =
                                        expandedDays[day] !== false;

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
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    borderRadius: "4px",
                                                }}
                                                onClick={() =>
                                                    toggleDayExpansion(day)
                                                }
                                            >
                                                <strong>Ngày {day}</strong>
                                                <span
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {isExpanded ? "▼" : "►"}
                                                </span>
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
                                                            const place =
                                                                touristPlaces.find(
                                                                    (p) =>
                                                                        p.id ===
                                                                        item.value
                                                                );

                                                            return (
                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
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

                                                                    <span>
                                                                        {place?.placeName ||
                                                                            "Không xác định"}
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    )}
                </Form.Item>

                <Form.Item
                    label={
                        <span style={{ fontWeight: "bold" }}>
                            Điểm khởi hành
                        </span>
                    }
                >
                    {isEditing ? (
                        <Select
                            placeholder="Chọn điểm khởi hành"
                            style={{ width: "300px" }}
                            value={newTourData.departurePoint.id}
                            onChange={(id) => {
                                const selectedDeparture = departureOptions.find(
                                    (option) => option.id === id
                                );
                                setNewTourData({
                                    ...newTourData,
                                    departurePoint: selectedDeparture,
                                });
                            }}
                        >
                            {departureOptions.map((loc) => (
                                <Option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        tourData.departurePoint.name
                    )}
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontWeight: "bold" }}>Mô tả</span>}
                >
                    {isEditing ? (
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
                        />
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: tourData.description,
                            }}
                        />
                    )}
                </Form.Item>

                {isEditing && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "8px",
                        }}
                    >
                        <Button onClick={handleCancel}>Hủy</Button>
                        <Button type="primary" onClick={handleSave}>
                            Lưu
                        </Button>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default TourDetail;
