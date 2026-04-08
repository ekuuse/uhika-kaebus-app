import { useEffect, useMemo, useState } from "react";
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";
import { LabeledTextArea } from "@/components/LabeledTextArea";
import { fetchRoomsByFloor, ROOM_LETTERS, RoomGroupMap } from "@/lib/rooms";
import { getApiBaseUrl } from "@/lib/api";
import { getAuthToken } from "@/lib/session";
import { router, useLocalSearchParams } from "expo-router";
import {
    View,
    Text,
    Pressable,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native"

const complaintOptions = ["Mura", "Varakahju", "Koristus", "Muu"];


const Index = () => {
    const { korrus, tuba } = useLocalSearchParams<{ korrus: string; tuba: string }>();
    const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
    const [põhjendus, setPõhjendus] = useState("");
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [roomsByNumber, setRoomsByNumber] = useState<RoomGroupMap>({});
    const [isLoadingRooms, setIsLoadingRooms] = useState(true);
    const [roomError, setRoomError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadRooms = async () => {
            const floor = Array.isArray(korrus) ? korrus[0] : korrus;

            if (!floor) {
                setRoomError("Korruse info puudub.");
                setIsLoadingRooms(false);
                return;
            }

            const token = await getAuthToken();

            if (!token) {
                router.replace("/(auth)/signin");
                return;
            }

            try {
                setIsLoadingRooms(true);
                setRoomError("");
                const data = await fetchRoomsByFloor(floor, token);
                setRoomsByNumber(data);
            } catch (error) {
                console.error("Failed to load room details:", error);
                setRoomError("Toa info laadimine ebaõnnestus.");
            } finally {
                setIsLoadingRooms(false);
            }
        };

        loadRooms();
    }, [korrus]);

    const roomLetters = useMemo(() => {
        const selectedRoom = Array.isArray(tuba) ? tuba[0] : tuba;
        return selectedRoom ? roomsByNumber[selectedRoom] || { A: null, B: null, C: null } : { A: null, B: null, C: null };
    }, [roomsByNumber, tuba]);

    const selectedRoomNumber = Array.isArray(tuba) ? tuba[0] : tuba;

    const submitComplaint = async () => {
        const roomNr = Number(selectedRoomNumber);

        if (!Number.isInteger(roomNr)) {
            setSubmitError("Toa number on vigane.");
            return;
        }

        if (selectedComplaints.length === 0) {
            setSubmitError("Palun vali vähemalt üks kaebuse tüüp.");
            return;
        }

        if (!põhjendus.trim()) {
            setSubmitError("Palun lisa kaebuse kirjeldus.");
            return;
        }

        const token = await getAuthToken();

        if (!token) {
            router.replace("/(auth)/signin");
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError("");

            const response = await fetch(`${getApiBaseUrl()}/api/complaint`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: selectedComplaints.join(", "),
                    reasoning: põhjendus.trim(),
                    room: {
                        room_nr: roomNr,
                        room_letter: selectedLetter ?? "IDK",
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                setSubmitError(data?.error || data?.message || "Kaebuse saatmine ebaõnnestus.");
                return;
            }

            Keyboard.dismiss();
            router.push({
                pathname: "/report/[korrus]/[tuba]/kinnitatud",
                params: {
                    korrus,
                    tuba: selectedLetter ? `${selectedRoomNumber}-${selectedLetter}` : selectedRoomNumber,
                },
            });
        } catch (error) {
            console.error("Failed to submit complaint:", error);
            setSubmitError("Kaebuse saatmine ebaõnnestus.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ backgroundColor: "#ffffff", flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                keyboardShouldPersistTaps="always"
                keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
                contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 24,
                }}
            >
                <Text style={{ fontFamily: "Poppins_700", fontSize: 24, textAlign: "left", width: "100%" }}>Kaebus toale {selectedRoomNumber}</Text>
                {isLoadingRooms ? (
                    <Text style={{ marginTop: 8, color: "#00000080", width: "100%" }}>Laadime toa infot...</Text>
                ) : roomError ? (
                    <Text style={{ marginTop: 8, color: "#C62828", width: "100%" }}>{roomError}</Text>
                ) : null}
                <View style={{ display: "flex", flexDirection: "row", gap: 16, paddingTop: 24 }}>
                    {ROOM_LETTERS.map(letter => {
                        const roomExists = roomLetters?.[letter] !== null;
                        return (
                            <Pressable
                                key={letter}
                                disabled={!roomExists}
                                onPress={() => {
                                    if (roomExists) {
                                        setSelectedLetter(letter);
                                    }
                                }}
                                style={{
                                    backgroundColor: selectedLetter === letter
                                        ? "#AAAAFF" // highlight selected
                                        : roomExists
                                            ? "#EEEEEE"
                                            : "#CCCCCC",
                                    borderColor: "#00000012",
                                    borderWidth: 1,
                                    borderRadius: 6,
                                    height: 48,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "30%",
                                }}
                            >
                                <Text>{letter}</Text>
                            </Pressable>
                        );
                    })}
                </View>
                <Pressable
                    onPress={() => setSelectedLetter(null)}
                    style={{ backgroundColor: "#EEEEEE", borderColor: "#00000012", marginTop: 12, borderWidth: 1, borderRadius: 6, height: 48, alignItems: "center", justifyContent: "center", width: "100%" }}
                >
                    <Text>Ei ole kindel</Text>
                </Pressable>
                <Text style={{ textAlign: "left", width: "100%", color: "#FF5959", marginTop: 8 }}>* palun valige tuba</Text>

                <MultiSelectDropdown
                    label=""
                    options={complaintOptions}
                    selectedValues={selectedComplaints}
                    onChange={setSelectedComplaints}
                    placeholder="Vali kaebuse tuubid"
                />

                <LabeledTextArea
                    label=""
                    placeholder="Kirjeldage kaebust..."
                    value={põhjendus}
                    onChangeText={setPõhjendus}
                />

                <Pressable
                    onPress={submitComplaint}
                    disabled={isSubmitting}
                    style={{ backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1, marginTop: 12, borderRadius: 6, width: "100%", alignItems: "center", justifyContent: "center", height: 48 }}
                >
                    <Text>{isSubmitting ? "Saadan..." : "Saada"}</Text>
                </Pressable>
                {submitError ? <Text style={{ textAlign: "left", width: "100%", color: "#C62828", marginTop: 8 }}>{submitError}</Text> : null}
                <Pressable
                    onPress={() => { Keyboard.dismiss(); router.replace("/"); }}
                    style={{ backgroundColor: "#EEEEEE", borderColor: "#FF00004F", borderWidth: 1, marginTop: 12, borderRadius: 6, width: "100%", alignItems: "center", justifyContent: "center", height: 48 }}
                >
                    <Text style={{ color: "#FF0000" }}>Tühista</Text>
                </Pressable>

                <Text style={{ textAlign: "center", marginTop: 8, color: "#00000040" }}>Kaebuse esitamisel nõustute meie kasutustingimustega.</Text>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Index;