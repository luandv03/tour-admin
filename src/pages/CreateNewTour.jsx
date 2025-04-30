import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Space, Steps, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill-new";

const { Option } = Select;
const { Step } = Steps;

const departureOptions = [
    {
        id: 1,
        name: "Hà Nội",
    },
    {
        id: 2,
        name: "Đà Nẵng",
    },
    {
        id: 3,
        name: "TP Hồ Chí Minh",
    },
    {
        id: 4,
        name: "Nha Trang",
    },
    {
        id: 5,
        name: "Hà Nam",
    },
];

const CreateNewTour = () => {
    const [description, setDescription] = useState("");
    const [locations, setLocations] = useState([{ id: 1, value: null }]); // Danh sách địa điểm trong tour
    const [locationId, setLocationId] = useState(2); // ID tiếp theo cho địa điểm
    const [departure, setDeparture] = useState({
        id: 1,
        name: "Hà Nội",
    }); // Trạng thái cho điểm khởi hành
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    const availableLocations = [
        { id: 1, name: "Vịnh Hạ Long" },
        { id: 2, name: "Chùa Một Cột" },
        { id: 3, name: "Núi Fansipan" },
        { id: 4, name: "Đà Lạt" },
        { id: 5, name: "Lăng Bác" },
        { id: 6, name: "Văn Miếu Quốc Tử Giám" },
        { id: 7, name: "Nhà Tù Hỏa Lò" },
        { id: 8, name: "Sun*" },
    ]; // Danh sách địa điểm có sẵn

    const handleAddLocation = () => {
        setLocations([...locations, { id: locationId, value: null }]);
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

    const handleSubmit = (values) => {
        const selectedLocations = locations
            .filter((location) => location.value)
            .map((location) => location.value);

        if (selectedLocations.length === 0) {
            message.error("Vui lòng chọn ít nhất một địa điểm.");
            return;
        }

        const newTour = {
            ...values,
            locations: selectedLocations,
        };

        console.log("Tour mới:", newTour);
        message.success("Tour mới đã được tạo thành công!");
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

    return (
        <div style={{ padding: "24px" }}>
            <h1>Tạo tour mới</h1>
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxWidth: "800px", margin: "0" }}
            >
                <Form.Item
                    name="name"
                    label={<span style={{ fontWeight: "bold" }}>Tên tour</span>} // Label đậm hơn
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
                >
                    <Form.Item
                        name="adultPrice"
                        label="Người lớn (Từ 12 tuổi trở lên)"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá cho người lớn",
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Nhập giá cho người lớn"
                        />
                    </Form.Item>
                    <Form.Item
                        name="childPrice"
                        label="Trẻ em (Từ 5 đến 11 tuổi)"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá cho trẻ em",
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Nhập giá cho trẻ em"
                        />
                    </Form.Item>
                    <Form.Item
                        name="toddlerPrice"
                        label="Trẻ nhỏ (Từ 2 đến 4 tuổi)"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá cho trẻ nhỏ",
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Nhập giá cho trẻ nhỏ"
                        />
                    </Form.Item>
                    <Form.Item
                        name="infantPrice"
                        label="Em bé (Dưới 2 tuổi)"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá cho em bé",
                            },
                        ]}
                    >
                        <Input type="number" placeholder="Nhập giá cho em bé" />
                    </Form.Item>
                </Form.Item>
                <Form.Item
                    label={<span style={{ fontWeight: "bold" }}>Lộ trình</span>}
                >
                    <Steps direction="vertical" current={-1}>
                        {locations.map((location) => (
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
                                        <Select
                                            placeholder="Chọn địa điểm"
                                            style={{ width: "300px" }}
                                            value={location.value}
                                            showSearch // Cho phép tìm kiếm
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase()
                                                    )
                                            } // Lọc danh sách dựa trên từ khóa tìm kiếm
                                            onChange={(value) =>
                                                handleLocationChange(
                                                    location.id,
                                                    value
                                                )
                                            }
                                        >
                                            {availableLocations
                                                .filter(
                                                    (loc) =>
                                                        !locations.some(
                                                            (selected) =>
                                                                selected.value ===
                                                                loc.name
                                                        ) ||
                                                        loc.name ===
                                                            location.value
                                                ) // Chỉ hiển thị các địa điểm chưa được chọn hoặc địa điểm hiện tại
                                                .map((loc) => (
                                                    <Option
                                                        key={loc.id}
                                                        value={loc.name}
                                                    >
                                                        {loc.name}
                                                    </Option>
                                                ))}
                                        </Select>
                                        <Input
                                            type="number"
                                            placeholder="Ngày thứ mấy"
                                            style={{ width: "100px" }}
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
                                            ></Button>
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

                {/* Chọn điểm khởi hành */}
                <Form.Item
                    label={
                        <span style={{ fontWeight: "bold" }}>
                            Điểm khởi hành
                        </span>
                    }
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn điểm khởi hành",
                        },
                    ]}
                >
                    <Select
                        placeholder="Chọn điểm khởi hành"
                        style={{ width: "300px" }}
                        value={departure?.id} // Hiển thị giá trị `id` của điểm khởi hành
                        showSearch // Cho phép tìm kiếm
                        filterOption={(input, option) =>
                            option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        } // Lọc danh sách dựa trên từ khóa tìm kiếm
                        onChange={(id) => {
                            const selectedDeparture = departureOptions.find(
                                (option) => option.id === id
                            );
                            console.log(
                                "Selected departure:",
                                selectedDeparture
                            );
                            setDeparture(selectedDeparture); // Lưu cả `id` và `name` vào `departure`
                        }}
                    >
                        {departureOptions.map((loc) => (
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
                        <Button type="primary" htmlType="submit">
                            Tạo tour
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateNewTour;
