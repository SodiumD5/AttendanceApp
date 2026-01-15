import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "../components/Colors";
import LongButton from "../components/LongButton";
import GoBack from "../components/GoBack";
import { supabase } from "../lib/supabase";

// 날짜 및 시간 데이터 생성 함수
const getFormattedDateTime = () => {
    const now = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];

    return {
        month: now.getMonth() + 1,
        date: now.getDate(),
        dayKo: days[now.getDay()],
        hour: String(now.getHours()).padStart(2, "0"),
        minute: String(now.getMinutes()).padStart(2, "0"),
        dateStr: now.toISOString().split("T")[0],
    };
};

const Attendance = ({ navigation, route }) => {
    const { employeeName } = route.params;

    const [workState, setWorkState] = useState("not_work");
    const [datetime, setDatetime] = useState(getFormattedDateTime());
    const [useHalf, setUseHalf] = useState(false);
    const [useFull, setUseFull] = useState(false);

    const fetchWorkState = async () => {
        const { data, error } = await supabase.rpc("get_employee_status_and_category", {
            p_name: employeeName,
        });

        if (error) {
            console.error("fetch status error : ", error);
            return;
        }

        if (data && data[0]) {
            const { employee_status, rest_category } = data[0];
            setWorkState(employee_status ?? "not_work");
            if (rest_category) {
                setUseHalf(true);
                setUseFull(true);
            }
        }
    };

    useEffect(() => {
        fetchWorkState();
        const intervalId = setInterval(() => {
            setDatetime(getFormattedDateTime());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // workState 변경 시 연차 버튼 활성화 로직
    useEffect(() => {
        setUseFull(workState !== "not_work");
    }, [workState]);

    const changeWorkState = async (changeTo) => {
        setWorkState(changeTo);
        const { error } = await supabase.rpc("record_today_attendance", {
            p_name: employeeName,
            p_status: changeTo,
        });
        if (error) console.error("Attendance update error:", error);
    };

    const useRest = async (category) => {
        setUseHalf(true);
        setUseFull(true);
        if (category === "full") setWorkState("full");

        const { error } = await supabase.rpc("record_today_rest", {
            p_name: employeeName,
            p_category: category,
        });
        if (error) console.error("Rest update error:", error);
    };

    const renderCommuteButton = () => {
        if (workState === "not_work") {
            return <LongButton context="출근하기" onPress={() => changeWorkState("work")} />;
        }
        if (workState === "work") {
            return (
                <LongButton context="퇴근하기" bgColor={Colors.primary_green} onPress={() => changeWorkState("home")} />
            );
        }
        return <LongButton context="퇴근완료" bgColor={Colors.inactive_bg} textColor={Colors.inactive_text} />;
    };

    return (
        <View style={styles.container}>
            <GoBack nav={navigation} />

            <Text style={styles.title}>
                {datetime.month}월 {datetime.date}일 <Text style={styles.dayText}>({datetime.dayKo})</Text>
            </Text>
            <Text style={styles.subTitle}>
                {datetime.hour}시 {datetime.minute}분
            </Text>

            <View style={styles.imageContainer}>
                <View style={styles.buttonShadow} />
                <View style={styles.pictureWrapper}>
                    <Text style={styles.pictureText}>{employeeName}</Text>
                </View>
            </View>

            <View style={styles.mainButton}>{renderCommuteButton()}</View>

            <View style={styles.bottomContainer}>
                <Pressable disabled={useHalf} style={styles.button} onPress={() => useRest("half")}>
                    <Text style={[styles.buttonText, { color: useHalf ? Colors.primary_gray : Colors.text_gray }]}>
                        반차 사용
                    </Text>
                </Pressable>

                <Text style={styles.divider}>|</Text>

                <Pressable disabled={useFull} style={styles.button} onPress={() => useRest("full")}>
                    <Text style={[styles.buttonText, { color: useFull ? Colors.primary_gray : Colors.text_gray }]}>
                        연차 사용
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Attendance;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 10,
    },
    dayText: {
        fontSize: 30,
    },
    subTitle: {
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 20,
    },
    imageContainer: {
        position: "relative",
        marginBottom: 30,
    },
    pictureWrapper: {
        width: 200,
        height: 200,
        borderRadius: 50,
        backgroundColor: Colors.primary_gray,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonShadow: {
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
        fontWeight: "500",
    },
    mainButton: {
        width: "100%",
        alignItems: "center",
    },
    bottomContainer: {
        position: "absolute",
        bottom: 50,
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        paddingHorizontal: 15,
    },
    buttonText: {
        fontSize: 16,
    },
    divider: {
        fontSize: 16,
        color: Colors.text_gray,
    },
});
