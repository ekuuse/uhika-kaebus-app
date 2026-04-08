import { router } from "expo-router";
import { View, Text, Image, Pressable } from "react-native";

const Events = () => {
    return (
        <View>
            <Pressable onPress={() => router.push("/uritused/[id]/index")} style={{ backgroundColor: "#EEEEEE", paddingVertical: 24, paddingHorizontal: 16, borderRadius: 6, marginTop: 16, flexDirection: "row" }}>
                <View style={{ width: "60%" }}>
                    <Text style={{ fontFamily: "Poppins_700", fontSize: 24 }}>Lauamängude õhtu</Text>
                    <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>Kopli, 4.korrus puhkeruum</Text>
                    <Text style={{ fontFamily: "Poppins_400", fontSize: 19, position: "absolute", bottom: 0 }}>Teisipäev, 20:00</Text>
                </View>

                <View style={{ width: "40%" }}>
                    <Image source={require("@/assets/temp/image 1.png")}></Image>
                </View>
            </Pressable>

            <Pressable style={{ backgroundColor: "#EEEEEE", paddingVertical: 24, paddingHorizontal: 16, borderRadius: 6, marginTop: 16, height: 240, flexDirection: "row" }}>
                <View style={{ width: "60%" }}>
                    <Text style={{ fontFamily: "Poppins_700", fontSize: 24 }}>Lauamängude õhtu</Text>
                    <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>Kopli, 4.korrus puhkeruum</Text>
                    <Text style={{ fontFamily: "Poppins_400", fontSize: 19, position: "absolute", bottom: 0 }}>Teisipäev, 20:00</Text>
                </View>

                <View style={{ width: "40%" }}>
                    <Image source={require("@/assets/temp/image 1.png")}></Image>
                </View>
            </Pressable>
        </View>
    )
}

export default Events;