import { StyleSheet, View, Text, Pressable } from "react-native";
import IconF from "react-native-vector-icons/Feather";

const GoBack = ({ nav, pos }) => {
    const topHeight = pos ? pos : 50;

    return (
        <View style={{ ...styles.headerButton, top: topHeight }}>
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
        top: 50,
        left: 5,
        flexDirection: "row",
    },
});
