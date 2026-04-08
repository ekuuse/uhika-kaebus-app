import { LabeledNumberInput } from "@/components/LabledNumberInput";
import { getAuthToken } from "@/lib/session";
import { fetchRoomsByFloor, getRoomSummariesForFloor, RoomGroupMap } from "@/lib/rooms";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

const Index = () => {
    const { korrus } = useLocalSearchParams<{ korrus: string }>();
    const [roomsByNumber, setRoomsByNumber] = useState<RoomGroupMap>({});
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadRooms = async () => {
            const floor = Array.isArray(korrus) ? korrus[0] : korrus;

            if (!floor) {
                setErrorMessage("Korruse valik puudub.");
                setIsLoading(false);
                return;
            }

            const token = await getAuthToken();

            if (!token) {
                router.replace("/(auth)/signin");
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage("");
                const data = await fetchRoomsByFloor(floor, token);
                setRoomsByNumber(data);
            } catch (error) {
                console.error("Failed to load floor rooms:", error);
                setErrorMessage("Tubade laadimine ebaõnnestus.");
            } finally {
                setIsLoading(false);
            }
        };

        loadRooms();
    }, [korrus]);

    const roomSummaries = useMemo(() => {
        const floor = Array.isArray(korrus) ? korrus[0] : korrus;

        if (!floor) {
            return [];
        }

        return getRoomSummariesForFloor(roomsByNumber, floor, searchValue);
    }, [korrus, roomsByNumber, searchValue]);

    return (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 24 }}>
            <Text style={{ fontFamily: "Poppins_700", fontSize: 24, textAlign: "center" }}>Te esitate kaebust, {korrus}.korrusel</Text>
            <Text style={{ fontFamily: "Poppins_700", fontSize: 24, textAlign: "center", paddingTop: 26 }}>Valige tuba, millele kaebus esitada</Text>

            <View style={{ paddingTop: 18 }}>
                <LabeledNumberInput
                    label=""
                    placeholder="Otsi tuba..."
                    value={searchValue}
                    onChangeText={setSearchValue}
                />
            </View>

            {isLoading ? (
                <View style={{ paddingTop: 32 }}>
                    <ActivityIndicator color="#000000" />
                </View>
            ) : errorMessage ? (
                <Text style={{ textAlign: "center", color: "#C62828", paddingTop: 24 }}>{errorMessage}</Text>
            ) : roomSummaries.length === 0 ? (
                <Text style={{ textAlign: "center", color: "#00000080", paddingTop: 24 }}>Sellel korrusel ei leitud ühtegi tuba.</Text>
            ) : (
                <View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", gap: 16, paddingTop: 24 }}>
                    {roomSummaries.map(({ roomNumber, availableLetters }) => (
                        <Pressable
                            key={roomNumber}
                            onPress={() =>
                                router.push({
                                    pathname: "/report/[korrus]/[tuba]",
                                    params: { korrus, tuba: roomNumber },
                                })
                            }
                            style={{ backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1, borderRadius: 6, width: "30.13%", alignItems: "center", justifyContent: "center", height: 64 }}
                        >
                            <Text style={{ fontFamily: "Poppins_700", fontSize: 19 }}>{roomNumber}</Text>
                            <Text style={{ fontFamily: "Poppins_400", fontSize: 12, color: "#00000080", marginTop: 4 }}>
                                {availableLetters.length > 0 ? availableLetters.join(" ") : "Tühi"}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </ScrollView>
    )
}

export default Index;