import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import LongButton from "./components/LongButton";
import Colors from "./components/Colors";

export default function App() {
  return (
    <View style={styles.container}>
      <View>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
      </View>
      <LongButton context="출근하기" />
      <LongButton
        context="관리자로 로그인"
        bgColor={Colors.primary_white}
        textColor={Colors.text_gray}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
    marginBottom: 44,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.primary_background,
    alignItems: "center",
    justifyContent: "center",
  },
});
