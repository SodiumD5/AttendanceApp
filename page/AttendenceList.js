import { StyleSheet, View, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../components/Colors";
import RoundButton from "../components/RoundButton";
import GoBack from "../components/GoBack";

const AttendenceList = ({ navigation }) => {
    let employeeList = ["직원A", "직원B", "직원C", "직원D", "직원E", "직원F", "신원미상", "은 신이다"];

    return (
        <View style={styles.container}>
            <GoBack nav={navigation}></GoBack>
            <View style={styles.headerButton}>
                <IconM
                    name="account-circle-outline"
                    size={50}
                    onPress={() => navigation.push("Login")}
                />
            </View>
            <Text style={styles.title}>출근 체크</Text>

            <FlatList
                data={employeeList}
                numColumns={2} 
                keyExtractor={(item, index) => index.toString()} 
                renderItem={({ item, index }) => (
                    <RoundButton
                        context={item} 
                        onPress={() =>
                            navigation.push("Attendence", {
                                employeeName: item,
                            })
                        }
                    />
                )}
                bounces={false}
            />
        </View>
    );
};

export default AttendenceList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary_background,
        alignItems: "center",
        justifyContent: "center",
    },

    headerButton: {
        position: "absolute",
        top: 30,
        right: 5,
        justifyContent: "flex-end",
    },

    title: {
        fontSize: 40,
        fontWeight: 800,
        margin: 27,

        marginBottom: 50,
        marginTop: 120,
    },

    setRow: {
        flexDirection: "row",
    },

});
