import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "./Colors";

const RectangleButton = ({ message, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.rectangeButton}
            onPress={() => {
                onPress();
            }}>
            <Text style={styles.rectangeButtonText}>{message}</Text>
        </TouchableOpacity>
    );
};
export default RectangleButton;

const styles = StyleSheet.create({
    rectangeButton: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        width: "80%",
        backgroundColor: Colors.primary_purple,
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    rectangeButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
