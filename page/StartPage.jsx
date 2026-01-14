import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";

import Colors from "../components/Colors";
import LongButton from "../components/LongButton";
import Auth from "../components/Auth";

const StartPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View>
                <Image source={require("../assets/calendar.png")} style={styles.logo} />
            </View>
            <LongButton context="출근하기" onPress={() => navigation.push("AttendanceList")} />
            <Auth />
            <StatusBar style="auto" />
        </View>
    );
};

export default StartPage;

const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 200,
        marginBottom: 44,
    },

    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: "center",
    },
});
