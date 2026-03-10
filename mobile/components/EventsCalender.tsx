import { View, Text } from "react-native";

const EventsCalender = () => {
    return (
        <View style={{gap: 16}}>
            <View style={{backgroundColor: "#EEEEEE", alignItems: "center", borderRadius: 6, borderColor: "#00000012", borderWidth:1, padding:16, flexDirection: "row", gap: 8}}>
                <View style={{width: 14, height: 14, borderRadius: 34, backgroundColor: "#696969"}}></View>
                <Text style={{fontFamily: "Poppins_400", fontSize: 14}}>Tänaseks sündmused puuduvad</Text>
            </View>

            <View style={{backgroundColor: "#EEEEEE", justifyContent: "center", borderRadius: 6, borderColor: "#00000012", borderWidth:1, padding:16, flexDirection: "col", gap: 8}}>
                
                <View style={{flexDirection: "row", alignItems:"center", gap:8}}>
                    <View style={{width: 14, height: 14, borderRadius: 34, backgroundColor: "#686868"}}></View>
                    <Text style={{color: "#686868", fontFamily: "Poppins_400", fontSize: 14}}>Homme, Teisipäev</Text>

                </View>
                <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>Korisuspäev</Text>
                <Text style={{color: "#686868", fontFamily: "Poppins_400", fontSize: 14}}>Korduv</Text>
            </View>

            <View style={{backgroundColor: "#EEEEEE", justifyContent: "center", borderRadius: 6, borderColor: "#00000012", borderWidth:1, padding:16, flexDirection: "col", gap: 8}}>
                
                <View style={{flexDirection: "row", alignItems:"center", gap:8}}>
                    <View style={{width: 14, height: 14, borderRadius: 34, backgroundColor: "#686868"}}></View>
                    <Text style={{color: "#686868", fontFamily: "Poppins_400", fontSize: 14}}>8.12.2025 -10.12.2025</Text>

                </View>
                <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>Jõuluvaheaja pääse</Text>
            </View>
        </View>
    )
}

export default EventsCalender;