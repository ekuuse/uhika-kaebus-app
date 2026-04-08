import { Platform } from "react-native";
import Constants from "expo-constants";

const getConfiguredApiUrl = () => {
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!raw) {
    return null;
  }

  const normalized = raw.replace(/^['\"]|['\"]$/g, "");
  const isLocalhost = /localhost|127\.0\.0\.1/.test(normalized);
  const isNative = Platform.OS === "ios" || Platform.OS === "android";

  if (isNative && isLocalhost) {
    return null;
  }

  return normalized;
};

const getExpoHost = () => {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(":")[0];
};

export const getApiBaseUrl = () => {
  const configuredApiUrl = getConfiguredApiUrl();
  if (configuredApiUrl) {
    return configuredApiUrl;
  }

  const expoHost = getExpoHost();
  if (expoHost) {
    return `http://${expoHost}:7007`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:7007";
  }

  return "http://localhost:7007";
};
