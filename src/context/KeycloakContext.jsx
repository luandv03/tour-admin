import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useRef,
} from "react";
import keycloak from "../config/keycloak";

// Tạo context cho Keycloak
export const KeycloakContext = createContext(null);

export const KeycloakProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [keycloakInstance, setKeycloakInstance] = useState(null);
    const [token, setToken] = useState(null);

    // Sử dụng useRef để lưu interval ID để có thể clear khi component unmount
    const tokenRefreshInterval = useRef(null);

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                const authenticated = await keycloak.init({
                    onLoad: "check-sso",
                    silentCheckSsoRedirectUri:
                        window.location.origin + "/silent-check-sso.html",
                    pkceMethod: "S256",
                });

                console.log("Keycloak initialized:", authenticated);
                setIsAuthenticated(authenticated);
                setKeycloakInstance(keycloak);

                if (authenticated) {
                    // Lưu token
                    setToken(keycloak.token);

                    console.log("Token received:", keycloak.token);

                    // Lấy thông tin người dùng nếu đã xác thực
                    keycloak.loadUserInfo().then((userInfo) => {
                        setUserInfo(userInfo);
                    });

                    // Set up token refresh mỗi phút
                    tokenRefreshInterval.current = setInterval(() => {
                        keycloak
                            .updateToken(60)
                            .then((refreshed) => {
                                if (refreshed) {
                                    console.log("Token refreshed");
                                    setToken(keycloak.token);
                                }
                            })
                            .catch(() => {
                                console.error("Failed to refresh token");
                            });
                    }, 60000);

                    // Event listener khi token hết hạn
                    keycloak.onTokenExpired = () => {
                        console.log("Token expired");
                        keycloak
                            .updateToken(60)
                            .then((refreshed) => {
                                if (refreshed) {
                                    console.log("Token refreshed after expiry");
                                    setToken(keycloak.token);
                                }
                            })
                            .catch((error) => {
                                console.error(
                                    "Failed to refresh token after expiry",
                                    error
                                );
                                logout();
                            });
                    };
                }
            } catch (error) {
                console.error("Keycloak init error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        initKeycloak();

        return () => {
            // Clean up token refresh interval
            if (tokenRefreshInterval.current) {
                clearInterval(tokenRefreshInterval.current);
            }
        };
    }, []);

    const login = () => {
        keycloak.login();
    };

    const logout = () => {
        if (tokenRefreshInterval.current) {
            clearInterval(tokenRefreshInterval.current);
        }
        setToken(null);
        keycloak.logout({ redirectUri: window.location.origin });
    };

    const getToken = () => {
        return token;
    };

    const hasRole = (roles) => {
        if (!keycloakInstance || !roles || roles.length === 0) {
            return false;
        }

        if (Array.isArray(roles)) {
            return roles.some((role) => keycloakInstance.hasRealmRole(role));
        }

        return keycloakInstance.hasRealmRole(roles);
    };
    return (
        <KeycloakContext.Provider
            value={{
                isAuthenticated,
                keycloakInstance,
                userInfo,
                isLoading,
                token,
                login,
                logout,
                hasRole,
                getToken,
            }}
        >
            {children}
        </KeycloakContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useKeycloak = () => {
    const context = useContext(KeycloakContext);
    if (!context) {
        throw new Error("useKeycloak must be used within a KeycloakProvider");
    }
    return context;
};
