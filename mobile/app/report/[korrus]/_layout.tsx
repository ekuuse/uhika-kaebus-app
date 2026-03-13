import { Stack } from "expo-router";
import { View } from "react-native";
import Navbar from "@/components/Navbar";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Navbar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#ffffff",
            paddingHorizontal: 36,
            paddingTop: 24,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="[tuba]/index" />
      </Stack>
    </View>
  );
}
