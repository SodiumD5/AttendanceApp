import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "./Colors";

const BigButton = ({ context, onPress }) => {
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.ButtonShadow} />

            <Pressable onPress={onPress} style={styles.buttonWrapper}>
                <Text style={styles.buttonText}>{context}</Text>
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
        top: 3,
        left: 3,
    },

    buttonWrapper: {
        position: "absolute",
        backgroundColor: Colors.primary_gray,
        width: "100%",
        height: "100%",
        borderRadius: 10,
        //내부정렬
        justifyContent: "center", //세로
        alignItems: "center",
    },

    buttonText: {
        fontSize: 26,
        fontWeight: 600,
    },
});
