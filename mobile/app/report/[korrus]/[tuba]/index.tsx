import { useState } from "react";
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";
import { LabeledTextArea } from "@/components/LabeledTextArea";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Pressable } from "react-native"

const complaintOptions = [
    "Mura",
    "Varakahju",
    "Koristus",
    "Muu",
];

const Index = () => {
    const { korrus, tuba } = useLocalSearchParams<{ korrus: string; tuba: string }>();
    const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
    const [põhjendus, setPõhjendus] = useState("");

    return (
        <View style={{backgroundColor: "#ffffff", flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Text style={{ fontFamily: "Poppins_700", fontSize: 24, textAlign: "left", width: "100%" }}>Kaebus toale {tuba}</Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 16, paddingTop: 24 }}>
                <Pressable style={{backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth:1, borderRadius: 6, height: 48, alignItems: "center", justifyContent: "center", width: "30%"}}><Text>A</Text></Pressable>
                <Pressable style={{backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth:1, borderRadius: 6, height: 48, alignItems: "center", justifyContent: "center", width: "30%"}}><Text>B</Text></Pressable>
                <Pressable style={{backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth:1, borderRadius: 6, height: 48, alignItems: "center", justifyContent: "center", width: "30%"}}><Text>C</Text></Pressable>
            </View>
            <Pressable style={{backgroundColor: "#EEEEEE", borderColor: "#00000012",marginTop: 12, borderWidth:1, borderRadius: 6, height: 48, alignItems: "center", justifyContent: "center", width: "100%"}}><Text>Ei ole kindel</Text></Pressable>
            <Text style={{textAlign: "left", width: "100%", color: "#FF5959", marginTop: 8}}>* palun valige tuba</Text>

            <MultiSelectDropdown
                options={complaintOptions}
                selectedValues={selectedComplaints}
                onChange={setSelectedComplaints}
                placeholder="Vali kaebuse tuubid"
            />

            <LabeledTextArea
                placeholder="Kirjeldage kaebust..."
                value={põhjendus}
                onChangeText={setPõhjendus}
            />

            <Pressable style={{ backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1,marginTop:12, borderRadius: 6, width: "100%", alignItems: "center", justifyContent: "center", height: 48 }}>
                <Text>Saada</Text>
            </Pressable>
            <Pressable style={{ backgroundColor: "#EEEEEE", borderColor: "#FF00004F", borderWidth: 1,marginTop:12, borderRadius: 6, width: "100%", alignItems: "center", justifyContent: "center", height: 48 }}>
                <Text style={{color: "#FF0000"}}>Tühista</Text>
            </Pressable>

            <Text style={{textAlign:"center", marginTop:8, color:"#00000040"}}>Kaebuse esitamisel nõustute meie kasutustingimustega.</Text>
        </View>
    )
}

export default Index;