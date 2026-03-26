import Navbar from "@/components/Navbar";
import { View, Image } from "react-native"

const Index = () => {
    return (
        <View>
            <Navbar showLogout={false} />

            <View>
                <Image source={require('@/assets/temp/tempbanner.png')} />
            </View>
        </View>
    )
}

export default Index;