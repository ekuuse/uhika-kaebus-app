import { Stack } from "expo-router";
import { View } from "react-native";
import Navbar from "@/components/Navbar";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Navbar showLogout={false} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
