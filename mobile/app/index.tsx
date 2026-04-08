import Events from "@/components/Events";
import EventsCalender from "@/components/EventsCalender";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getAuthToken } from "@/lib/session";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View, Image, ScrollView, Platform } from "react-native";

const floors = [
  { id: "5", color: "#50C800", hasInfo: false },
  { id: "4", color: "#1F42DC", hasInfo: false },
  { id: "3", color: "#D20101", hasInfo: true },
  { id: "2", color: "#FFD723", hasInfo: true },
];

const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:7007";
  }

  return "http://localhost:7007";
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Tere hommikust";
  } else if (hour < 18) {
    return "Tere päevast";
  } else {
    return "Tere õhtust";
  }
};

const formatUserName = (username: string | undefined) => {
  if (typeof username !== 'string' || !username) return "";
  const firstName = username.split('.')[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1);
};

export default function Index() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userName, setUserName] = useState("a");

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAuthToken();

      if (!token) {
        setIsAuthorized(false);
        setIsAuthChecked(true);
        router.replace("/(auth)/signin");
        return;
      }

      console.log(`${getApiBaseUrl()}/api/user/session`)
      fetch(`${getApiBaseUrl()}/api/user/session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()).then((data) => {
        console.log(data)
        if (data.success) {
          setUserName(formatUserName(data.user.username));
          console.log(userName)
        } else {
          setIsAuthorized(false);
          router.replace("/(auth)/signin");
        }
      }).catch((error) => {
        console.error("Failed to fetch user session:", error);
        setIsAuthorized(false);
        router.replace("/(auth)/signin");
      })

      setIsAuthorized(true);
      setIsAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!isAuthChecked || !isAuthorized) {
    return <View style={{ flex: 1, backgroundColor: "#ffffff" }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Navbar showLogout={true} />
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ fontFamily: "Poppins_700", fontSize: 24, paddingTop: 16 }}>{getGreeting()}, {userName}</Text>
          <View style={{ flexDirection: "row", gap: 8, paddingTop: 8 }}>
            <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>Teie tuba:</Text><Text style={{ fontFamily: "Poppins_700", fontSize: 19 }}>312B</Text>
          </View>
          <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>Teie toal on 3 kaebust viimase kuu jooksul.</Text>

          <Text style={{ fontFamily: "Poppins_700", fontSize: 24, paddingTop: 48 }}>Valige korrus</Text>

          <View style={{ gap: 16, paddingTop: 16 }}>
            {floors.map((floor) => (
              <Pressable
                key={floor.id}
                onPress={() =>
                  router.push({
                    pathname: "/report/[korrus]",
                    params: { korrus: floor.id },
                  })
                }
                style={{
                  height: 48,
                  backgroundColor: "#EEEEEE",
                  borderRadius: 6,
                  alignItems: "center",
                  gap: 12,
                  flexDirection: "row",
                  position: "relative",
                }}
              >
                <View style={{ width: 18, borderRadius: 6, backgroundColor: floor.color, height: "100%" }} />
                <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>{floor.id}.korrus</Text>
                {floor.hasInfo ? (
                  <View style={{ position: "absolute", right: 12, bottom: 14 }}>
                    <Image source={require("@/assets/icons/info.png")} />
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>

          <Text style={{ fontFamily: "Poppins_700", fontSize: 24, paddingTop: 48 }}>Üritused</Text>

          <Events></Events>

          <Text style={{ fontFamily: "Poppins_700", fontSize: 24, paddingTop: 48 }}>Sündmused</Text>

          <EventsCalender></EventsCalender>
        </View>
        <View style={{ paddingTop: 36 }}></View>
        <Footer />
      </ScrollView>
    </View>
  );
}
