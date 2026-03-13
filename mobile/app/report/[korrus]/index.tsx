import { LabeledNumberInput } from "@/components/LabledNumberInput";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable } from "react-native"

const rooms = ["405", "406", "407", "408", "409"];

const Index = () => {
    const { korrus } = useLocalSearchParams<{ korrus: string }>();
    return (
        <View>
            <Text style={{ fontFamily: "Poppins_700", fontSize: 24, textAlign: "center" }}>Te esitate kaebust, {korrus}.korrusel</Text>
            <Text style={{ fontFamily: "Poppins_700", fontSize: 24, textAlign: "center", paddingTop: 26 }}>Valige tuba, millele kaebus esitada</Text>
            <LabeledNumberInput label="" placeholder="Otsi tuba..." />
            <View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", gap: 16, paddingTop: 24 }}>
                {rooms.map((room) => (
                    <Pressable
                        key={room}
                        onPress={() =>
                            router.push({
                                pathname: "/report/[korrus]/[tuba]",
                                params: { korrus, tuba: room },
                            })
                        }
                        style={{ backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1, borderRadius: 6, width: "30.13%", alignItems: "center", justifyContent: "center", height: 48 }}
                    >
                        <Text>{room}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

export default Index;