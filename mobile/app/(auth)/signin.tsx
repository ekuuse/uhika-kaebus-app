import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getAuthToken, setAuthToken } from "@/lib/session";
import {
    ActivityIndicator,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";

import Navbar from "@/components/Navbar";

const getApiBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    if (Platform.OS === "android") {
        return "http://10.0.2.2:7007";
    }

    return "http://localhost:7007";
};

export default function SignInScreen() {
    const [accountname, setAccountname] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const token = await getAuthToken();
            if (token) {
                router.replace("/");
            }
        };

        checkSession();
    }, []);

    const handleLogin = async () => {
        if (!accountname.trim() || !password.trim()) {
            setErrorMessage("Vale kasutajanimi või parool");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");

            console.log("Attempting login with:", { accountname, password });
            console.log("API Base URL:", getApiBaseUrl());

            const response = await fetch(`${getApiBaseUrl()}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accountname: accountname.trim(),
                    password,
                }),
            });

            const data = await response.json();

            console.log("Login response:", data);

            if (!response.ok || !data?.success) {
                await setAuthToken(null);
                setErrorMessage(data?.error || data?.message || "Vale kasutajanimi või parool");
                return;
            }

            await setAuthToken(data?.token || "session-active");
            router.replace("/");
        } catch (e) {
            console.error("Login error:", e);
            await setAuthToken(null);
            setErrorMessage("Serveriga ei saanud ühendust");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000000" }}>
            <Navbar showLogout={false}></Navbar>

            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: "#D9D9D9" }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: "center",
                        paddingHorizontal: 40,
                        paddingTop: 56,
                        paddingBottom: 28,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Poppins_700",
                            fontSize: 48 / 2,
                            textAlign: "center",
                            color: "#000000",
                        }}
                    >
                        Jätkamiseks{"\n"}logige sisse
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Poppins_400",
                            fontSize: 38 / 2,
                            textAlign: "center",
                            color: "#000000",
                            maxWidth: 329,
                            marginTop: 30,
                            lineHeight: 30,
                        }}
                    >
                        Logige sisse ühiselamu administraator poolt antud kasutajaga, või sisenege Siseveebi kaudu.
                    </Text>

                    <View style={{ width: "100%", marginTop: 50 }}>
                        <TextInput
                            value={accountname}
                            onChangeText={setAccountname}
                            placeholder="Kasutajanimi"
                            placeholderTextColor="rgba(0,0,0,0.5)"
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={{
                                height: 39,
                                borderRadius: 6,
                                borderWidth: 1,
                                borderColor: "rgba(0,0,0,0.07)",
                                backgroundColor: "#EEEEEE",
                                paddingHorizontal: 10,
                                fontFamily: "Poppins_400",
                                fontSize: 19,
                            }}
                        />

                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Parool"
                            placeholderTextColor="rgba(0,0,0,0.5)"
                            secureTextEntry
                            autoCapitalize="none"
                            style={{
                                height: 39,
                                borderRadius: 6,
                                borderWidth: 1,
                                borderColor: "rgba(0,0,0,0.07)",
                                backgroundColor: "#EEEEEE",
                                paddingHorizontal: 10,
                                fontFamily: "Poppins_400",
                                fontSize: 19,
                                marginTop: 19,
                            }}
                        />
                    </View>

                    <Text
                        style={{
                            fontFamily: "Poppins_400",
                            fontSize: 14,
                            color: errorMessage ? "#FF5959" : "transparent",
                            textAlign: "center",
                            marginTop: 50,
                            minHeight: 21,
                        }}
                    >
                        {errorMessage || " "}
                    </Text>

                    <Pressable
                        onPress={handleLogin}
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            height: 41,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: "rgba(0,0,0,0.07)",
                            backgroundColor: "#EEEEEE",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#111111" />
                        ) : (
                            <Text style={{ fontFamily: "Poppins_400", fontSize: 19, color: "#000000" }}>Logi sisse</Text>
                        )}
                    </Pressable>

                    <Pressable
                        style={{
                            width: "100%",
                            height: 41,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: "rgba(0,0,0,0.2)",
                            backgroundColor: "#000000",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 8,
                            flexDirection: "row",
                            gap: 16,
                        }}
                    >
                        <Image source={require("@/assets/icons/google-login.png")} style={{ width: 25, height: 25 }} resizeMode="contain" />
                        <Text style={{ fontFamily: "Poppins_400", fontSize: 19, color: "#F5F5F5" }}>Sisene Google’iga</Text>
                    </Pressable>

                    <Pressable
                        style={{
                            width: "100%",
                            height: 41,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: "rgba(0,0,0,0.2)",
                            backgroundColor: "#FFFFFF",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 8,
                            flexDirection: "row",
                            gap: 16,
                        }}
                    >
                        <Image
                            source={require("@/assets/branding/voco-login-black.png")}
                            style={{ width: 39, height: 32 }}
                            resizeMode="contain"
                        />
                        <Text style={{ fontFamily: "Poppins_400", fontSize: 19, color: "#000000" }}>Sisene Siseveebiga</Text>
                    </Pressable>

                    <Text
                        style={{
                            marginTop: 18,
                            textAlign: "center",
                            fontFamily: "Poppins_400",
                            fontSize: 13,
                            color: "rgba(0,0,0,0.25)",
                        }}
                    >
                        Teenuse kasutamisel nõustute meie{"\n"}
                        <Text style={{ textDecorationLine: "underline" }}>kasutustingimustega</Text>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}