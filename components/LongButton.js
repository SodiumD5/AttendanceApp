import { StyleSheet, View, Text } from "react-native";
import Colors from "./Colors";

export default function LongButton({ context, bgColor, textColor }) {
  const buttonBgColor = bgColor || Colors.primary_blue;
  const buttonTextColor = textColor || Colors.primary_white;

  const styles = StyleSheet.create({
    buttonWrapper: {
      backgroundColor: buttonBgColor,
      width: 340,
      height: 60,
      margin: 12,
      borderRadius: 40,

      //내부정렬
      justifyContent: "center", //세로
      alignItems: "center",
    },

    buttonText: {
      fontSize: 28,
      fontWeight: 600,
      color: buttonTextColor,
    },
  });

  return (
    <View style={styles.buttonWrapper}>
      <Text style={styles.buttonText}>
        {context}
      </Text>
    </View>
  );
}
