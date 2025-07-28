import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "./Colors";

const ShortButton = ({context, onPress}) => {
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.ButtonShadow} />
            <View style={styles.buttonWrapper}>
                <Pressable onPress={onPress}>
                    <Text style={styles.buttonText}>{context}</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default ShortButton;

const styles = StyleSheet.create({
    buttonContainer: {
        width: 170,
        height: 50,
        position: "relative",
        margin: 12,
    },

    ButtonShadow: {
        position: "absolute",
        width: 170,
        height: 50,
        borderRadius: 40,
        backgroundColor: "#E0E0E0",
        top: 12,
        left: 2,
    },

    buttonWrapper: {
        position: "absolute",
        backgroundColor: Colors.primary_yellow,
        width: 170,
        height: 60,
        borderRadius: 40,

        //내부정렬
        justifyContent: "center", //세로
        alignItems: "center",
    },

    buttonText: {
        fontSize: 26,
        marginBottom: 10,
        fontWeight: 600,
        color: "#FFFFFF",
    },
});
