import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <Stack initialRouteName="signin">
      <Stack.Screen name="signin" options={{ headerShown: false }} />
    </Stack>
  );
}
