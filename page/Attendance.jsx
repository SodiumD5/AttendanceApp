import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "../components/Colors";

import LongButton from "../components/LongButton";
import GoBack from "../components/GoBack";
import useUrlStore from "../store/urlStore";

const BaseUrl = useUrlStore.getState().BaseUrl;

const Attendance = ({ navigation, route }) => {
    const { employeeName } = route.params;

    const [workState, setWorkState] = useState("not_work");
    const [datetime, setDatetime] = useState({});
    const [usehalf, setUseHalf] = useState(false);
    const [usefull, setUseFull] = useState(false);

    const changeWorkState = async ({ changedStatus }) => {
        //버튼 눌렀을 때 출근, 퇴근 바꿔줌
        setWorkState(changedStatus);

        const now_time = `${datetime.hour}:${datetime.minute}`;
        const postData = {
            name: employeeName,
            year: datetime.year,
            month: datetime.month,
            day: datetime.day,
            time: now_time,
            status: changedStatus,
        };

        await fetch(`${BaseUrl}/staff/changing-state`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });
    };

    const useRest = async ({ category }) => {
        //연차, 반차사용을 반영
        setUseHalf(true);
        setUseFull(true);
        if (category == "full") {
            setWorkState("full");
        } else {
            setUseHalf(true);
        }

        const now_time = `${datetime.hour}:${datetime.minute}`;
        const postData = {
            name: employeeName,
            date: datetime.date,
            time: category == "half" ? now_time : null,
            category: category,
        };
        await fetch(`${BaseUrl}/staff/using-rest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });
    };

    const fetchWorkState = async (Datetime) => {
        //페이지 첫 로딩할 때, 상태 반영
        try {
            const url = `${BaseUrl}/staff/state/?name=${employeeName}&year=${Datetime.year}&month=${Datetime.month}&day=${Datetime.day}`;
            const response = await fetch(url);
            const response_body = await response.json();
            
            setWorkState(response_body["status"]);
            setUseHalf(response_body["ishalf"]);
        } catch (e) {
            console.error("Failed to fetch work state:", e);
        }
    };

    const fetchDatetime = async () => {
        try {
            const response = await fetch(`${BaseUrl}/staff/datetime`);
            const data = await response.json();
            setDatetime(data);

            return data;
        } catch (e) {
            console.error("Failed to fetch datetime:", e);
            return null;
        }
    };

    useEffect(() => {
        const updateDatetime = async () => {
            const data = await fetchDatetime();
            if (data) {
                await fetchWorkState(data);
            }
        };
        updateDatetime();

        const intervalId = setInterval(() => {
            updateDatetime();
        }, 1000 * 10);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (workState == "not_work") {
            setUseFull(false);
        } else {
            setUseFull(true);
        }
    }, [workState]);

    const commute_button = () => {
        //not_work, work, home, full
        if (workState === "work") {
            return (
                <LongButton
                    context="퇴근하기"
                    bgColor={Colors.primary_green}
                    onPress={() => changeWorkState({ changedStatus: "home" })}
                />
            );
        } else if (workState === "not_work") {
            return (
                <LongButton
                    context="출근하기"
                    onPress={() => changeWorkState({ changedStatus: "work" })}
                />
            );
        } else {
            return (
                <LongButton
                    context="퇴근완료"
                    bgColor={Colors.inactive_bg}
                    textColor={Colors.inactive_text}
                />
            );
        }
    };

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

            <View style={styles.mainButton}>{commute_button()}</View>

            <View style={styles.bottomContainer}>
                <Pressable style={styles.button} onPress={() => useRest({ category: "half" })}>
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                color: usehalf ? Colors.primary_gray : Colors.text_gray,
                            },
                        ]}>
                        반차 사용
                    </Text>
                </Pressable>
                <Text style={styles.divider}>|</Text>
                <Pressable style={styles.button} onPress={() => useRest({ category: "full" })}>
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                color: usefull ? Colors.primary_gray : Colors.text_gray,
                            },
                        ]}>
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
