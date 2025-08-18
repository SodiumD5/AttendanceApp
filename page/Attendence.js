import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "../components/Colors";

import LongButton from "../components/LongButton";
import GoBack from "../components/GoBack";

const Attendence = ({ navigation, route }) => {
    const { employeeName } = route.params;

    const [workState, setWorkState] = useState("");
    const [datetime, setDatetime] = useState({});
    const [usehalf, setUseHalf] = useState(false);
    const [usefull, setUseFull] = useState(false);

    const fetchDatetime = async () => {
        try {
            const response = await fetch("http://10.0.2.2:8000/get/datetime");
            const data = await response.json();
            setDatetime(data);

            return data;
        } catch (e) {
            console.error("Failed to fetch datetime:", e);
            return null;
        }
    };

    const changeWorkState = async ({ state }) => {
        setWorkState(state);
        const current_time = await fetchDatetime();
        if (!current_time) return;

        const postData = {
            name: employeeName,
            time: current_time.current_datetime,
            isWork: state,
        };

        const url = "http://10.0.2.2:8000/post/work";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });
        } catch (e) {
            console.error("Failed to post work data:", e);
        }
    };

    const usehalfRest = async () => {
        setUseHalf(true);
        const current_time = await fetchDatetime();
        if (!current_time) return;

        const postData = {
            name: employeeName,
            time: current_time.current_datetime,
        };
        const url = "http://10.0.2.2:8000/post/useHalf";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });
        } catch (e) {
            console.error("Failed to post work data:", e);
        }
    };

    const fetchWorkState = async (currentDatetime) => {
        try {
            const postData = {
                name: employeeName,
                time: currentDatetime.current_datetime,
            };
            const url = "http://10.0.2.2:8000/post/workstate";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });
            const response_body = await response.json();
            const record = response_body["data"];

            setWorkState(record["isWork"]);
            setUseHalf(record["isHalf"])
        } catch (e) {
            console.error("Failed to fetch work state:", e);
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
        }, 1000 * 20);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (workState === "home" || workState === "full") {
            setUseFull(true);
        }

        if (usehalf === true) {
            setUseHalf(true);
        }
    }, [workState, usehalf]);

    const commute_button = () => {
        //notwork, work, full, home
        if (workState === "work") {
            return (
                <LongButton
                    context="퇴근하기"
                    bgColor={Colors.primary_green}
                    onPress={() => changeWorkState({ state: "home" })}
                />
            );
        } else if (workState === "notwork") {
            return (
                <LongButton context="출근하기" onPress={() => changeWorkState({ state: "work" })} />
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
                <Pressable style={styles.button} onPress={usehalfRest}>
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
                <Pressable style={styles.button} onPress={() => changeWorkState({ state: "full" })}>
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
export default Attendence;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
