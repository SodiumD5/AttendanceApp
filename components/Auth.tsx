import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "./Colors";
import LongButton from "./LongButton";
import { supabase } from "../lib/supabase";

type RootStackParamList = {
    Login: undefined;
    AdminMenu: { session: any };
};

export default function GoogleLoginButton() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        webClientId: "533008965338-hofop3944mkvq278d9vtc0iab4in7f51.apps.googleusercontent.com",
    });

    const handleGoogleSignIn = async () => {
        try {
            // await GoogleSignin.signOut();
            await GoogleSignin.hasPlayServices();
            const { data } = await GoogleSignin.signIn();

            if (data && data.idToken) {
                const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
                    provider: "google",
                    token: data.idToken,
                });

                if (authError) throw authError;

                const { data: isAdmin, error: rpcError } = await supabase.rpc("check_is_admin");

                if (rpcError) throw rpcError;

                if (isAdmin) {
                    console.log("관리자 확인 성공");
                    navigation.navigate("AdminMenu", { session: authData.session });
                } else {
                    alert("관리자 권한이 없습니다.");
                    await GoogleSignin.signOut();
                }
            }
        } catch (error: any) {
            console.log("에러 발생:", error.message);
        }
    };

    return (
        <LongButton
            context="관리자 로그인"
            bgColor={Colors.primary_white}
            textColor={Colors.text_gray}
            onPress={handleGoogleSignIn}
        />
    );
}
