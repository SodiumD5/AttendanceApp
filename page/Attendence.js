import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "../components/Colors";

import RoundButton from "../components/RoundButton";
import LongButton from "../components/LongButton";
import GoBack from "../components/GoBack";

const Attendence = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <GoBack nav={navigation}></GoBack>

            <Text style={styles.title}>A월 B일</Text>
            <RoundButton
                context="직원A"
                wrapperStyle={styles.pictureWrapper}
                textStyle={styles.pictureText}
            />

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
        marginBottom: 12,
    },

    pictureWrapper: {
        width: 230,
        height: 230,
        borderRadius: 50,
        backgroundColor: Colors.primary_gray,
    },

    pictureText: {
        color: "#000000",
        fontSize: 25,
    },
});
