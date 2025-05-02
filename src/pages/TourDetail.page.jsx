import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Space,
    Steps,
    Typography,
    message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const { Option } = Select;
const { Step } = Steps;

const departureOptions = [
    { id: 1, name: "Hà Nội" },
    { id: 2, name: "Đà Nẵng" },
    { id: 3, name: "TP Hồ Chí Minh" },
    { id: 4, name: "Nha Trang" },
    { id: 5, name: "Hà Nam" },
];

const { Title } = Typography;

const TourDetail = ({ tour }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tourData, setTourData] = useState(
        tour || {
            id: "T001",
            name: "Tour Hà Nội - Hạ Long",
            prices: [
                { type: "Người lớn (Từ 12 tuổi trở lên)", price: 2000000 },
                { type: "Trẻ em (Từ 5 đến 11 tuổi)", price: 1000000 },
                { type: "Trẻ nhỏ (Từ 2 đến 4 tuổi)", price: 500000 },
                { type: "Em bé (Dưới 2 tuổi)", price: 0 },
            ],
            itinerary: [
                { id: 1, value: "Vịnh Hạ Long", day: 1 },
                { id: 2, value: "Chùa Một Cột", day: 2 },
            ],
            departurePoint: { id: 1, name: "Hà Nội" },
            description: "Tour khám phá Vịnh Hạ Long với các hoạt động thú vị.",
        }
    );
    const [newTourData, setNewTourData] = useState(tourData);
    const [description, setDescription] = useState(tourData.description);

    const handleAddLocation = () => {
        const newId = tourData.itinerary.length + 1;
        setTourData({
            ...tourData,
            itinerary: [
                ...tourData.itinerary,
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
        setTourData(newTourData);
        setIsEditing(false);
        message.success("Thông tin tour đã được lưu!");
    };

    const handleCancel = () => {
        setNewTourData(tourData);
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
                                      // defaultValue={price.price}
                                      value={price.price}
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
                                                    style={{ width: "300px" }}
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
                                                    {departureOptions.map(
                                                        (loc) => (
                                                            <Option
                                                                key={loc.id}
                                                                value={loc.name}
                                                            >
                                                                {loc.name}
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
                                                <span>{location.value}</span>
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
