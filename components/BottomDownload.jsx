import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";


const BottomDownload = ({ webview, download, isVisible }) => {
    return (
        <View style={[styles.container, { display: isVisible ? "flex" : "none" }]}>
            <TouchableOpacity onPress={webview}>
                <Text style={styles.text}>웹 열기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={download}>
                <Text style={styles.text}>다운로드</Text>
            </TouchableOpacity>
        </View>
    );
};
export default BottomDownload;

const styles = StyleSheet.create({
    container: { justifyContent: "space-around", flexDirection: "row" },
    text: {
        bottom: 5,
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.text_gray,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
});
