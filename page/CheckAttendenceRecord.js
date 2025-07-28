import { StyleSheet, View, Text } from "react-native";
import Colors from "../components/Colors";

import AdminHeader from "../layout/AdminHeader";

const CheckAttendenceRecord = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <AdminHeader nav={navigation} menuName="출근부 확인"></AdminHeader>
        </View>
    );
};

export default CheckAttendenceRecord;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.admin_background,

        alignItems: "center",
    },
});
