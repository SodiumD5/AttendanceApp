import {
    StyleSheet,
    View,
    Text,
    Pressable,
    TextInput,
    Image,
} from "react-native";
import { BlurView } from "expo-blur";
import Colors from "../components/Colors";

import { useNavigation } from "@react-navigation/native";

import ShortButton from "../components/ShortButton";
import GoBack from "../components/GoBack";

const Login = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <GoBack nav={navigation}></GoBack>
            <View>
                <BlurView intensity={100} style={styles.logoBackground}>
                    <Image
                        source={require("../assets/logo.png")}
                        style={styles.logo}
                    />
                </BlurView>
            </View>
            <Text style={styles.title}>관리자 로그인</Text>
            <Text style={styles.Text}>아이디</Text>
            <TextInput style={styles.TextBox}></TextInput>
            <Text style={styles.Text}>비밀번호</Text>
            <TextInput style={styles.TextBox}></TextInput>

            <View style={styles.loginButton}>
                <ShortButton
                    context="로그인하기"
                    onPress={() => navigation.push("AdminMenu")}
                ></ShortButton>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary_background,
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: 100,
        height: 100,
    },

    logoBackground: {
        width: 160,
        height: 160,
        backgroundColor: "#FFF8E1",
        borderRadius: "50%",

        justifyContent: "center",
        alignItems: "center",
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
    },

    loginButton: {
        position: "absolute",
        bottom: 70,
    },
});
