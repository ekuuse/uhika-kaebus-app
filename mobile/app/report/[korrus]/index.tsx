import { LabeledNumberInput } from "@/components/LabledNumberInput";
import Navbar from "@/components/Navbar";
import { useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, Pressable } from "react-native"

const Index = () => {
    const { korrus } = useLocalSearchParams<{ korrus: any }>();
    return (
        <View>
            <Navbar></Navbar>
            <View style={{ paddingHorizontal: 36 }}>
                <Text style={{ fontFamily: "Poppins_700", fontSize: 24, textAlign: "center", paddingTop: 24 }}>Te esitate kaebust, {korrus}.korrusel</Text>
                <Text style={{ fontFamily: "Poppins_700", fontSize: 24, textAlign: "center", paddingTop: 26 }}>Valige tuba, millele kaebus esitada</Text>
                <LabeledNumberInput label="" placeholder="Otsi tuba..."></LabeledNumberInput>
                <View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", gap: 16, paddingTop: 24 }}>
                    <Pressable style={{backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1, borderRadius: 6, width: "30.13%", alignItems: "center", justifyContent:"center", height: 48}}><Text>405</Text></Pressable>
                    <Pressable style={{backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1, borderRadius: 6, width: "30.13%", alignItems: "center", justifyContent:"center", height: 48}}><Text>405</Text></Pressable>
                    <Pressable style={{backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1, borderRadius: 6, width: "30.13%", alignItems: "center", justifyContent:"center", height: 48}}><Text>405</Text></Pressable>
                    <Pressable style={{backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1, borderRadius: 6, width: "30.13%", alignItems: "center", justifyContent:"center", height: 48}}><Text>405</Text></Pressable>
                    <Pressable style={{backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1, borderRadius: 6, width: "30.13%", alignItems: "center", justifyContent:"center", height: 48}}><Text>405</Text></Pressable>
                </View>
            </View>
        </View>
    )
}

export default Index;