import { router } from "expo-router";
import { View, Image, Text, Pressable } from "react-native"

const Index = () => {
    return (
        <View>
            <View>
                <Image source={require('@/assets/temp/tempbanner.png')} style={{ width: "100%" }} />
                <View style={{ paddingHorizontal: 24}}>
                    <Text style={{ fontFamily: "Poppins_700", fontSize: 24, marginBottom: 12 }}>Lauamängude õhtu</Text>
                    <Text style={{ fontFamily: "Poppins_400", fontSize: 16 }}>Kopli, 4.korrus puhkeruum</Text>
                    <Text style={{ fontFamily: "Poppins_400", fontSize: 16, marginBottom: 12 }}>Kolmapäev, 17:00</Text>

                    <Text style={{ fontFamily: "Poppins_400", fontSize: 16 }}>
                        Astu julgelt läbi ja tule mängima! Laual on nii vanu kui uusi lemmikuid (pusled, Alias, Dobble, Mälumängud, VOCO karjäärimäng jm), pakkume teed ja küpsiseid.

                        Külas on koolipsüholoogid!
                    </Text>
                </View>
                <Pressable onPress={() => router.back()} style={{position: "absolute", top:12, left: 12}}><Image source={require("@/assets/icons/Go Back.png")}></Image></Pressable>
            </View>
        </View>
    )
}

export default Index;