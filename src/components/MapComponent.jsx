import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ selectedLocation, setSelectedLocation }) => {
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
                console.error("Không thể lấy thông tin địa chỉ từ bản đồ.");
            });
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };

    return (
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
            {selectedLocation.latitude && selectedLocation.longitude && (
                <Marker
                    position={[
                        selectedLocation.latitude,
                        selectedLocation.longitude,
                    ]}
                />
            )}
        </MapContainer>
    );
};

export default MapComponent;
