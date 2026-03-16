
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable } from 'react-native';

const kinnitatud = () => {
    const { tuba } = useLocalSearchParams<{ tuba: string }>();
    return (
        <View style={{backgroundColor: "#ffffff", flex: 1, justifyContent: "center", paddingHorizontal: 12}}>
            <Text style={{fontFamily: "Poppins_700", fontSize: 24}}>Teie kaebus toale {tuba}</Text>
            <View>
                <Text style={{fontFamily: "Poppins_700", fontSize: 24,textAlign: "left"}}>on esitatud!</Text>
                <View style={{backgroundColor: "#50C800", borderRadius: 6, height: 8, width: "50%"}}></View>
            </View>
            <Text style={{fontFamily: "Poppins_400", fontSize: 13, color: "#00000080", marginTop: 8}}>Teie kaebusega tegeletakse peagi, proovige vastu pidada.</Text>

            <Pressable 
                onPress={() => router.replace("/")}
                style={{ backgroundColor: "#EEEEEE", borderColor: "#00000012", borderWidth: 1,marginTop:36, borderRadius: 6, width: "100%", alignItems: "center", justifyContent: "center", height: 48 }}>
                <Text style={{fontSize: 19, fontFamily: "Poppins_400"}}>Tagasi avalehele</Text>
            </Pressable>
        </View>
    )
}

export default kinnitatud;