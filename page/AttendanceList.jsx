import { StyleSheet, View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../components/Colors";
import RoundButton from "../components/RoundButton";
import GoBack from "../components/GoBack";
import { supabase } from "../lib/supabase";

const AttendanceList = ({ navigation }) => {
    const [staffInfo, setStaffInfo] = useState([]);

    useEffect(() => {
        const getStaffList = async () => {
            try {
                const { data, error } = await supabase.rpc("get_active_employee_list");

                if (error) {
                    throw error;
                }
                setStaffInfo(data || []);
            } catch (e) {
                console.log("failed to get employee list : ", e);
            }
        };

        getStaffList();
    }, []);

    return (
        <View style={styles.container}>
            <GoBack nav={navigation}></GoBack>
            <View style={styles.headerButton}>
                <MaterialCommunityIcons
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
                                employeeId: item.id,
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
