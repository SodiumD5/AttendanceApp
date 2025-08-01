import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../components/Colors";

import LongButton from "../components/LongButton";
import GoBack from "../components/GoBack";

const Attendence = ({ navigation, route }) => {
    const { employeeName } = route.params;

    const [datetime, setDatetime] = useState({
        year: "",
        month: "",
        day: "",
        hour: "",
        minute: "",
        second: "",
    });

    useEffect(() => {
        const fetchDatetime = async () => {
            try {
                const response = await fetch(
                    "http://10.0.2.2:8000/get/datetime"
                );
                const data = await response.json();
                setDatetime(data);
            } catch (e) {
                console.error("Failed to fetch datetime:", e);
            }
        };

        fetchDatetime();

        const intervalId = setInterval(() => {
            fetchDatetime();
        }, 1000 * 60); //1분에 한 번씩 api받아오기
        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={styles.container}>
            <GoBack nav={navigation}></GoBack>

            <Text style={styles.title}>
                {datetime.month}월 {datetime.day}일
            </Text>
            <Text style={styles.subTitle}>
                {datetime.hour}시 {datetime.minute}분
            </Text>

            <View>
                <View style={styles.ButtonShadow} />
                <View style={styles.pictureWrapper}>
                    <Text style={styles.pictureText}>{employeeName}</Text>
                </View>
            </View>

            <View>
                <LongButton context="출근하기" />
                <LongButton context="퇴근하기" bgColor={Colors.primary_green} />
                <LongButton
                    context="반차사용"
                    bgColor={Colors.primary_white}
                    textColor={Colors.text_gray}
                />
                <LongButton
                    context="연차사용"
                    bgColor={Colors.primary_white}
                    textColor={Colors.text_gray}
                />
            </View>
        </View>
    );
};
export default Attendence;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary_background,
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontSize: 40,
        fontWeight: 900,
        marginBottom: 10,
    },

    subTitle: {
        fontSize: 20,
        fontWeight: 800,
        marginBottom: 20,
    },

    pictureWrapper: {
        position: "relative",
        width: 200,
        height: 200,
        borderRadius: 50,
        backgroundColor: Colors.primary_gray,
        marginBottom: 30,

        justifyContent: "center",
        alignItems: "center",
    },

    ButtonShadow: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 50,
        backgroundColor: "#C0C0C0",
        top: 5,
        left: 5,
    },

    pictureText: {
        color: "#000000",
        fontSize: 25,
        fontWeight: 500,
    },
});
