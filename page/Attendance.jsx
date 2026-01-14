import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "../components/Colors";

import LongButton from "../components/LongButton";
import GoBack from "../components/GoBack";
import { supabase } from "../lib/supabase";

class getDate {
    constructor() {
        let today = new Date();
        this.year = today.getFullYear();
        this.month = today.getMonth() + 1;
        this.date = today.getDate();
        this.hour = today.getHours();
        this.minute = today.getMinutes();
        this.second = today.getSeconds();

        this.day = today.getDay();
        this.dayToKo();
        this.dayToStr();

        this.time = new Date().toLocaleTimeString({
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    dayToKo() {
        const ko = ["일", "월", "화", "수", "목", "금", "토"];
        this.dayKo = ko[this.day];
    }

    dayToStr() {
        this.dateStr = `${this.year}-${String(this.month).padStart(2, "0")}-${String(this.date).padStart(2, "0")}`;
    }
}

const Attendance = ({ navigation, route }) => {
    const { employeeName } = route.params;

    const [workState, setWorkState] = useState("not_work");
    const [datetime, setDatetime] = useState({});
    const [usehalf, setUseHalf] = useState(false);
    const [usefull, setUseFull] = useState(false);

    const fetchWorkState = async (date) => {
        //화면 로딩 했을 때 기존 상태 데이터 가져오기
        const { data, error } = await supabase.rpc("get_employee_status_and_category", {
            p_name: employeeName,
        });

        if (error) {
            console.error("get_employee_status_and_category error : ", error);
            return;
        }

        const employeeData = data[0];
        setWorkState(employeeData?.employee_status ?? "not_work");
        if (employeeData.rest_category != null) {
            //restdata가 있을 경우 또 못 쓰게 막음.
            setUseHalf(true);
            setUseFull(true);
        }
    };

    useEffect(() => {
        //처음 시작할 때와 시간 업데이트
        const date = new getDate();
        setDatetime(date);
        fetchWorkState(date);

        const intervalId = setInterval(() => {
            const date = new getDate();
            setDatetime(date);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const changeWorkState = async ({ changeTo }) => {
        //출근, 퇴근 버튼 눌렀을 때
        setWorkState(changeTo);

        const { error } = await supabase.rpc("record_today_attendance", {
            p_name: employeeName,
            p_status: changeTo,
        });

        if (error) {
            console.error("Attendance update error:", error);
        }
    };

    const useRest = async ({ category }) => {
        //연차, 반차사용을 반영
        setUseHalf(true);
        setUseFull(true);
        if (category == "full") {
            setWorkState("full");
        }

        const { error } = await supabase.rpc("record_today_rest", {
            p_name: employeeName,
            p_category: category,
        });

        if (error) {
            console.error("Rest update error:", error);
        }
    };

    useEffect(() => {
        // 다른 어떤 버튼을 클릭시 연차 사용 불가
        if (workState == "not_work") {
            setUseFull(false);
        } else {
            setUseFull(true);
        }
    }, [workState]);

    const commute_button = () => {
        //not_work, work, home, full
        if (workState === "not_work") {
            return (
                <LongButton
                    context="출근하기"
                    onPress={() => {
                        changeWorkState({ changeTo: "work" });
                        // navigation.goBack();
                    }}
                />
            );
        } else if (workState === "work") {
            return (
                <LongButton
                    context="퇴근하기"
                    bgColor={Colors.primary_green}
                    onPress={() => {
                        changeWorkState({ changeTo: "home" });
                        // navigation.goBack();
                    }}
                />
            );
        } else {
            return <LongButton context="퇴근완료" bgColor={Colors.inactive_bg} textColor={Colors.inactive_text} />;
        }
    };

    return (
        <View style={styles.container}>
            <GoBack nav={navigation}></GoBack>

            <Text style={styles.title}>
                {datetime.month}월 {datetime.date}일 <Text style={{ fontSize: 30 }}>({datetime.dayKo})</Text>
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

            <View style={styles.mainButton}>{commute_button()}</View>

            <View style={styles.bottomContainer}>
                <Pressable style={styles.button} onPress={() => useRest({ category: "half" })}>
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                color: usehalf ? Colors.primary_gray : Colors.text_gray,
                            },
                        ]}
                    >
                        반차 사용
                    </Text>
                </Pressable>
                <Text style={styles.divider}>|</Text>
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        useRest({ category: "full" });
                        // navigation.goBack();
                    }}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                color: usefull ? Colors.primary_gray : Colors.text_gray,
                            },
                        ]}
                    >
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

    bottomContainer: {
        position: "absolute",
        bottom: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    button: {
        paddingHorizontal: 10,
    },
    buttonText: {
        fontSize: 16,
    },
    divider: {
        fontSize: 16,
        color: Colors.text_gray,
        marginHorizontal: 10,
    },
});
