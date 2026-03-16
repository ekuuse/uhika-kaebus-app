import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "auth_token";

let authToken: string | null = null;

export const setAuthToken = async (token: string | null) => {
  authToken = token;

  if (!token) {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }

  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = async () => {
  if (authToken) {
    return authToken;
  }

  const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  authToken = storedToken;
  return storedToken;
};

export const clearAuthToken = async () => {
  authToken = null;
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
};
