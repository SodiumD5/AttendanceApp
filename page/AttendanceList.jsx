import { StyleSheet, View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";

import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import Colors from "../components/Colors";
import RoundButton from "../components/RoundButton";
import GoBack from "../components/GoBack";
import useUrlStore from "../store/urlStore";

const BaseUrl = useUrlStore.getState().BaseUrl;

const AttendanceList = ({ navigation }) => {
    const [staffInfo, setStaffInfo] = useState();

    useEffect(() => {
        const getStaffList = async () => {
            try {
                const response = await fetch(`${BaseUrl}/staff/active`);
                const info = await response.json();
                setStaffInfo(info);
            } catch (e) {
                console.log("failed to get staff list : ", e);
            }
        };

        getStaffList();
    }, []);

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
                data={staffInfo}
                numColumns={3}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <RoundButton
                        context={item.name}
                        onPress={() =>
                            navigation.push("Attendance", {
                                employeeName: item.name,
                            })
                        }
                    />
                )}
                bounces={false}
            />
        </View>
    );
};

export default AttendanceList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: "center",
    },

    headerButton: {
        position: "absolute",
        top: 20,
        right: 5,
        justifyContent: "flex-end",
    },

    title: {
        fontSize: 40,
        fontWeight: 800,
        margin: 20,

        marginBottom: 50,
        marginTop: 120,
    },

    setRow: {
        flexDirection: "row",
    },
});
