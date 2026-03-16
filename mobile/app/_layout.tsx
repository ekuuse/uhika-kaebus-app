import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          Poppins_700: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
          Poppins_400: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, []);

  return (
    <Stack initialRouteName="(auth)">
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="report/[korrus]" options={{ headerShown: false }} />
    </Stack>
  );
}
