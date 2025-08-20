import { StyleSheet, View } from "react-native";
import Colors from "../components/Colors";

import AdminHeader from "../layout/AdminHeader";
import BigButton from "../components/BigButton";
import ShortButton from "../components/ShortButton";

const AdminMenu = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <AdminHeader menuName="관리자 메뉴"></AdminHeader>
            <BigButton
                context="월간 출근부"
                onPress={() => navigation.push("MonthlyAttendance")}></BigButton>
            <BigButton
                context="연차대장"
                onPress={() => navigation.push("AnnualLedger")}></BigButton>
            <BigButton context="교직원 관리" onPress={() => navigation.push("Manage")}></BigButton>

            <View style={styles.loginButton}>
                <ShortButton context="로그아웃" onPress={() => navigation.popToTop()}></ShortButton>
            </View>
        </View>
    );
};

export default AdminMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,

        alignItems: "center",
    },

    loginButton: {
        position: "absolute",
        bottom: 70,
    },
});
