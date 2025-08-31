import { StyleSheet, View, Pressable } from "react-native";
import IconF from "react-native-vector-icons/Feather";

const GoBack = ({ nav, pos = 20 }) => {
    return (
        <View style={{ ...styles.headerButton, top: pos }}>
            <Pressable onPress={() => nav.goBack()}>
                <IconF name="chevron-left" size={50} />
            </Pressable>
        </View>
    );
};

export default GoBack;

const styles = StyleSheet.create({
    headerButton: {
        position: "absolute",
        left: 5,
        flexDirection: "row",
    },
});
