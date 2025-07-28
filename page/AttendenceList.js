import { StyleSheet, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../components/Colors";
import RoundButton from "../components/RoundButton";
import GoBack from "../components/GoBack";

const AttendenceList = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <GoBack nav={navigation}></GoBack>
            <View style={styles.headerButton}>
                <IconM name="account-circle-outline" size={50} onPress={() => navigation.push("Login")}/>
            </View>
            <Text style={styles.title}>출근 체크</Text>

            <View>
                <View style={styles.setRow}>
                    <RoundButton context="직원A" onPress={() => navigation.push("Attendence")}/>
                    <RoundButton context="직원B" />
                </View>
                <View style={styles.setRow}>
                    <RoundButton context="직원C" />
                    <RoundButton context="직원D" />
                </View>
                <View style={styles.setRow}>
                    <RoundButton context="직원E" />
                    <RoundButton context="직원F" />
                </View>
            </View>
        </View>
    );
};

export default AttendenceList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary_background,
        alignItems: "center",
        justifyContent: "center",
    },

    headerButton: {
        position: "absolute",
        top: 30,
        right: 5,
        justifyContent: "flex-end",
    },

    title: {
        fontSize: 40,
        fontWeight: 800,
        margin: 27,
    },

    setRow: {
        flexDirection: "row",
    },
});
