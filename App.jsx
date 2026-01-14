import { StatusBar, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import StartPage from "./page/StartPage";
import AttendanceList from "./page/AttendanceList";
import Attendance from "./page/Attendance";
import AdminMenu from "./page/AdminMenu";
import MonthlyAttendance from "./page/MonthlyAttendance";
import AnnualLedger from "./page/AnnualLedger";
import Manage from "./page/Manage";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createStackNavigator();

export default function App() {
    return (
        <>
            <StatusBar barStyle="dark-content"></StatusBar>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="StartPage" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="StartPage" component={StartPage} />
                        <Stack.Screen name="AttendanceList" component={AttendanceList} />
                        <Stack.Screen name="Attendance" component={Attendance} />
                        <Stack.Screen name="AdminMenu" component={AdminMenu} />

                        <Stack.Screen name="MonthlyAttendance" component={MonthlyAttendance} />
                        <Stack.Screen name="AnnualLedger" component={AnnualLedger} />
                        <Stack.Screen name="Manage" component={Manage} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({});
