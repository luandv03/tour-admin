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
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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

                // Chuyển đổi dữ liệu từ API về đúng định dạng
                setTourData({
                    ...tourRes,
                    prices: tourRes.tourPassengers.map((p) => ({
                        type: p.passengerTypeName,
                        price: p.price,
                    })),
                    itinerary: tourRes.tourPlaces.map((place) => ({
                        id: place.id,
                        value: place.touristPlace.id,
                        day: place.day,
                    })),
                    departurePoint: tourRes.departurePoint,
                    description: tourRes.description,
                });
                setNewTourData({
                    ...tourRes,
                    prices: tourRes.tourPassengers.map((p) => ({
                        type: p.passengerTypeName,
                        price: p.price,
                    })),
                    itinerary: tourRes.tourPlaces.map((place) => ({
                        id: place.id,
                        value: place.touristPlace.id,
                        day: place.day,
                    })),
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

    const handleAddLocation = () => {
        const newId =
            (newTourData.itinerary.length > 0
                ? Math.max(...newTourData.itinerary.map((l) => l.id))
                : 0) + 1;
        setNewTourData({
            ...newTourData,
            itinerary: [
                ...newTourData.itinerary,
                { id: newId, value: null, day: null },
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
                                      type="number"
                                      value={price.price}
                                      readOnly
                                  />
                              </div>
                          ))}
                </Form.Item>

                <Form.Item
                    label={<span style={{ fontWeight: "bold" }}>Lộ trình</span>}
                >
                    <Steps direction="vertical" current={-1}>
                        {newTourData.itinerary.map((location) => (
                            <Step
                                key={location.id}
                                title={`Địa điểm ${location.id}`}
                                status="process"
                                description={
                                    <Space
                                        style={{
                                            display: "flex",
                                            marginBottom: 8,
                                        }}
                                        align="baseline"
                                    >
                                        {isEditing ? (
                                            <>
                                                <Select
                                                    placeholder="Chọn địa điểm"
                                                    style={{ width: "220px" }}
                                                    value={location.value}
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
                                                    onChange={(value) =>
                                                        handleLocationChange(
                                                            location.id,
                                                            value
                                                        )
                                                    }
                                                >
                                                    {touristPlaces.map(
                                                        (place) => (
                                                            <Option
                                                                key={place.id}
                                                                value={place.id}
                                                            >
                                                                {
                                                                    place.placeName
                                                                }
                                                            </Option>
                                                        )
                                                    )}
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
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    danger
                                                    onClick={() =>
                                                        handleRemoveLocation(
                                                            location.id
                                                        )
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <span>
                                                    {touristPlaces.find(
                                                        (p) =>
                                                            p.id ===
                                                            location.value
                                                    )?.placeName ||
                                                        location.value}
                                                </span>
                                                <span>
                                                    Ngày: {location.day}
                                                </span>
                                            </>
                                        )}
                                    </Space>
                                }
                            />
                        ))}
                    </Steps>
                    {isEditing && (
                        <Button
                            type="dashed"
                            onClick={handleAddLocation}
                            style={{ marginTop: "16px" }}
                        >
                            + Thêm địa điểm
                        </Button>
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
