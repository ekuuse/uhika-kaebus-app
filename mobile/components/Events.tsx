import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { getApiBaseUrl } from "@/lib/api";
import { getAuthToken } from "@/lib/session";

type EventItem = {
    event_id: number;
    name: string;
    description?: string | null;
    location?: string | null;
    date: string;
    image?: string | null;
};

const Events = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = await getAuthToken();

                if (!token) {
                    setErrorMessage("Puudub sisselogimisinfo");
                    return;
                }

                const response = await fetch(`${getApiBaseUrl()}/api/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok || !data?.success) {
                    setErrorMessage(data?.message || "Ürituste laadimine ebaõnnestus");
                    return;
                }

                setEvents(Array.isArray(data?.data) ? data.data : []);
            } catch (error) {
                console.error("Failed to load events:", error);
                setErrorMessage("Serveriga ei saanud ühendust");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <View style={{ paddingVertical: 24 }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (errorMessage) {
        return (
            <View style={{ marginTop: 16, padding: 16, backgroundColor: "#EEEEEE", borderRadius: 6 }}>
                <Text style={{ fontFamily: "Poppins_400", fontSize: 16 }}>{errorMessage}</Text>
            </View>
        );
    }

    if (!events.length) {
        return (
            <View style={{ marginTop: 16, padding: 16, backgroundColor: "#EEEEEE", borderRadius: 6 }}>
                <Text style={{ fontFamily: "Poppins_400", fontSize: 16 }}>Üritusi ei leitud</Text>
            </View>
        );
    }

    return (
        <View>
            {events.map((event) => {
                const eventDate = new Date(event.date);

                return (
                    <Pressable
                        key={event.event_id}
                        onPress={() => router.push(`/uritused/${event.event_id}/${event.event_id}`)}
                        style={{ backgroundColor: "#EEEEEE", paddingVertical: 24, paddingHorizontal: 16, borderRadius: 6, marginTop: 16, flexDirection: "row" }}
                    >
                        <View style={{ width: "60%", paddingRight: 12 }}>
                            <Text style={{ fontFamily: "Poppins_700", fontSize: 24 }}>{event.name}</Text>
                            <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>{event.location || "Asukoht puudub"}</Text>
                            <Text style={{ fontFamily: "Poppins_400", fontSize: 19}}>
                                {eventDate.toLocaleDateString("et-EE", { weekday: "long", day: "numeric", month: "long" })}, {eventDate.toLocaleTimeString("et-EE", { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                        </View>

                        <View style={{ width: "40%" }}>
                            <Image
                                source={event.image ? { uri: event.image } : require("@/assets/temp/image 1.png")}
                                style={{ width: "100%", height: 120, borderRadius: 6 }}
                                resizeMode="cover"
                            />
                        </View>
                    </Pressable>
                );
            })}
        </View>
    )
}

export default Events;