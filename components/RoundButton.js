import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "../components/Colors";

export default function RoundButton({
    context,
    wrapperStyle,
    textStyle,
    onPress,
}) {
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.ButtonShadow} />
            <Pressable
                onPress={onPress}
                style={[styles.roundButtonWrapper, wrapperStyle]}
            >
                <Text style={[styles.roundButton, textStyle]}>{context}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 140,
        height: 140,
        position: "relative",
        margin: 15,
    },

    ButtonShadow: {
        position: "absolute",
        width: 130,
        height: 130,
        borderRadius: 20,
        backgroundColor: "#E0E0E0",
        top: 5,
        left: 5,
    },

    roundButtonWrapper: {
        position: "absolute",
        width: 130,
        height: 130,
        borderRadius: 20,
        backgroundColor: Colors.primary_blue,
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
    },

    roundButton: {
        fontSize: 28,
        fontWeight: "600",
        color: "#FFFFFF",
    },
});
