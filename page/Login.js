import { StyleSheet, View, Text, TextInput, Image, Alert, Keyboard, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";

import Colors from "../components/Colors";

import ShortButton from "../components/ShortButton";
import GoBack from "../components/GoBack";

const wrong_pw = () => {
    Alert.alert("비밀번호가 틀렸습니다.");
};

const Login = ({ navigation }) => {
    const [inputId, setinputId] = useState("");
    const [inputPw, setinputPw] = useState("");

    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const buttonBottom = useRef(new Animated.Value(70)).current;

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const handleLogin = async () => {
        const loginInfo = {
            id: inputId,
            pw: inputPw,
        };

        try {
            const url = "http://10.0.2.2:8000/post/loginInfo";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginInfo),
            });
            console.log("send success!");

            const result = await response.json();

            if (response.status == 400) {
                wrong_pw();
            } else {
                navigation.push("AdminMenu");
            }
            setinputId("");
            setinputPw("");
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
            setIsKeyboardVisible(true);
            Animated.timing(keyboardHeight, {
                toValue: -e.endCoordinates.height + 100,
                duration: 250,
                useNativeDriver: false,
            }).start();
            Animated.timing(buttonBottom, {
                toValue: e.endCoordinates.height - 130,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyboardVisible(false);
            Animated.timing(keyboardHeight, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
            Animated.timing(buttonBottom, {
                toValue: 70,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [keyboardHeight]);

    const containerStyle = {
        transform: [
            {
                translateY: keyboardHeight,
            },
        ],
    };

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <GoBack nav={navigation}></GoBack>
            {!isKeyboardVisible && (
                <View>
                    <Image source={require("../assets/admin.png")} style={styles.logo} />
                </View>
            )}
            <Text style={styles.title}>관리자 로그인</Text>
            <Text style={styles.Text}>아이디</Text>
            <TextInput
                style={styles.TextBox}
                value={inputId}
                onChangeText={(text) => setinputId(text)}
                autocomplete="off"
                autoCorrect={false}></TextInput>
            <Text style={styles.Text}>비밀번호</Text>
            <TextInput
                style={styles.TextBox}
                value={inputPw}
                onChangeText={(text) => setinputPw(text)}
                autocomplete="off"
                autoCorrect={false}></TextInput>

            <Animated.View style={[styles.loginButton, { bottom: buttonBottom }]}>
                <ShortButton context="로그인하기" onPress={handleLogin}></ShortButton>
            </Animated.View>
        </Animated.View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: 100,
        height: 100,

        marginBottom: 40,
    },

    title: {
        fontSize: 30,
        fontWeight: 600,
        marginBottom: 50,
    },

    Text: {
        fontSize: 20,
        width: "80%",
        textAlign: "left",
        margin: 10,
    },

    TextBox: {
        width: 340,
        height: 55,
        backgroundColor: Colors.primary_white,
        borderRadius: 20,
        marginBottom: 10,
        paddingLeft: 20,

        fontSize: 18,
        fontWeight: 500,
    },

    loginButton: {
        position: "absolute",
        bottom: 70,
    },
});
