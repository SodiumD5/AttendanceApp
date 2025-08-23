import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "./Colors";

const RectangleButton = ({ message, onPress, buttonColor = "purple", buttontype = "bottom" }) => {
    let bgcolor;
    let textcolor;
    if (buttonColor == "purple") {
        bgcolor = Colors.primary_purple;
        textcolor = "white";
    } else if (buttonColor == "white") {
        bgcolor = Colors.primary_gray;
        textcolor = Colors.text_gray;
    } else if (buttonColor == "blue") {
        bgcolor = Colors.primary_blue;
        textcolor = "white";
    } else if (buttonColor == "red"){
        bgcolor = Colors.primary_red;
        textcolor = "white";
    }

    let additionalContainerStyle = {};
    let fontSize = 18;
    if (buttontype === "bottom") {
        additionalContainerStyle = {
            position: "absolute",
            bottom: 30,
            width: "80%",
        };
    } else {
        additionalContainerStyle = {
            width: "100%",
            padding: 12,
            borderRadius: 10,
            marginTop: 10,
        };
        fontSize = 16;
    }

    return (
        <TouchableOpacity
            style={[styles.rectangeButton, additionalContainerStyle, { backgroundColor: bgcolor }]}
            onPress={() => {
                onPress();
            }}>
            <Text style={[styles.rectangeButtonText, { color: textcolor, fontSize: fontSize }]}>
                {message}
            </Text>
        </TouchableOpacity>
    );
};
export default RectangleButton;

const styles = StyleSheet.create({
    rectangeButton: {
        alignSelf: "center",
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
        fontSize: 18,
        fontWeight: "bold",
    },
});
