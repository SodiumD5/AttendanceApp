import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@react-native-vector-icons/feather";


const GoBack = ({ nav, pos = 20 }) => {
    return (
        <View style={{ ...styles.headerButton, top: pos }}>
            <Pressable onPress={() => nav.goBack()}>
                <Feather name="chevron-left" size={50} />
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
