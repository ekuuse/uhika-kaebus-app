import { useState } from "react";
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";
import { LabeledTextArea } from "@/components/LabeledTextArea";
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

const complaintOptions = [
    "Mura",
    "Varakahju",
    "Koristus",
    "Muu",
];

const letters = ["A", "B", "C"];


const Index = () => {
    const { korrus, tuba } = useLocalSearchParams<{ korrus: string; tuba: string }>();
    const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
    const [põhjendus, setPõhjendus] = useState("");
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    const roomsData: Record<string, Record<string, any | null>> = {
        "101": { A: { grade: 1 }, B: { grade: 2 }, C: null },
        "102": { A: null, B: { grade: 3 }, C: { grade: 4 } },
    };

    // Get letters for this room
    const roomLetters = roomsData[tuba] || { A: null, B: null, C: null };


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
                <Text style={{ fontFamily: "Poppins_700", fontSize: 24, textAlign: "left", width: "100%" }}>Kaebus toale {tuba}</Text>
                <View style={{ display: "flex", flexDirection: "row", gap: 16, paddingTop: 24 }}>
                    {letters.map(letter => {
                        const roomExists = roomLetters?.[letter] !== null;
                        return (
                            <Pressable
                                key={letter}
                                disabled={!roomExists}
                                onPress={() => {
                                    if (roomExists) {
                                        console.log("Clicked room letter:", letter);
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
                <Pressable style={{ backgroundColor: "#EEEEEE", borderColor: "#00000012", marginTop: 12, borderWidth: 1, borderRadius: 6, height: 48, alignItems: "center", justifyContent: "center", width: "100%" }}><Text>Ei ole kindel</Text></Pressable>
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
                    onPress={() => {
                        Keyboard.dismiss();
                        router.push({
                            pathname: "/report/[korrus]/[tuba]/kinnitatud",
                            params: { korrus, tuba },
                        });
                    }}
                    style={{ backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1, marginTop: 12, borderRadius: 6, width: "100%", alignItems: "center", justifyContent: "center", height: 48 }}
                >
                    <Text>Saada</Text>
                </Pressable>
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