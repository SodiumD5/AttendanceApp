import { StyleSheet, View } from "react-native";
import Colors from "../components/Colors";

import AdminHeader from "../layout/AdminHeader";
import BigButton from "../components/BigButton";
import ShortButton from "../components/ShortButton";
import RectangleButton from "../components/RectangleButton";

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

            <RectangleButton
                message="로그아웃"
                onPress={() => navigation.popToTop()}></RectangleButton>
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
});
