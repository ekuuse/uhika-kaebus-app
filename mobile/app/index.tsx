import Events from "@/components/Events";
import EventsCalender from "@/components/EventsCalender";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Pressable, Text, View, Image, ScrollView } from "react-native";

export default function Index() {
  return (
    <View>
      <Navbar></Navbar>

      <ScrollView>
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ fontFamily: "Poppins_700", fontSize: 24, paddingTop: 16 }}>Tere õhtust, (nimi)</Text>
          <View style={{ flexDirection: "row", gap: 8, paddingTop: 8 }}>
            <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>Teie tuba:</Text><Text style={{ fontFamily: "Poppins_700", fontSize: 19 }}>312B</Text>
          </View>
          <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>Teie toal on 3 kaebust viimase kuu jooksul.</Text>

          <Text style={{ fontFamily: "Poppins_700", fontSize: 24, paddingTop: 48 }}>Valige korrus</Text>

          <View style={{ gap: 16, paddingTop: 16 }}>
            <Pressable style={{ height: 48, backgroundColor: "#EEEEEE", borderRadius: 6, alignItems: "center", gap: 12, flexDirection: "row" }}>
              <View style={{ width: 18, borderRadius: 6, backgroundColor: "#50C800", height: "100%" }} />
              <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>5.korrus</Text>
            </Pressable>
            <Pressable style={{ height: 48, backgroundColor: "#EEEEEE", borderRadius: 6, alignItems: "center", gap: 12, flexDirection: "row" }}>
              <View style={{ width: 18, borderRadius: 6, backgroundColor: "#1F42DC", height: "100%" }} />
              <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>4.korrus</Text></Pressable>
            <Pressable style={{ height: 48, backgroundColor: "#EEEEEE", borderRadius: 6, alignItems: "center", gap: 12, flexDirection: "row" }}>
              <View style={{ width: 18, borderRadius: 6, backgroundColor: "#D20101", height: "100%" }} />
              <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>3.korrus</Text>
              <Pressable style={{ position: "absolute", right: 12, bottom: 14 }}>
                <Image source={require('@/assets/icons/info.png')}></Image>
              </Pressable>
            </Pressable>
            <Pressable style={{ height: 48, backgroundColor: "#EEEEEE", borderRadius: 6, alignItems: "center", gap: 12, flexDirection: "row" }}>
              <View style={{ width: 18, borderRadius: 6, backgroundColor: "#FFD723", height: "100%" }} />
              <Text style={{ fontFamily: "Poppins_400", fontSize: 19 }}>2.korrus</Text></Pressable>
            <Pressable style={{ position: "absolute", right: 12, bottom: 14 }}>
              <Image source={require('@/assets/icons/info.png')}></Image>
            </Pressable>
          </View>

          <Text style={{ fontFamily: "Poppins_700", fontSize: 24, paddingTop: 48 }}>Üritused</Text>

          <Events></Events>

          <Text style={{ fontFamily: "Poppins_700", fontSize: 24, paddingTop: 48 }}>Sündmused</Text>

          <EventsCalender></EventsCalender>
        </View>



        <View style={{paddingTop:36}}></View>
        <Footer></Footer>

        <View style={{ paddingBottom: 104 }}></View>

      </ScrollView>

    </View>
  );
}
