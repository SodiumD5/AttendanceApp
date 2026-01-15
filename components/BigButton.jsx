import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "./Colors";
import { Lucide } from "@react-native-vector-icons/lucide";
import { Feather } from "@react-native-vector-icons/feather";

const BigButton = ({ context, onPress }) => {
    const Icon = () => {
        if (context == "월간 출근부") {
            return <Lucide name="calendar" size={48} />;
        } else if (context == "연차대장") {
            return <Feather name="zoom-in" size={48} />;
        } else if (context == "교직원 관리") {
            return <Feather name="edit" size={48} />;
        }
    };

    return (
        <View style={styles.buttonContainer}>
            <View style={styles.ButtonShadow} />

            <Pressable onPress={onPress} style={styles.buttonWrapper}>
                {Icon()}
                <View style={styles.textContainer}>
                    <Text style={styles.buttonText}>{context}</Text>
                </View>
            </Pressable>
        </View>
    );
};

export default BigButton;

const styles = StyleSheet.create({
    buttonContainer: {
        width: 350,
        height: 100,
        position: "relative",
        marginTop: 30,
    },

    ButtonShadow: {
        position: "absolute",
        width: 350,
        height: 100,
        borderRadius: 10,
        backgroundColor: "#8a8a8aff",
        top: 2,
        left: 2,
    },

    buttonWrapper: {
        position: "absolute",
        backgroundColor: Colors.primary_gray,
        width: "100%",
        height: "100%",
        borderRadius: 10,

        justifyContent: "flex-start",
        paddingHorizontal: 30,
        alignItems: "center",
        flexDirection: "row",
    },

    buttonText: {
        fontSize: 26,
        fontWeight: 600,
    },

    textContainer: {
        flex: 1,
        alignItems: "center",
    },
});
