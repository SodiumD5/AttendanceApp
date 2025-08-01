import { StyleSheet, View, Text } from "react-native";
import Colors from "../components/Colors";

import GoBack from "../components/GoBack";

const AdminHeader = ({ nav, menuName }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{menuName}</Text>
            { nav && <GoBack nav={nav} pos={30}></GoBack>}
        </View>
    );
};

export default AdminHeader;

const styles = StyleSheet.create({
    header: {
        height: 80,
        width: "100%",
        backgroundColor: Colors.primary_yellow,

        justifyContent: "center",
        alignItems: "center",
    },

    headerText: {
        marginTop:30,
        fontSize: 32,
        fontWeight: 800,
        color: "#000000",
    },
});
