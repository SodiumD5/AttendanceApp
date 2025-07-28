import { StyleSheet, View, Text } from "react-native";
import Colors from "../components/Colors";

import AdminHeader from "../layout/AdminHeader";

const Manage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <AdminHeader nav={navigation} menuName="교직원 관리"></AdminHeader>
        </View>
    );
};

export default Manage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.admin_background,

        alignItems: "center",
    },
});
