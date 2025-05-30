import Keycloak from "keycloak-js";

// Thay đổi các thông số này theo cấu hình Keycloak của bạn
const keycloakConfig = {
    url: "http://localhost:8000/", // URL của Keycloak server
    realm: "my-realm", // Realm bạn đã tạo trong Keycloak
    clientId: "public-admin", // Client ID bạn đã tạo trong Keycloak
};

// Khởi tạo instance Keycloak
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
