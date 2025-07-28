import { StyleSheet, View, Text } from "react-native";
import Colors from "../components/Colors";

import AdminHeader from "../layout/AdminHeader";

const AnnualLedger = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <AdminHeader nav={navigation} menuName="연차대장"></AdminHeader>
        
        </View>
    );
};

export default AnnualLedger;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.admin_background,

        alignItems: "center",
    },


});
