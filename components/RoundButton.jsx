import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "./Colors";

export default function RoundButton({ context, wrapperStyle, textStyle, onPress }) {
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.ButtonShadow} />
            <Pressable onPress={onPress} style={[styles.roundButtonWrapper, wrapperStyle]}>
                <Text style={[styles.roundButton, textStyle]}>{context}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 100,
        height: 100,
        position: "relative",
        margin: 10,
        marginVertical: 20,
    },

    ButtonShadow: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: "#0D98BA",
        top: 2,
        left: 2,
    },

    roundButtonWrapper: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: Colors.primary_mint,
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
