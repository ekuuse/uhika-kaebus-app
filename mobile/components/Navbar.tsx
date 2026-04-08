import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearAuthToken } from "@/lib/session";
import { useRouter } from "expo-router";

const Navbar = ({ showLogout }: { showLogout: boolean }) => {
    const router = useRouter();

    const handleLogout = async () => {
        await clearAuthToken();
        router.replace('/signin');
    }

    return(
        <View style={{backgroundColor: "black"}}>
            <SafeAreaView style={{justifyContent: "center", paddingTop: 24,position: "relative", height: 64}}>
                <Image source={require('@/assets/branding/voco logo-06.png')}></Image>

                {showLogout && (
                    <Pressable onPress={handleLogout} style={{position: "absolute", right: 24, bottom: 24}}>
                        <Image style={{width: 24, height: 24}} source={require("@/assets/icons/logout.png")}></Image>
                    </Pressable>
                )}
            </SafeAreaView>
        </View>
    )
}

export default Navbar;