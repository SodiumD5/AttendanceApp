import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "./Colors";

export default function LongButton({ context, bgColor, textColor, onPress }) {
    const buttonBgColor = bgColor || Colors.primary_blue;
    const buttonTextColor = textColor || Colors.primary_white;

    const styles = StyleSheet.create({
        buttonContainer: {
            width: 320,
            height: 50,
            position: "relative",
            margin: 12,
        },

        ButtonShadow: {
            position: "absolute",
            width: 320,
            height: 50,
            borderRadius: 40,
            backgroundColor: "#E0E0E0",
            top: 12,
            left: 2,
        },

        buttonWrapper: {
            position: "absolute",
            backgroundColor: buttonBgColor,
            width: 320,
            height: 60,
            borderRadius: 40,

            //내부정렬
            justifyContent: "center", //세로
            alignItems: "center",
        },

        buttonText: {
            fontSize: 28,
            marginBottom: 10,
            fontWeight: 600,
            color: buttonTextColor,
        },
    });

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
}
