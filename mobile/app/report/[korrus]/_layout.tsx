import { Stack } from "expo-router";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import * as Font from "expo-font";

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
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
